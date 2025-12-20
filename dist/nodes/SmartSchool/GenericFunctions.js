"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSmartSchoolClient = getSmartSchoolClient;
const n8n_workflow_1 = require("n8n-workflow");
const smartschool_kit_1 = require("@abrianto/smartschool-kit");
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
//# sourceMappingURL=GenericFunctions.js.map