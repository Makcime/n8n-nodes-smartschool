import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
declare const Buffer: {
	from: (value: string, encoding: string) => { toString: (encoding: string) => string };
};

const xmlEscape = (value: string) =>
	value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');

const htmlEscape = (value: string) => xmlEscape(value);

const decodeXmlEntities = (value: string) =>
	value
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&amp;/g, '&');

const maybeDecodeBase64 = (value: string) => {
	if (!/^[A-Za-z0-9+/=\s]+$/.test(value)) {
		return value;
	}

	try {
		const decoded = Buffer.from(value, 'base64').toString('utf8');
		if (!decoded || decoded === value) {
			return value;
		}
		if (
			/^<\?xml|^</.test(decoded.trim()) ||
			/^\s*\{/.test(decoded) ||
			/^\s*\[/.test(decoded)
		) {
			return decoded;
		}
		return value;
	} catch {
		return value;
	}
};

export const parseXmlSimple = (xml: string) => {
	const cleaned = xml
		.replace(/<\?xml[\s\S]*?\?>/i, '')
		.replace(/<!DOCTYPE[\s\S]*?>/i, '')
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, (_, cdata) => cdata);

	type Node = {
		name: string;
		attributes: Record<string, string>;
		children: Node[];
		text: string;
	};

	const root: Node = { name: '__root__', attributes: {}, children: [], text: '' };
	const stack: Node[] = [root];
	const tagRegex = /<([^>]+)>/g;
	let lastIndex = 0;

	for (const match of cleaned.matchAll(tagRegex)) {
		const text = cleaned.slice(lastIndex, match.index).trim();
		if (text) {
			stack[stack.length - 1].text += text;
		}

		const tag = match[1];
		if (tag.startsWith('/')) {
			stack.pop();
		} else {
			const selfClosing = tag.endsWith('/');
			const [rawName, ...attrParts] = tag.replace(/\/$/, '').trim().split(/\s+/);
			const attrs: Record<string, string> = {};
			const attrRegex = /(\w+)=["']([^"']*)["']/g;
			const attrString = attrParts.join(' ');
			for (const attrMatch of attrString.matchAll(attrRegex)) {
				attrs[attrMatch[1]] = decodeXmlEntities(attrMatch[2]);
			}
			const node: Node = { name: rawName, attributes: attrs, children: [], text: '' };
			stack[stack.length - 1].children.push(node);
			if (!selfClosing) {
				stack.push(node);
			}
		}

		lastIndex = match.index + match[0].length;
	}

	const normalize = (node: Node): unknown => {
		const hasChildren = node.children.length > 0;
		const hasAttrs = Object.keys(node.attributes).length > 0;
		const text = node.text.trim();

		const result: Record<string, unknown> = {};
		if (hasAttrs) {
			result._attributes = node.attributes;
		}

		for (const child of node.children) {
			const value = normalize(child);
			if (result[child.name]) {
				const existing = result[child.name];
				result[child.name] = Array.isArray(existing) ? [...existing, value] : [existing, value];
			} else {
				result[child.name] = value;
			}
		}

		if (!hasChildren && !hasAttrs) {
			return text;
		}

		if (text) {
			result._text = text;
		}

		return result;
	};

	const normalized = normalize(root) as Record<string, unknown>;
	return normalized.__root__ ?? normalized;
};

const parseSoapResponse = async (xml: string) => {
	const faultMatch = xml.match(/<faultstring[^>]*>([\s\S]*?)<\/faultstring>/i);
	if (faultMatch?.[1]) {
		const message = decodeXmlEntities(faultMatch[1].trim());
		throw new Error(message);
	}

	const returnMatch = xml.match(/<return[^>]*>([\s\S]*?)<\/return>/i);
	if (!returnMatch?.[1]) {
		return xml;
	}

	const rawValue = decodeXmlEntities(returnMatch[1]).trim();
	const decodedValue = maybeDecodeBase64(rawValue);
	const normalizedValue = decodeXmlEntities(decodedValue).trim();
	if (normalizedValue === '') {
		return '';
	}

	if (normalizedValue === 'true' || normalizedValue === 'false') {
		return normalizedValue === 'true';
	}

	if (/^-?\d+(\.\d+)?$/.test(normalizedValue)) {
		return Number(normalizedValue);
	}

	if (
		(normalizedValue.startsWith('{') && normalizedValue.endsWith('}')) ||
		(normalizedValue.startsWith('[') && normalizedValue.endsWith(']'))
	) {
		try {
			return JSON.parse(normalizedValue);
		} catch {
			return normalizedValue;
		}
	}

	if (normalizedValue.startsWith('<')) {
		return parseXmlSimple(normalizedValue);
	}

	return normalizedValue;
};

export const plaintextToHtml = (value: string) => {
	const trimmed = value.trim();
	const escaped = htmlEscape(trimmed);
	if (!escaped) {
		return '<html><body></body></html>';
	}
	const paragraphs = escaped
		.split(/\n{2,}/)
		.map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
		.join('');
	return `<html><body>${paragraphs}</body></html>`;
};

export async function getSmartSchoolCredentials(this: IExecuteFunctions) {
	const credentials = (await this.getCredentials('smartSchoolApi')) as IDataObject;
	const apiEndpoint = credentials?.apiEndpoint as string | undefined;
	const accesscode = credentials?.accesscode as string | undefined;

	if (!apiEndpoint || !accesscode) {
		throw new NodeOperationError(
			this.getNode(),
			'SmartSchool credentials are not configured correctly.',
		);
	}

	return { apiEndpoint, accesscode };
}

export async function callSmartschoolSoap(
	this: IExecuteFunctions,
	method: string,
	params: Record<string, string | number | boolean>,
) {
	const { apiEndpoint } = await getSmartSchoolCredentials.call(this);
	const namespace = apiEndpoint;
	const paramXml = Object.entries(params)
		.map(([key, value]) => `<${key}>${xmlEscape(String(value))}</${key}>`)
		.join('');

	const envelope =
		`<?xml version="1.0" encoding="utf-8"?>` +
		`<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="${namespace}">` +
		`<soap:Body><tns:${method}>${paramXml}</tns:${method}></soap:Body>` +
		`</soap:Envelope>`;

	const response = await this.helpers.httpRequest({
		method: 'POST',
		url: apiEndpoint,
		headers: {
			'Content-Type': 'text/xml; charset=utf-8',
			SOAPAction: `${apiEndpoint}#${method}`,
		},
		body: envelope,
		json: false,
	});

	return parseSoapResponse(response);
}
