import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

const xmlEscape = (value: string) =>
	value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');

const decodeXmlEntities = (value: string) =>
	value
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&amp;/g, '&');

const parseSoapResponse = (xml: string) => {
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
	if (rawValue === '') {
		return '';
	}

	if (rawValue === 'true' || rawValue === 'false') {
		return rawValue === 'true';
	}

	if (/^-?\d+(\.\d+)?$/.test(rawValue)) {
		return Number(rawValue);
	}

	if (
		(rawValue.startsWith('{') && rawValue.endsWith('}')) ||
		(rawValue.startsWith('[') && rawValue.endsWith(']'))
	) {
		try {
			return JSON.parse(rawValue);
		} catch {
			return rawValue;
		}
	}

	return rawValue;
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

	return this.helpers.httpRequest({
		method: 'POST',
		url: apiEndpoint,
		headers: {
			'Content-Type': 'text/xml; charset=utf-8',
			SOAPAction: `${apiEndpoint}#${method}`,
		},
		body: envelope,
		json: false,
	}).then(parseSoapResponse);
}
