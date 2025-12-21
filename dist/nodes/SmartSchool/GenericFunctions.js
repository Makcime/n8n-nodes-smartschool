"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSmartSchoolClient = getSmartSchoolClient;
exports.callSmartschoolSoap = callSmartschoolSoap;
const n8n_workflow_1 = require("n8n-workflow");
const smartschool_kit_1 = require("@abrianto/smartschool-kit");
const schemas_1 = require("./shared/schemas");
const xmlEscape = (value) => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&apos;');
async function getSmartSchoolClient() {
    const credentials = (await this.getCredentials('smartSchoolApi'));
    const parsed = schemas_1.SmartSchoolCredentialsSchema.safeParse(credentials);
    if (!parsed.success) {
        const message = parsed.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join('; ');
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Invalid SmartSchool credentials: ${message}`);
    }
    return new smartschool_kit_1.SmartschoolClient({
        apiEndpoint: parsed.data.apiEndpoint,
        accesscode: parsed.data.accesscode,
    });
}
async function callSmartschoolSoap(method, params) {
    const credentials = (await this.getCredentials('smartSchoolApi'));
    const parsed = schemas_1.SmartSchoolCredentialsSchema.safeParse(credentials);
    if (!parsed.success) {
        const message = parsed.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join('; ');
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Invalid SmartSchool credentials: ${message}`);
    }
    const apiEndpoint = parsed.data.apiEndpoint;
    const namespace = apiEndpoint;
    const paramXml = Object.entries(params)
        .map(([key, value]) => `<${key}>${xmlEscape(String(value))}</${key}>`)
        .join('');
    const envelope = `<?xml version="1.0" encoding="utf-8"?>` +
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
//# sourceMappingURL=GenericFunctions.js.map