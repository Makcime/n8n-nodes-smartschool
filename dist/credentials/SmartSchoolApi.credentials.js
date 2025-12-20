"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartSchoolApi = void 0;
class SmartSchoolApi {
    constructor() {
        this.name = 'smartSchoolApi';
        this.displayName = 'SmartSchool API';
        this.icon = { light: 'file:../icons/smartschool.logo.svg', dark: 'file:../icons/smartschool.logo.dark.svg' };
        this.documentationUrl = 'https://schoolsync.gitbook.io/smartschool-kit';
        this.properties = [
            {
                displayName: 'API Endpoint',
                name: 'apiEndpoint',
                type: 'string',
                default: '',
                placeholder: 'https://myschool.smartschool.be/Webservices/V3',
                description: 'Base URL of your SmartSchool API endpoint',
                required: true,
            },
            {
                displayName: 'Access Code',
                name: 'accesscode',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                description: 'SmartSchool API access code',
                required: true,
            },
        ];
    }
}
exports.SmartSchoolApi = SmartSchoolApi;
//# sourceMappingURL=SmartSchoolApi.credentials.js.map