import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports
import { SmartschoolClient } from '@abrianto/smartschool-kit';

import { SmartSchoolCredentialsSchema } from './shared/schemas';

const xmlEscape = (value: string) =>
	value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/\"/g, '&quot;')
		.replace(/'/g, '&apos;');

export async function getSmartSchoolClient(this: IExecuteFunctions) {
	const credentials = (await this.getCredentials('smartSchoolApi')) as IDataObject;
	const parsed = SmartSchoolCredentialsSchema.safeParse(credentials);

	if (!parsed.success) {
		const message = parsed.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join('; ');
		throw new NodeOperationError(this.getNode(), `Invalid SmartSchool credentials: ${message}`);
	}

	return new SmartschoolClient({
		apiEndpoint: parsed.data.apiEndpoint,
		accesscode: parsed.data.accesscode,
	});
}

export async function callSmartschoolSoap(
	this: IExecuteFunctions,
	method: string,
	params: Record<string, string | number | boolean>,
) {
	const credentials = (await this.getCredentials('smartSchoolApi')) as IDataObject;
	const parsed = SmartSchoolCredentialsSchema.safeParse(credentials);

	if (!parsed.success) {
		const message = parsed.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join('; ');
		throw new NodeOperationError(this.getNode(), `Invalid SmartSchool credentials: ${message}`);
	}

	const apiEndpoint = parsed.data.apiEndpoint;
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
