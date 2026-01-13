"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeFetch = safeFetch;
const n8n_workflow_1 = require("n8n-workflow");
async function safeFetch(url, options) {
    try {
        const response = await fetch(url, options);
        if (response.status === 403) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `HTTP error! Forbidden (Status: ${response.status}). Check permissions, session cookies, or required headers.`);
        }
        if (response.status >= 500) {
            let responseText = '';
            try {
                responseText = await response.text();
            }
            catch (_) { }
            const snippet = responseText ? ` Response: ${responseText.slice(0, 500)}` : '';
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `HTTP error! Smartschool server seems to be down or unreachable. Status: ${response.status}.${snippet}`);
        }
        if (response.redirected) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Session seems invalid; redirected to ${response.url}. Are you using a valid PHPSESSID?`);
        }
        return response;
    }
    catch (error) {
        if (error instanceof n8n_workflow_1.NodeOperationError) {
            throw error;
        }
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Failed to fetch Smartschool data: ${error.message} (are you connected to the internet?)`);
    }
}
//# sourceMappingURL=safeFetch.js.map