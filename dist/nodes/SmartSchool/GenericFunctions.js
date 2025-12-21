"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSmartSchoolClient = getSmartSchoolClient;
exports.callSmartschoolSoap = callSmartschoolSoap;
const n8n_workflow_1 = require("n8n-workflow");
const smartschool_kit_1 = require("@abrianto/smartschool-kit");
const xmlEscape = (value) => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&apos;');
async function getSmartSchoolClient() {
    const credentials = (await this.getCredentials('smartSchoolApi'));
    if (!(credentials === null || credentials === void 0 ? void 0 : credentials.apiEndpoint) || !(credentials === null || credentials === void 0 ? void 0 : credentials.accesscode)) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'SmartSchool credentials are not configured correctly.');
    }
    return new smartschool_kit_1.SmartschoolClient({
        apiEndpoint: credentials.apiEndpoint,
        accesscode: credentials.accesscode,
    });
}
async function callSmartschoolSoap(method, params) {
    const credentials = (await this.getCredentials('smartSchoolApi'));
    if (!(credentials === null || credentials === void 0 ? void 0 : credentials.apiEndpoint)) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'SmartSchool credentials are not configured correctly.');
    }
    const apiEndpoint = credentials.apiEndpoint;
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