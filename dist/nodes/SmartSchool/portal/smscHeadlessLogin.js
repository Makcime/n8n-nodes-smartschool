"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smscHeadlessLogin = smscHeadlessLogin;
const n8n_workflow_1 = require("n8n-workflow");
async function smscHeadlessLogin(creds) {
    const normalizedDomain = creds.domain.replace(/^https?:\/\//, '').replace(/\/+$/, '');
    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Automatic portal login is not supported in the community node build. Generate a PHPSESSID manually for ${normalizedDomain} and use Validate Session instead.`);
}
//# sourceMappingURL=smscHeadlessLogin.js.map