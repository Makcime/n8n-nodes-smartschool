"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSmartSchoolCredentials = getSmartSchoolCredentials;
exports.callSmartschoolSoap = callSmartschoolSoap;
const n8n_workflow_1 = require("n8n-workflow");
const xmlEscape = (value) => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
const decodeXmlEntities = (value) => value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
const parseSoapResponse = (xml) => {
    const faultMatch = xml.match(/<faultstring[^>]*>([\s\S]*?)<\/faultstring>/i);
    if (faultMatch === null || faultMatch === void 0 ? void 0 : faultMatch[1]) {
        const message = decodeXmlEntities(faultMatch[1].trim());
        throw new Error(message);
    }
    const returnMatch = xml.match(/<return[^>]*>([\s\S]*?)<\/return>/i);
    if (!(returnMatch === null || returnMatch === void 0 ? void 0 : returnMatch[1])) {
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
    if ((rawValue.startsWith('{') && rawValue.endsWith('}')) ||
        (rawValue.startsWith('[') && rawValue.endsWith(']'))) {
        try {
            return JSON.parse(rawValue);
        }
        catch {
            return rawValue;
        }
    }
    return rawValue;
};
async function getSmartSchoolCredentials() {
    const credentials = (await this.getCredentials('smartSchoolApi'));
    const apiEndpoint = credentials === null || credentials === void 0 ? void 0 : credentials.apiEndpoint;
    const accesscode = credentials === null || credentials === void 0 ? void 0 : credentials.accesscode;
    if (!apiEndpoint || !accesscode) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'SmartSchool credentials are not configured correctly.');
    }
    return { apiEndpoint, accesscode };
}
async function callSmartschoolSoap(method, params) {
    const { apiEndpoint } = await getSmartSchoolCredentials.call(this);
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
    }).then(parseSoapResponse);
}
//# sourceMappingURL=GenericFunctions.js.map