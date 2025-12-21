"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartSchool = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
class SmartSchool {
    constructor() {
        this.description = {
            displayName: 'SmartSchool',
            name: 'smartSchool',
            icon: { light: 'file:smartschool.logo.svg', dark: 'file:smartschool.logo.dark.svg' },
            group: ['transform'],
            version: 1,
            description: 'Interact with the SmartSchool API',
            defaults: { name: 'SmartSchool' },
            subtitle: '={{$parameter.operation + ": " + $parameter.resource}}',
            inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            usableAsTool: true,
            credentials: [
                {
                    name: 'smartSchoolApi',
                    required: true,
                    testedBy: 'smartSchool',
                },
            ],
            requestDefaults: {
                baseURL: '={{$credentials.apiEndpoint}}',
            },
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    default: 'group',
                    options: [
                        {
                            name: 'Group',
                            value: 'group',
                        },
                        {
                            name: 'Helpdesk',
                            value: 'helpdesk',
                        },
                        {
                            name: 'Message',
                            value: 'message',
                        },
                        {
                            name: 'Account',
                            value: 'account',
                        },
                        {
                            name: 'Parameter',
                            value: 'parameter',
                        },
                        {
                            name: 'Absence',
                            value: 'absence',
                        },
                    ],
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    default: 'getUserDetails',
                    displayOptions: {
                        show: {
                            resource: ['account'],
                        },
                    },
                    options: [
                        {
                            name: 'Get User Details',
                            value: 'getUserDetails',
                            description: 'Get user details by SmartSchool identifier',
                            action: 'Get user details',
                        },
                        {
                            name: 'Get User Details by Number',
                            value: 'getUserDetailsByNumber',
                            description: 'Get user details by internal number',
                            action: 'Get user details by number',
                        },
                        {
                            name: 'Get User Details by Username',
                            value: 'getUserDetailsByUsername',
                            description: 'Get user details by username',
                            action: 'Get user details by username',
                        },
                        {
                            name: 'Get User Details by Scannable Code',
                            value: 'getUserDetailsByScannableCode',
                            description: 'Get user details by scannable code',
                            action: 'Get user details by scannable code',
                        },
                        {
                            name: 'Get User Official Class',
                            value: 'getUserOfficialClass',
                            description: 'Retrieve the official class for a user',
                            action: 'Get user official class',
                        },
                    ],
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    default: 'getAbsents',
                    displayOptions: {
                        show: {
                            resource: ['absence'],
                        },
                    },
                    options: [
                        {
                            name: 'Get Absents',
                            value: 'getAbsents',
                            description: 'Get absences for a user and school year',
                            action: 'Get absents',
                        },
                        {
                            name: 'Get Absents with Alias',
                            value: 'getAbsentsWithAlias',
                            description: 'Get absences with alias labels for a user and school year',
                            action: 'Get absents with alias',
                        },
                        {
                            name: 'Get Absents by Date',
                            value: 'getAbsentsByDate',
                            description: 'Get absences for all students on a date',
                            action: 'Get absents by date',
                        },
                        {
                            name: 'Get Absents with Alias by Date',
                            value: 'getAbsentsWithAliasByDate',
                            description: 'Get absences with aliases for all students on a date',
                            action: 'Get absents with alias by date',
                        },
                        {
                            name: 'Get Absents with Internal Number by Date',
                            value: 'getAbsentsWithInternalNumberByDate',
                            description: 'Get absences indexed by internal number for a date',
                            action: 'Get absents by internal number',
                        },
                        {
                            name: 'Get Absents with Username by Date',
                            value: 'getAbsentsWithUsernameByDate',
                            description: 'Get absences indexed by username for a date',
                            action: 'Get absents by username',
                        },
                        {
                            name: 'Get Absents by Date and Group',
                            value: 'getAbsentsByDateAndGroup',
                            description: 'Get absences for a date filtered by group',
                            action: 'Get absents by date and group',
                        },
                    ],
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    default: 'getAllAccounts',
                    displayOptions: {
                        show: {
                            resource: ['group'],
                        },
                    },
                    options: [
                        {
                            name: 'Get All Accounts',
                            value: 'getAllAccounts',
                            description: 'List all user accounts from a SmartSchool group',
                            action: 'Get all accounts',
                        },
                        {
                            name: 'Get All Accounts (Extended)',
                            value: 'getAllAccountsExtended',
                            description: 'List all user accounts from a SmartSchool group with extended metadata',
                            action: 'Get all accounts extended',
                        },
                        {
                            name: 'Get All Groups and Classes',
                            value: 'getAllGroupsAndClasses',
                            description: 'Retrieve the entire group/class hierarchy',
                            action: 'Get all groups and classes',
                        },
                        {
                            name: 'Get Class List (CSV)',
                            value: 'getClassList',
                            description: 'Download the class list in CSV format',
                            action: 'Get class list csv',
                        },
                        {
                            name: 'Get Class List (JSON)',
                            value: 'getClassListJson',
                            description: 'Download the class list in JSON format',
                            action: 'Get class list json',
                        },
                        {
                            name: 'Get Class Teachers',
                            value: 'getClassTeachers',
                            description: 'List titular teachers per class',
                            action: 'Get class teachers',
                        },
                    ],
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    default: 'getReferenceField',
                    displayOptions: {
                        show: {
                            resource: ['parameter'],
                        },
                    },
                    options: [
                        {
                            name: 'Get Reference Field',
                            value: 'getReferenceField',
                            description: 'Retrieve the reference field configuration',
                            action: 'Get reference field',
                        },
                    ],
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    default: 'sendMsg',
                    displayOptions: {
                        show: {
                            resource: ['message'],
                        },
                    },
                    options: [
                        {
                            name: 'Send Message',
                            value: 'sendMsg',
                            description: 'Send a SmartSchool message to a user or co-account',
                            action: 'Send SmartSchool message',
                        },
                    ],
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    default: 'getHelpdeskMiniDbItems',
                    displayOptions: {
                        show: {
                            resource: ['helpdesk'],
                        },
                    },
                    options: [
                        {
                            name: 'List Helpdesk Items',
                            value: 'getHelpdeskMiniDbItems',
                            description: 'List available helpdesk mini database items',
                            action: 'List helpdesk items',
                        },
                        {
                            name: 'Create Helpdesk Ticket',
                            value: 'addHelpdeskTicket',
                            description: 'Add a new ticket to the SmartSchool helpdesk',
                            action: 'Create helpdesk ticket',
                        },
                    ],
                },
                {
                    displayName: 'Group Code',
                    name: 'code',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Unique code that identifies the class or group',
                    displayOptions: {
                        show: {
                            resource: ['group', 'absence'],
                            operation: [
                                'getAllAccounts',
                                'getAllAccountsExtended',
                                'getAbsentsByDateAndGroup',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Include Subgroups',
                    name: 'recursive',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to include the accounts of all descendant subgroups (SmartSchool expects 1 or 0)',
                    displayOptions: {
                        show: {
                            resource: ['group'],
                            operation: ['getAllAccounts', 'getAllAccountsExtended'],
                        },
                    },
                },
                {
                    displayName: 'Get All Owners',
                    name: 'getAllOwners',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to retrieve every titular teacher per class instead of only the first',
                    displayOptions: {
                        show: {
                            resource: ['group'],
                            operation: ['getClassTeachers'],
                        },
                    },
                },
                {
                    displayName: 'School Year',
                    name: 'schoolYear',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'School year to retrieve absences for (YYYY)',
                    displayOptions: {
                        show: {
                            resource: ['absence'],
                            operation: ['getAbsents', 'getAbsentsWithAlias'],
                        },
                    },
                },
                {
                    displayName: 'Absence Date',
                    name: 'absenceDate',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Date to retrieve absences for (YYYY-MM-DD)',
                    displayOptions: {
                        show: {
                            resource: ['absence'],
                            operation: [
                                'getAbsentsByDate',
                                'getAbsentsWithAliasByDate',
                                'getAbsentsWithInternalNumberByDate',
                                'getAbsentsWithUsernameByDate',
                                'getAbsentsByDateAndGroup',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Title',
                    name: 'title',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Subject line for the helpdesk ticket or message',
                    displayOptions: {
                        show: {
                            resource: ['helpdesk', 'message'],
                            operation: ['addHelpdeskTicket', 'sendMsg'],
                        },
                    },
                },
                {
                    displayName: 'Description',
                    name: 'ticketDescription',
                    type: 'string',
                    typeOptions: {
                        rows: 4,
                    },
                    default: '',
                    required: true,
                    description: 'Explain the problem or request in detail',
                    displayOptions: {
                        show: {
                            resource: ['helpdesk'],
                            operation: ['addHelpdeskTicket'],
                        },
                    },
                },
                {
                    displayName: 'Message Body',
                    name: 'messageBody',
                    type: 'string',
                    typeOptions: {
                        rows: 4,
                    },
                    default: '',
                    required: true,
                    description: 'Content of the SmartSchool message',
                    displayOptions: {
                        show: {
                            resource: ['message'],
                            operation: ['sendMsg'],
                        },
                    },
                },
                {
                    displayName: 'Priority',
                    name: 'priority',
                    type: 'number',
                    typeOptions: {
                        minValue: 1,
                        maxValue: 5,
                    },
                    default: 3,
                    description: '1 = low, 3 = normal, 5 = high (values depend on your SmartSchool setup)',
                    displayOptions: {
                        show: {
                            resource: ['helpdesk'],
                            operation: ['addHelpdeskTicket'],
                        },
                    },
                },
                {
                    displayName: 'Mini Database Item ID',
                    name: 'miniDbItem',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Identifier of the helpdesk category item (retrieve via the "List Helpdesk Items" operation)',
                    displayOptions: {
                        show: {
                            resource: ['helpdesk'],
                            operation: ['addHelpdeskTicket'],
                        },
                    },
                },
                {
                    displayName: 'User Identifier',
                    name: 'userIdentifier',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Username or identifier of the ticket creator, recipient, or lookup target',
                    displayOptions: {
                        show: {
                            resource: ['helpdesk', 'message', 'account', 'absence'],
                            operation: [
                                'addHelpdeskTicket',
                                'sendMsg',
                                'getUserDetails',
                                'getUserOfficialClass',
                                'getAbsents',
                                'getAbsentsWithAlias',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Internal Number',
                    name: 'internalNumber',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Internal SmartSchool number of the user',
                    displayOptions: {
                        show: {
                            resource: ['account'],
                            operation: ['getUserDetailsByNumber'],
                        },
                    },
                },
                {
                    displayName: 'Username',
                    name: 'accountUsername',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'SmartSchool username',
                    displayOptions: {
                        show: {
                            resource: ['account'],
                            operation: ['getUserDetailsByUsername'],
                        },
                    },
                },
                {
                    displayName: 'Scannable Code',
                    name: 'scannableCode',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Scannable code linked to the user (badge/UUID)',
                    displayOptions: {
                        show: {
                            resource: ['account'],
                            operation: ['getUserDetailsByScannableCode'],
                        },
                    },
                },
                {
                    displayName: 'Official Class Date',
                    name: 'officialClassDate',
                    type: 'string',
                    default: '',
                    description: 'Date (YYYY-MM-DD). Leave empty to use today',
                    displayOptions: {
                        show: {
                            resource: ['account'],
                            operation: ['getUserOfficialClass'],
                        },
                    },
                },
                {
                    displayName: 'Sender Identifier',
                    name: 'senderIdentifier',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Identifier of the account sending the message (use "Null" to hide sender)',
                    displayOptions: {
                        show: {
                            resource: ['message'],
                            operation: ['sendMsg'],
                        },
                    },
                },
                {
                    displayName: 'Send to Co-Account',
                    name: 'coaccount',
                    type: 'number',
                    typeOptions: {
                        minValue: 0,
                    },
                    default: 0,
                    description: '0 = main account, 1 = first co-account, etc.',
                    displayOptions: {
                        show: {
                            resource: ['message'],
                            operation: ['sendMsg'],
                        },
                    },
                },
                {
                    displayName: 'Copy to LVS',
                    name: 'copyToLVS',
                    type: 'boolean',
                    default: false,
                    description: 'Copy the message to the SmartSchool LVS (student tracking system)',
                    displayOptions: {
                        show: {
                            resource: ['message'],
                            operation: ['sendMsg'],
                        },
                    },
                },
                {
                    displayName: 'Attachments',
                    name: 'attachments',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                    },
                    default: {},
                    description: 'Optional base64-encoded attachments',
                    displayOptions: {
                        show: {
                            resource: ['message'],
                            operation: ['sendMsg'],
                        },
                    },
                    options: [
                        {
                            displayName: 'Attachment',
                            name: 'attachment',
                            values: [
                                {
                                    displayName: 'Filename',
                                    name: 'filename',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'File Data (Base64)',
                                    name: 'filedata',
                                    type: 'string',
                                    typeOptions: {
                                        rows: 4,
                                    },
                                    default: '',
                                },
                            ],
                        },
                    ],
                },
            ],
        };
    }
    async execute() {
        var _a;
        const items = this.getInputData();
        const returnData = [];
        const client = await GenericFunctions_1.getSmartSchoolClient.call(this);
        const credentials = (await this.getCredentials('smartSchoolApi'));
        const accesscode = credentials.accesscode;
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            const normalizeAndPush = (data) => {
                if (Array.isArray(data)) {
                    for (const entry of data) {
                        returnData.push({
                            json: (entry !== null && entry !== void 0 ? entry : {}),
                            pairedItem: { item: itemIndex },
                        });
                    }
                    return;
                }
                returnData.push({
                    json: (data !== null && data !== void 0 ? data : {}),
                    pairedItem: { item: itemIndex },
                });
            };
            try {
                const resource = this.getNodeParameter('resource', itemIndex);
                const operation = this.getNodeParameter('operation', itemIndex);
                if (resource === 'group' &&
                    (operation === 'getAllAccounts' || operation === 'getAllAccountsExtended')) {
                    const code = this.getNodeParameter('code', itemIndex);
                    const recursive = this.getNodeParameter('recursive', itemIndex, false);
                    const recursiveFlag = recursive ? '1' : '0';
                    const params = {
                        accesscode,
                        code,
                        recursive: recursiveFlag,
                    };
                    const response = operation === 'getAllAccounts'
                        ? await client.getAllAccounts(params)
                        : await client.getAllAccountsExtended(params);
                    if (Array.isArray(response)) {
                        for (const entry of response) {
                            returnData.push({
                                json: entry,
                                pairedItem: { item: itemIndex },
                            });
                        }
                    }
                    else {
                        returnData.push({
                            json: response,
                            pairedItem: { item: itemIndex },
                        });
                    }
                    continue;
                }
                if (resource === 'group') {
                    if (operation === 'getAllGroupsAndClasses') {
                        const response = await client.getAllGroupsAndClasses();
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getClassList') {
                        const response = (await client.getClassList());
                        returnData.push({
                            json: { csv: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'getClassListJson') {
                        const response = await client.getClassListJson();
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getClassTeachers') {
                        const getAllOwners = this.getNodeParameter('getAllOwners', itemIndex, false);
                        const response = await client.getClassTeachers({
                            accesscode,
                            getAllOwners,
                        });
                        normalizeAndPush(response);
                        continue;
                    }
                }
                if (resource === 'account') {
                    if (operation === 'getUserDetails') {
                        const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                        const response = await client.getUserDetails({
                            accesscode,
                            userIdentifier,
                        });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getUserDetailsByNumber') {
                        const number = this.getNodeParameter('internalNumber', itemIndex);
                        const response = await client.getUserDetailsByNumber({
                            accesscode,
                            number,
                        });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getUserDetailsByUsername') {
                        const username = this.getNodeParameter('accountUsername', itemIndex);
                        const response = await client.getUserDetailsByUsername({
                            accesscode,
                            username,
                        });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getUserDetailsByScannableCode') {
                        const scannableCode = this.getNodeParameter('scannableCode', itemIndex);
                        const response = await client.getUserDetailsByScannableCode({
                            accesscode,
                            scannableCode,
                        });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getUserOfficialClass') {
                        const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                        const date = this.getNodeParameter('officialClassDate', itemIndex, '') ||
                            new Date().toISOString().slice(0, 10);
                        const response = await client.getUserOfficialClass({
                            accesscode,
                            userIdentifier,
                            date,
                        });
                        normalizeAndPush(response);
                        continue;
                    }
                }
                if (resource === 'absence') {
                    if (operation === 'getAbsents' || operation === 'getAbsentsWithAlias') {
                        const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                        const schoolYear = this.getNodeParameter('schoolYear', itemIndex);
                        const response = operation === 'getAbsents'
                            ? await client.getAbsents({ accesscode, userIdentifier, schoolYear })
                            : await client.getAbsentsWithAlias({ accesscode, userIdentifier, schoolYear });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getAbsentsByDate') {
                        const date = this.getNodeParameter('absenceDate', itemIndex);
                        const response = await client.getAbsentsByDate({ accesscode, date });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getAbsentsWithAliasByDate') {
                        const date = this.getNodeParameter('absenceDate', itemIndex);
                        const response = await client.getAbsentsWithAliasByDate({ accesscode, date });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getAbsentsWithInternalNumberByDate') {
                        const date = this.getNodeParameter('absenceDate', itemIndex);
                        const response = await client.getAbsentsWithInternalNumberByDate({ accesscode, date });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getAbsentsWithUsernameByDate') {
                        const date = this.getNodeParameter('absenceDate', itemIndex);
                        const response = await client.getAbsentsWithUsernameByDate({ accesscode, date });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getAbsentsByDateAndGroup') {
                        const date = this.getNodeParameter('absenceDate', itemIndex);
                        const code = this.getNodeParameter('code', itemIndex);
                        const response = await client.getAbsentsByDateAndGroup({ accesscode, date, code });
                        normalizeAndPush(response);
                        continue;
                    }
                }
                if (resource === 'helpdesk') {
                    if (operation === 'getHelpdeskMiniDbItems') {
                        const response = (await client.getHelpdeskMiniDbItems());
                        if (Array.isArray(response)) {
                            for (const entry of response) {
                                returnData.push({
                                    json: entry,
                                    pairedItem: { item: itemIndex },
                                });
                            }
                        }
                        else {
                            returnData.push({
                                json: response,
                                pairedItem: { item: itemIndex },
                            });
                        }
                        continue;
                    }
                    if (operation === 'addHelpdeskTicket') {
                        const title = this.getNodeParameter('title', itemIndex);
                        const description = this.getNodeParameter('ticketDescription', itemIndex);
                        const priority = this.getNodeParameter('priority', itemIndex);
                        const miniDbItem = this.getNodeParameter('miniDbItem', itemIndex);
                        const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                        const response = await client.addHelpdeskTicket({
                            accesscode,
                            title,
                            description,
                            priority,
                            miniDbItem,
                            userIdentifier,
                        });
                        const ticketResult = typeof response === 'object' && response !== null
                            ? response
                            : { success: response };
                        returnData.push({
                            json: ticketResult,
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                }
                if (resource === 'message' && operation === 'sendMsg') {
                    const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                    const title = this.getNodeParameter('title', itemIndex);
                    const body = this.getNodeParameter('messageBody', itemIndex);
                    const senderIdentifier = this.getNodeParameter('senderIdentifier', itemIndex);
                    const coaccount = this.getNodeParameter('coaccount', itemIndex, 0);
                    const copyToLVS = this.getNodeParameter('copyToLVS', itemIndex, false);
                    const attachmentCollection = this.getNodeParameter('attachments', itemIndex, {});
                    const payload = {
                        accesscode,
                        userIdentifier,
                        title,
                        body,
                        senderIdentifier,
                        coaccount,
                        copyToLVS,
                    };
                    const attachmentValues = ((_a = attachmentCollection.attachment) !== null && _a !== void 0 ? _a : []);
                    const cleanedAttachments = attachmentValues.filter((entry) => (entry === null || entry === void 0 ? void 0 : entry.filename) && (entry === null || entry === void 0 ? void 0 : entry.filedata));
                    if (cleanedAttachments.length) {
                        payload.attachments = cleanedAttachments;
                    }
                    const response = await client.sendMsg(payload);
                    returnData.push({
                        json: { success: response },
                        pairedItem: { item: itemIndex },
                    });
                    continue;
                }
                if (resource === 'parameter' && operation === 'getReferenceField') {
                    const response = await client.getReferenceField();
                    normalizeAndPush(response);
                    continue;
                }
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported resource "${resource}" or operation "${operation}"`, { itemIndex });
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error instanceof Error ? error.message : 'Unknown error',
                        },
                        pairedItem: { item: itemIndex },
                    });
                    continue;
                }
                if (error instanceof n8n_workflow_1.NodeOperationError) {
                    throw error;
                }
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, { itemIndex });
            }
        }
        return [returnData];
    }
}
exports.SmartSchool = SmartSchool;
//# sourceMappingURL=SmartSchool.node.js.map