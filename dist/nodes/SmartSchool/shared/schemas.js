"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartSchoolCredentialsSchema = void 0;
const zod_1 = require("zod");
exports.SmartSchoolCredentialsSchema = zod_1.z.object({
    apiEndpoint: zod_1.z.string().url('API Endpoint must be a valid URL'),
    accesscode: zod_1.z.string().min(1, 'Access code is required'),
});
//# sourceMappingURL=schemas.js.map