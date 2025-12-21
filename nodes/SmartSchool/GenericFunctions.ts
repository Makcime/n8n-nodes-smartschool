import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports
import { SmartschoolClient } from '@abrianto/smartschool-kit';

const xmlEscape = (value: string) =>
	value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/\"/g, '&quot;')
		.replace(/'/g, '&apos;');

export async function getSmartSchoolClient(this: IExecuteFunctions) {
	const credentials = (await this.getCredentials('smartSchoolApi')) as IDataObject;

	if (!credentials?.apiEndpoint || !credentials?.accesscode) {
		throw new NodeOperationError(this.getNode(), 'SmartSchool credentials are not configured correctly.');
	}

	return new SmartschoolClient({
		apiEndpoint: credentials.apiEndpoint as string,
		accesscode: credentials.accesscode as string,
	});
}

export async function callSmartschoolSoap(
	this: IExecuteFunctions,
	method: string,
	params: Record<string, string | number | boolean>,
) {
	const credentials = (await this.getCredentials('smartSchoolApi')) as IDataObject;

	if (!credentials?.apiEndpoint) {
		throw new NodeOperationError(this.getNode(), 'SmartSchool credentials are not configured correctly.');
	}

	const apiEndpoint = credentials.apiEndpoint as string;
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
	});
}
