"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartSchoolPortal = void 0;
const fast_xml_parser_1 = require("fast-xml-parser");
const n8n_workflow_1 = require("n8n-workflow");
const safeFetch_1 = require("./portal/safeFetch");
const smscHeadlessLogin_1 = require("./portal/smscHeadlessLogin");
class SmartSchoolPortal {
    constructor() {
        this.description = {
            displayName: 'SmartSchool Portal',
            name: 'smartSchoolPortal',
            icon: { light: 'file:smartschool.logo.svg', dark: 'file:smartschool.logo.dark.svg' },
            group: ['transform'],
            version: 1,
            description: 'Interact with SmartSchool portal endpoints',
            defaults: { name: 'SmartSchool Portal' },
            subtitle: '={{$parameter.operation}}',
            inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            credentials: [
                {
                    name: 'SmartschoolPortalApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    default: 'generateSession',
                    options: [
                        {
                            name: 'Generate Session',
                            value: 'generateSession',
                            description: 'Log in and return PHPSESSID + user ID',
                            action: 'Generate session',
                        },
                        {
                            name: 'Validate Session',
                            value: 'validateSession',
                            description: 'Check whether a PHPSESSID is still valid',
                            action: 'Validate session',
                        },
                        {
                            name: 'Fetch Planner',
                            value: 'fetchPlanner',
                            description: 'Fetch planner items for a date range',
                            action: 'Fetch planner',
                        },
                        {
                            name: 'Get Planner Elements',
                            value: 'getPlannerElements',
                            description: 'Fetch planner elements for a date range (raw)',
                            action: 'Get planner elements',
                        },
                        {
                            name: 'Get Planner Calendars (Accessible)',
                            value: 'getPlannerCalendarsAccessible',
                            description: 'Fetch accessible platform calendars',
                            action: 'Get planner calendars accessible',
                        },
                        {
                            name: 'Get Planner Calendars (Readable)',
                            value: 'getPlannerCalendarsReadable',
                            description: 'Fetch readable platform calendars',
                            action: 'Get planner calendars readable',
                        },
                        {
                            name: 'Fetch Email Inbox',
                            value: 'fetchEmailInbox',
                            description: 'Fetch inbox messages via SmartSchool web endpoints',
                            action: 'Fetch email inbox',
                        },
                        {
                            name: 'Fetch Email',
                            value: 'fetchEmail',
                            description: 'Fetch a single inbox message by ID',
                            action: 'Fetch email',
                        },
                        {
                            name: 'Fetch Results',
                            value: 'fetchResults',
                            description: 'Fetch latest results for the account',
                            action: 'Fetch results',
                        },
                        {
                            name: 'Get Course List',
                            value: 'getPortalCourses',
                            description: 'Fetch course list from the Smartschool portal',
                            action: 'Get course list',
                        },
                        {
                            name: 'Update Course Schedule Codes',
                            value: 'updatePortalCourseScheduleCodes',
                            description: 'Replace schedule codes for a portal course',
                            action: 'Update course schedule codes',
                        },
                        {
                            name: 'Get Gradebook Templates',
                            value: 'getGradebookTemplates',
                            description: 'Fetch Skore gradebook templates',
                            action: 'Get gradebook templates',
                        },
                        {
                            name: 'Get Gradebook Config',
                            value: 'getGradebookConfig',
                            description: 'Fetch Skore gradebook configuration for a template',
                            action: 'Get gradebook config',
                        },
                        {
                            name: 'Get Gradebook Pupil Tree',
                            value: 'getGradebookPupilTree',
                            description: 'Fetch class and pupil hierarchy for the gradebook',
                            action: 'Get gradebook pupil tree',
                        },
                        {
                            name: 'Get Gradebook Categories',
                            value: 'getGradebookCategories',
                            description: 'Fetch gradebook categories for a template',
                            action: 'Get gradebook categories',
                        },
                        {
                            name: 'Get Gradebook Category Grades (Pupil)',
                            value: 'getGradebookCategoryGradesByPupil',
                            description: 'Fetch pupil grades for a gradebook category',
                            action: 'Get gradebook category grades by pupil',
                        },
                        {
                            name: 'Get Gradebook Category Grades (Group)',
                            value: 'getGradebookOtherCategoryGradesByGroup',
                            description: 'Fetch group grades for a gradebook category',
                            action: 'Get gradebook category grades by group',
                        },
                        {
                            name: 'Get Presence Config',
                            value: 'getPresenceConfig',
                            description: 'Fetch allowed classes and hour mappings for presences',
                            action: 'Get presence config',
                        },
                        {
                            name: 'Get Presence Class',
                            value: 'getPresenceClass',
                            description: 'Fetch raw presence entries for a class and hour',
                            action: 'Get presence class',
                        },
                        {
                            name: 'Get Presence Day (All Classes)',
                            value: 'getPresenceDayAllClasses',
                            description: 'Fetch and flatten presence entries for all classes and hours',
                            action: 'Get presence day all classes',
                        },
                    ],
                },
                {
                    displayName: 'PHPSESSID',
                    name: 'phpSessId',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Session cookie returned by Generate Session',
                    displayOptions: {
                        show: {
                            operation: [
                                'validateSession',
                                'fetchPlanner',
                                'getPlannerElements',
                                'getPlannerCalendarsAccessible',
                                'getPlannerCalendarsReadable',
                                'fetchEmailInbox',
                                'fetchEmail',
                                'fetchResults',
                                'getPortalCourses',
                                'updatePortalCourseScheduleCodes',
                                'getGradebookTemplates',
                                'getGradebookConfig',
                                'getGradebookPupilTree',
                                'getGradebookCategories',
                                'getGradebookCategoryGradesByPupil',
                                'getGradebookOtherCategoryGradesByGroup',
                                'getPresenceConfig',
                                'getPresenceClass',
                                'getPresenceDayAllClasses',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Portal Cookies',
                    name: 'portalCookieHeader',
                    type: 'string',
                    default: '',
                    description: 'Optional cookie header from Generate Session (use when portal endpoints require more than PHPSESSID)',
                    displayOptions: {
                        show: {
                            operation: [
                                'validateSession',
                                'fetchPlanner',
                                'getPlannerElements',
                                'getPlannerCalendarsAccessible',
                                'getPlannerCalendarsReadable',
                                'fetchEmailInbox',
                                'fetchEmail',
                                'fetchResults',
                                'getPortalCourses',
                                'updatePortalCourseScheduleCodes',
                                'getGradebookTemplates',
                                'getGradebookConfig',
                                'getGradebookPupilTree',
                                'getGradebookCategories',
                                'getGradebookCategoryGradesByPupil',
                                'getGradebookOtherCategoryGradesByGroup',
                                'getPresenceConfig',
                                'getPresenceClass',
                                'getPresenceDayAllClasses',
                            ],
                        },
                    },
                },
                {
                    displayName: 'User ID',
                    name: 'userId',
                    type: 'string',
                    default: '',
                    required: false,
                    description: 'Smartschool numeric user ID returned by Generate Session',
                    displayOptions: {
                        show: {
                            operation: ['fetchPlanner', 'getPlannerElements'],
                        },
                    },
                },
                {
                    displayName: 'From Date',
                    name: 'fromDate',
                    type: 'dateTime',
                    default: '',
                    required: true,
                    description: 'Start date for planner items',
                    displayOptions: {
                        show: {
                            operation: ['fetchPlanner', 'getPlannerElements'],
                        },
                    },
                },
                {
                    displayName: 'To Date',
                    name: 'toDate',
                    type: 'dateTime',
                    default: '',
                    required: true,
                    description: 'End date for planner items',
                    displayOptions: {
                        show: {
                            operation: ['fetchPlanner', 'getPlannerElements'],
                        },
                    },
                },
                {
                    displayName: 'Types',
                    name: 'types',
                    type: 'multiOptions',
                    default: ['planned-assignments'],
                    description: 'Planner item types to fetch',
                    displayOptions: {
                        show: {
                            operation: ['fetchPlanner'],
                        },
                    },
                    options: [
                        {
                            name: 'Planned Assignments',
                            value: 'planned-assignments',
                        },
                        {
                            name: 'Planned To-Dos',
                            value: 'planned-to-dos',
                        },
                        {
                            name: 'Planned Lesson Cluster Assignments',
                            value: 'planned-lesson-cluster-assignments',
                        },
                    ],
                },
                {
                    displayName: 'Email ID',
                    name: 'mailId',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'ID of the email to fetch',
                    displayOptions: {
                        show: {
                            operation: ['fetchEmail'],
                        },
                    },
                },
                {
                    displayName: 'Mailbox',
                    name: 'mailbox',
                    type: 'options',
                    default: 'inbox',
                    description: 'Mailbox to fetch messages from',
                    displayOptions: {
                        show: {
                            operation: ['fetchEmailInbox', 'fetchEmail'],
                        },
                    },
                    options: [
                        {
                            name: 'Inbox',
                            value: 'inbox',
                        },
                        {
                            name: 'Sent',
                            value: 'outbox',
                        },
                    ],
                },
                {
                    displayName: 'Amount of Results (latest first)',
                    name: 'amountOfResults',
                    type: 'number',
                    default: 9999,
                    required: true,
                    typeOptions: {
                        minValue: 1,
                    },
                    displayOptions: {
                        show: {
                            operation: ['fetchResults'],
                        },
                    },
                },
                {
                    displayName: 'Course ID',
                    name: 'portalCourseId',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Course ID from Get Course List',
                    displayOptions: {
                        show: {
                            operation: ['updatePortalCourseScheduleCodes'],
                        },
                    },
                },
                {
                    displayName: 'Schedule Codes',
                    name: 'portalScheduleCodes',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Comma/semicolon-separated or JSON array of schedule codes',
                    displayOptions: {
                        show: {
                            operation: ['updatePortalCourseScheduleCodes'],
                        },
                    },
                },
                {
                    displayName: 'Gradebook Context (JSON)',
                    name: 'gradebookContext',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Context JSON payload from the Skore gradebook requests',
                    displayOptions: {
                        show: {
                            operation: [
                                'getGradebookTemplates',
                                'getGradebookConfig',
                                'getGradebookPupilTree',
                                'getGradebookCategories',
                                'getGradebookCategoryGradesByPupil',
                                'getGradebookOtherCategoryGradesByGroup',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Gradebook Template (JSON)',
                    name: 'gradebookTemplate',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Template JSON payload from the Skore gradebook requests',
                    displayOptions: {
                        show: {
                            operation: [
                                'getGradebookConfig',
                                'getGradebookCategories',
                                'getGradebookCategoryGradesByPupil',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Gradebook Pupil (JSON)',
                    name: 'gradebookPupil',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Pupil JSON payload from the Skore gradebook requests',
                    displayOptions: {
                        show: {
                            operation: ['getGradebookCategoryGradesByPupil'],
                        },
                    },
                },
                {
                    displayName: 'Gradebook Group (JSON)',
                    name: 'gradebookGroup',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Group JSON payload from the Skore gradebook requests',
                    displayOptions: {
                        show: {
                            operation: ['getGradebookOtherCategoryGradesByGroup'],
                        },
                    },
                },
                {
                    displayName: 'Gradebook Class',
                    name: 'gradebookClass',
                    type: 'string',
                    default: '',
                    required: false,
                    description: 'Class value for group gradebook requests (leave empty when not needed)',
                    displayOptions: {
                        show: {
                            operation: ['getGradebookOtherCategoryGradesByGroup'],
                        },
                    },
                },
                {
                    displayName: 'Presence Group ID',
                    name: 'presenceGroupId',
                    type: 'number',
                    default: 0,
                    required: true,
                    description: 'Group/class ID for the presence request',
                    displayOptions: {
                        show: {
                            operation: ['getPresenceConfig', 'getPresenceClass', 'getPresenceDayAllClasses'],
                        },
                    },
                },
                {
                    displayName: 'Presence Date',
                    name: 'presenceDate',
                    type: 'dateTime',
                    default: '',
                    required: true,
                    description: 'Date for the presence request',
                    displayOptions: {
                        show: {
                            operation: ['getPresenceConfig', 'getPresenceClass', 'getPresenceDayAllClasses'],
                        },
                    },
                },
                {
                    displayName: 'Presence User ID',
                    name: 'presenceUserId',
                    type: 'number',
                    default: 0,
                    required: true,
                    description: 'User ID required to request a presence token',
                    displayOptions: {
                        show: {
                            operation: ['getPresenceConfig', 'getPresenceClass', 'getPresenceDayAllClasses'],
                        },
                    },
                },
                {
                    displayName: 'Presence Hour ID',
                    name: 'presenceHourId',
                    type: 'number',
                    default: 0,
                    required: true,
                    description: 'Hour ID from presence config hourBlocks',
                    displayOptions: {
                        show: {
                            operation: ['getPresenceClass'],
                        },
                    },
                },
                {
                    displayName: 'Official',
                    name: 'presenceOfficial',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to fetch official presences',
                    displayOptions: {
                        show: {
                            operation: ['getPresenceClass', 'getPresenceDayAllClasses'],
                        },
                    },
                },
                {
                    displayName: 'Only Active Hours',
                    name: 'presenceOnlyActiveHours',
                    type: 'boolean',
                    default: false,
                    description: 'Only fetch hours marked active in the presence config',
                    displayOptions: {
                        show: {
                            operation: ['getPresenceDayAllClasses'],
                        },
                    },
                },
                {
                    displayName: 'Class IDs (comma-separated)',
                    name: 'presenceClassIds',
                    type: 'string',
                    default: '',
                    description: 'Optional list of class/group IDs to limit the export',
                    displayOptions: {
                        show: {
                            operation: ['getPresenceDayAllClasses'],
                        },
                    },
                },
            ],
        };
    }
    async execute() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const items = this.getInputData();
        const returnData = [];
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            const operation = this.getNodeParameter('operation', itemIndex);
            const sessionCreds = await this.getCredentials('SmartschoolPortalApi');
            const normalizedDomain = sessionCreds.domain
                .replace(/^https?:\/\//, '')
                .replace(/\/+$/, '');
            const parsePortalJson = async (response, label) => {
                try {
                    return await response.json();
                }
                catch (error) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Failed to parse ${label} response to JSON, check your PHPSESSID and/or User ID: ${error.message}`, { itemIndex });
                }
            };
            const parsePortalJsonParam = (value, label) => {
                const trimmed = value.trim();
                if (!trimmed) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `${label} is required`, { itemIndex });
                }
                try {
                    return JSON.stringify(JSON.parse(trimmed));
                }
                catch (error) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Invalid JSON for ${label}: ${error.message}`, { itemIndex });
                }
            };
            const parseScheduleCodes = (value) => {
                if (value === null || value === undefined) {
                    return [];
                }
                const trimmed = String(value).trim();
                if (!trimmed) {
                    return [];
                }
                if (trimmed.startsWith('[')) {
                    try {
                        const parsed = JSON.parse(trimmed);
                        if (!Array.isArray(parsed)) {
                            throw new Error('Expected an array of schedule codes');
                        }
                        return parsed.map((entry) => String(entry)).filter((entry) => entry.length > 0);
                    }
                    catch (error) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Invalid Schedule Codes JSON: ${error.message}`, { itemIndex });
                    }
                }
                return trimmed
                    .split(/[\s,;]+/)
                    .map((entry) => entry.trim())
                    .filter(Boolean);
            };
            const portalCookieHeader = this.getNodeParameter('portalCookieHeader', itemIndex, '');
            const buildCookieHeader = (phpSessId) => {
                const trimmed = portalCookieHeader.trim();
                return trimmed.length > 0 ? trimmed : `PHPSESSID=${phpSessId}`;
            };
            const postGradebook = async (endpoint, params, phpSessId) => {
                const body = Object.entries(params)
                    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                    .join('&');
                const response = await safeFetch_1.safeFetch.call(this, `https://${normalizedDomain}/Gradebook/Main/${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        cookie: buildCookieHeader(phpSessId),
                    },
                    body,
                });
                return await parsePortalJson(response, `gradebook ${endpoint}`);
            };
            if (operation === 'generateSession') {
                const result = await (0, smscHeadlessLogin_1.smscHeadlessLogin)(sessionCreds);
                const userIdRaw = result.userId ? String(result.userId) : '';
                let userIdNumeric = null;
                if (userIdRaw) {
                    const parts = userIdRaw.split('_');
                    const candidate = parts.length >= 2 ? parts[1] : userIdRaw;
                    const parsed = Number(candidate);
                    if (!Number.isNaN(parsed)) {
                        userIdNumeric = parsed;
                    }
                }
                returnData.push({
                    json: {
                        success: true,
                        phpSessId: result.phpSessId,
                        userId: result.userId,
                        cookieHeader: result.cookieHeader,
                        userIdNumeric,
                    },
                    pairedItem: { item: itemIndex },
                });
                continue;
            }
            if (operation === 'validateSession') {
                const phpSessId = this.getNodeParameter('phpSessId', itemIndex);
                const response = await fetch(`https://${normalizedDomain}`, {
                    headers: {
                        cookie: buildCookieHeader(phpSessId),
                    },
                });
                returnData.push({
                    json: { valid: !response.redirected },
                    pairedItem: { item: itemIndex },
                });
                continue;
            }
            if (operation === 'fetchPlanner') {
                const phpSessId = this.getNodeParameter('phpSessId', itemIndex);
                const userId = this.getNodeParameter('userId', itemIndex);
                const fromDate = this.getNodeParameter('fromDate', itemIndex);
                const toDate = this.getNodeParameter('toDate', itemIndex);
                const types = this.getNodeParameter('types', itemIndex).toString();
                const plannerUrl = `https://${normalizedDomain}/planner/api/v1/planned-elements/user/${userId}?from=${fromDate.split('T')[0]}&to=${toDate.split('T')[0]}&types=${types}`;
                const response = await safeFetch_1.safeFetch.call(this, plannerUrl, {
                    headers: {
                        cookie: buildCookieHeader(phpSessId),
                    },
                });
                const data = await parsePortalJson(response, 'planner');
                returnData.push({
                    json: { plannerData: data },
                    pairedItem: { item: itemIndex },
                });
                continue;
            }
            if (operation === 'getPlannerElements') {
                const phpSessId = this.getNodeParameter('phpSessId', itemIndex);
                const userIdParam = this.getNodeParameter('userId', itemIndex, '');
                const inputUserId = (_c = (_b = (_a = this.getInputData()[itemIndex]) === null || _a === void 0 ? void 0 : _a.json) === null || _b === void 0 ? void 0 : _b.userId) !== null && _c !== void 0 ? _c : '';
                const userId = userIdParam || inputUserId;
                if (!userId) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'User ID is required for planner elements. Provide it in the node parameters or pass it from Generate Session.', { itemIndex });
                }
                const fromDate = this.getNodeParameter('fromDate', itemIndex);
                const toDate = this.getNodeParameter('toDate', itemIndex);
                const plannerUrl = `https://${normalizedDomain}/planner/api/v1/planned-elements/user/${userId}?from=${fromDate}&to=${toDate}`;
                const response = await safeFetch_1.safeFetch.call(this, plannerUrl, {
                    headers: {
                        cookie: buildCookieHeader(phpSessId),
                    },
                });
                const data = await parsePortalJson(response, 'planner elements');
                returnData.push({
                    json: { plannerElements: data },
                    pairedItem: { item: itemIndex },
                });
                continue;
            }
            if (operation === 'getPlannerCalendarsAccessible') {
                const phpSessId = this.getNodeParameter('phpSessId', itemIndex);
                const response = await safeFetch_1.safeFetch.call(this, `https://${normalizedDomain}/planner/api/v1/calendars/accessible-platform-calendars`, {
                    headers: {
                        cookie: buildCookieHeader(phpSessId),
                    },
                });
                const data = await parsePortalJson(response, 'planner calendars accessible');
                returnData.push({
                    json: { plannerCalendarsAccessible: data },
                    pairedItem: { item: itemIndex },
                });
                continue;
            }
            if (operation === 'getPlannerCalendarsReadable') {
                const phpSessId = this.getNodeParameter('phpSessId', itemIndex);
                const response = await safeFetch_1.safeFetch.call(this, `https://${normalizedDomain}/planner/api/v1/calendars/readable-platform-calendars`, {
                    headers: {
                        cookie: buildCookieHeader(phpSessId),
                    },
                });
                const data = await parsePortalJson(response, 'planner calendars readable');
                returnData.push({
                    json: { plannerCalendarsReadable: data },
                    pairedItem: { item: itemIndex },
                });
                continue;
            }
            if (operation === 'fetchResults') {
                const phpSessId = this.getNodeParameter('phpSessId', itemIndex);
                const amountOfResults = this.getNodeParameter('amountOfResults', itemIndex);
                const resultsUrl = `https://${normalizedDomain}/results/api/v1/evaluations/?pageNumber=1&itemsOnPage=${amountOfResults}`;
                const response = await safeFetch_1.safeFetch.call(this, resultsUrl, {
                    headers: {
                        cookie: buildCookieHeader(phpSessId),
                    },
                });
                const data = await parsePortalJson(response, 'results');
                returnData.push({
                    json: { resultsData: data },
                    pairedItem: { item: itemIndex },
                });
                continue;
            }
            if (operation === 'getPortalCourses') {
                const phpSessId = this.getNodeParameter('phpSessId', itemIndex);
                const coursesUrl = `https://${normalizedDomain}/course-list/api/v1/courses`;
                const response = await safeFetch_1.safeFetch.call(this, coursesUrl, {
                    headers: {
                        accept: '*/*',
                        'content-type': 'application/json',
                        cookie: buildCookieHeader(phpSessId),
                    },
                });
                const data = await parsePortalJson(response, 'course list');
                returnData.push({
                    json: { courses: data },
                    pairedItem: { item: itemIndex },
                });
                continue;
            }
            if (operation === 'updatePortalCourseScheduleCodes') {
                const phpSessId = this.getNodeParameter('phpSessId', itemIndex);
                const courseId = this.getNodeParameter('portalCourseId', itemIndex);
                const scheduleCodesRaw = this.getNodeParameter('portalScheduleCodes', itemIndex);
                const scheduleCodes = parseScheduleCodes(scheduleCodesRaw);
                const updateUrl = `https://${normalizedDomain}/course-list/api/v1/courses/${courseId}/change-schedule-codes`;
                const response = await safeFetch_1.safeFetch.call(this, updateUrl, {
                    method: 'POST',
                    headers: {
                        accept: '*/*',
                        'content-type': 'application/json',
                        cookie: buildCookieHeader(phpSessId),
                        origin: `https://${normalizedDomain}`,
                        referer: `https://${normalizedDomain}/`,
                    },
                    body: JSON.stringify({ newScheduleCodes: scheduleCodes }),
                });
                const data = await parsePortalJson(response, 'course schedule update');
                returnData.push({
                    json: { course: data },
                    pairedItem: { item: itemIndex },
                });
                continue;
            }
            if (operation === 'getGradebookTemplates' ||
                operation === 'getGradebookConfig' ||
                operation === 'getGradebookPupilTree' ||
                operation === 'getGradebookCategories' ||
                operation === 'getGradebookCategoryGradesByPupil' ||
                operation === 'getGradebookOtherCategoryGradesByGroup') {
                const phpSessId = this.getNodeParameter('phpSessId', itemIndex);
                const contextRaw = this.getNodeParameter('gradebookContext', itemIndex);
                const context = parsePortalJsonParam(contextRaw, 'Gradebook Context');
                let data;
                if (operation === 'getGradebookTemplates') {
                    data = await postGradebook('getTemplateList', { context }, phpSessId);
                }
                else if (operation === 'getGradebookConfig') {
                    const templateRaw = this.getNodeParameter('gradebookTemplate', itemIndex);
                    const template = parsePortalJsonParam(templateRaw, 'Gradebook Template');
                    data = await postGradebook('getGradebookConfig', { context, template }, phpSessId);
                }
                else if (operation === 'getGradebookPupilTree') {
                    data = await postGradebook('getPupilTree', { context }, phpSessId);
                }
                else if (operation === 'getGradebookCategories') {
                    const templateRaw = this.getNodeParameter('gradebookTemplate', itemIndex);
                    const template = parsePortalJsonParam(templateRaw, 'Gradebook Template');
                    data = await postGradebook('getCategoriesList', { context, template }, phpSessId);
                }
                else if (operation === 'getGradebookCategoryGradesByPupil') {
                    const templateRaw = this.getNodeParameter('gradebookTemplate', itemIndex);
                    const pupilRaw = this.getNodeParameter('gradebookPupil', itemIndex);
                    const template = parsePortalJsonParam(templateRaw, 'Gradebook Template');
                    const pupil = parsePortalJsonParam(pupilRaw, 'Gradebook Pupil');
                    data = await postGradebook('getCategoryGradesByPupil', {
                        context,
                        template,
                        pupil,
                    }, phpSessId);
                }
                else {
                    const groupRaw = this.getNodeParameter('gradebookGroup', itemIndex);
                    const group = parsePortalJsonParam(groupRaw, 'Gradebook Group');
                    const classValue = this.getNodeParameter('gradebookClass', itemIndex);
                    data = await postGradebook('getOtherCategoryGradesByGroup', {
                        context,
                        class: classValue !== null && classValue !== void 0 ? classValue : '',
                        group,
                    }, phpSessId);
                }
                const gradebookData = data;
                returnData.push({
                    json: { gradebookData },
                    pairedItem: { item: itemIndex },
                });
                continue;
            }
            if (operation === 'getPresenceConfig' ||
                operation === 'getPresenceClass' ||
                operation === 'getPresenceDayAllClasses') {
                const phpSessId = this.getNodeParameter('phpSessId', itemIndex);
                const presenceGroupId = this.getNodeParameter('presenceGroupId', itemIndex);
                const presenceDate = this.getNodeParameter('presenceDate', itemIndex);
                const presenceUserId = this.getNodeParameter('presenceUserId', itemIndex);
                const presenceDateOnly = presenceDate.split('T')[0];
                const tokenResponse = await safeFetch_1.safeFetch.call(this, `https://${normalizedDomain}/Topnav/Node/getToken`, {
                    method: 'POST',
                    headers: {
                        accept: '*/*',
                        'content-type': 'text/plain',
                        cookie: buildCookieHeader(phpSessId),
                        'x-requested-with': 'XMLHttpRequest',
                    },
                    body: JSON.stringify({ userID: presenceUserId }),
                });
                const presenceToken = (await tokenResponse.text()).trim();
                const presenceTokenHeaders = {
                    'x-smsc-token': presenceToken,
                    'smsc-token': presenceToken,
                    'x-token': presenceToken,
                };
                const fetchPresenceConfig = async () => {
                    var _a, _b, _c;
                    const response = await safeFetch_1.safeFetch.call(this, `https://${normalizedDomain}/Presence/Main/getConfig`, {
                        method: 'POST',
                        headers: {
                            accept: 'application/json, text/javascript, */*; q=0.01',
                            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            cookie: buildCookieHeader(phpSessId),
                            'x-requested-with': 'XMLHttpRequest',
                            ...presenceTokenHeaders,
                        },
                        body: `route_controller=photoview&route_subcontroller=&groupID=${encodeURIComponent(String(presenceGroupId))}&userID=${encodeURIComponent(String(presenceUserId))}&date=${encodeURIComponent(presenceDateOnly)}&token=${encodeURIComponent(presenceToken)}`,
                    });
                    const data = await parsePortalJson(response, 'presence config');
                    const config = data;
                    const main = ((_a = config.main) !== null && _a !== void 0 ? _a : {});
                    const allowedClasses = ((_b = main.allowedClasses) !== null && _b !== void 0 ? _b : []);
                    const hourBlocks = ((_c = main.hourBlocks) !== null && _c !== void 0 ? _c : []);
                    return { config, allowedClasses, hourBlocks };
                };
                const fetchPresenceClass = async (classId, hourId) => {
                    const response = await safeFetch_1.safeFetch.call(this, `https://${normalizedDomain}/Presence/Class/getClass`, {
                        method: 'POST',
                        headers: {
                            accept: 'application/json, text/javascript, */*; q=0.01',
                            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            cookie: buildCookieHeader(phpSessId),
                            'x-requested-with': 'XMLHttpRequest',
                            ...presenceTokenHeaders,
                        },
                        body: [
                            `classID=${encodeURIComponent(String(classId))}`,
                            `hourID=${encodeURIComponent(String(hourId))}`,
                            `startDate=${encodeURIComponent(presenceDateOnly)}`,
                            `official=${this.getNodeParameter('presenceOfficial', itemIndex)
                                ? '1'
                                : '0'}`,
                            'partOfDay=',
                            'includeClass=1',
                            'includePupils=true',
                            'includePupilPhoto=true',
                            'currentPupilsOnly=true',
                            'includePresences=true',
                            'includeDefault=true',
                            'defaultPresenceMutation=false',
                            `userID=${encodeURIComponent(String(presenceUserId))}`,
                            `token=${encodeURIComponent(presenceToken)}`,
                        ].join('&'),
                    });
                    return await parsePortalJson(response, 'presence class');
                };
                if (operation === 'getPresenceConfig') {
                    const { config, allowedClasses, hourBlocks } = await fetchPresenceConfig();
                    returnData.push({
                        json: { presenceConfig: config, allowedClasses, hourBlocks },
                        pairedItem: { item: itemIndex },
                    });
                    continue;
                }
                if (operation === 'getPresenceClass') {
                    const presenceHourId = this.getNodeParameter('presenceHourId', itemIndex);
                    const data = await fetchPresenceClass(presenceGroupId, presenceHourId);
                    returnData.push({
                        json: { presenceClass: data },
                        pairedItem: { item: itemIndex },
                    });
                    continue;
                }
                const { allowedClasses, hourBlocks } = await fetchPresenceConfig();
                const presenceOnlyActiveHours = this.getNodeParameter('presenceOnlyActiveHours', itemIndex);
                const presenceClassIdsRaw = this.getNodeParameter('presenceClassIds', itemIndex);
                const classIdFilter = presenceClassIdsRaw
                    .split(/[\s,]+/)
                    .map((value) => value.trim())
                    .filter(Boolean)
                    .map((value) => Number(value))
                    .filter((value) => !Number.isNaN(value));
                const classesToFetch = classIdFilter.length > 0
                    ? allowedClasses.filter((entry) => classIdFilter.includes(entry.groupID))
                    : allowedClasses;
                const hoursToFetch = presenceOnlyActiveHours
                    ? hourBlocks.filter((hour) => Boolean(hour.active))
                    : hourBlocks;
                const rows = [];
                for (const classEntry of classesToFetch) {
                    const classId = classEntry.groupID;
                    const className = classEntry.name;
                    for (const hourEntry of hoursToFetch) {
                        const hourId = hourEntry.hourID;
                        const hourTitle = hourEntry.title;
                        const classData = (await fetchPresenceClass(classId, hourId));
                        const pupils = ((_d = classData.pupils) !== null && _d !== void 0 ? _d : []);
                        for (const pupil of pupils) {
                            const presences = ((_e = pupil.presence) !== null && _e !== void 0 ? _e : []);
                            for (const presence of presences) {
                                const code = ((_f = presence.code) !== null && _f !== void 0 ? _f : {});
                                rows.push({
                                    classId,
                                    className,
                                    hourId,
                                    hourTitle,
                                    presenceDate: (_g = presence.presenceDate) !== null && _g !== void 0 ? _g : presenceDateOnly,
                                    pupilId: (_h = pupil.userID) !== null && _h !== void 0 ? _h : pupil.userId,
                                    pupilName: pupil.name,
                                    pupilSurname: pupil.surname,
                                    pupilFullName: (_j = pupil.nameBIN) !== null && _j !== void 0 ? _j : pupil.name,
                                    presenceId: presence.presenceID,
                                    codeId: (_k = presence.codeID) !== null && _k !== void 0 ? _k : code.codeID,
                                    codeName: code.name,
                                    codeColor: code.color,
                                    isOfficial: (_l = code.isOfficial) !== null && _l !== void 0 ? _l : presence.isOfficial,
                                    lastAuthorName: presence.lastAuthorName,
                                    lastAuthorUserIdentifier: presence.lastAuthorUserIdentifier,
                                    encodedAt: presence.date,
                                    movementId: presence.movementID,
                                });
                            }
                        }
                    }
                }
                returnData.push({
                    json: { presenceRows: rows },
                    pairedItem: { item: itemIndex },
                });
                continue;
            }
            if (operation === 'fetchEmailInbox' || operation === 'fetchEmail') {
                const phpSessId = this.getNodeParameter('phpSessId', itemIndex);
                const mailbox = this.getNodeParameter('mailbox', itemIndex);
                const parser = new fast_xml_parser_1.XMLParser({
                    ignoreAttributes: false,
                    trimValues: true,
                    parseTagValue: true,
                    htmlEntities: true,
                });
                const fetchMailWithCommand = async (commandXml) => {
                    const response = await safeFetch_1.safeFetch.call(this, `https://${normalizedDomain}/?module=Messages&file=dispatcher`, {
                        headers: {
                            'content-type': 'application/x-www-form-urlencoded',
                            cookie: buildCookieHeader(phpSessId),
                        },
                        body: `command=${encodeURIComponent(commandXml)}`,
                        method: 'POST',
                    });
                    const body = await response.text();
                    return parser.parse(body);
                };
                if (operation === 'fetchEmailInbox') {
                    const fetchInboxCommand = `<request>
						<command>
							<subsystem>postboxes</subsystem>
							<action>message list</action>
							<params>
								<param name="boxType"><![CDATA[${mailbox}]]></param>
								<param name="boxID"><![CDATA[0]]></param>
								<param name="sortField"><![CDATA[date]]></param>
								<param name="sortKey"><![CDATA[desc]]></param>
								<param name="poll"><![CDATA[false]]></param>
								<param name="poll_ids"><![CDATA[]]></param>
								<param name="layout"><![CDATA[new]]></param>
							</params>
						</command>
					</request>`;
                    const fetchMoreMailsCommand = `<request>
						<command>
							<subsystem>postboxes</subsystem>
							<action>continue_messages</action>
							<params>
								<param name="boxID"><![CDATA[0]]></param>
								<param name="boxType"><![CDATA[${mailbox}]]></param>
								<param name="layout"><![CDATA[new]]></param>
							</params>
						</command>
					</request>`;
                    const mails = [];
                    const startMailsJson = await fetchMailWithCommand(fetchInboxCommand);
                    let moreMails = false;
                    for (const msg of startMailsJson.server.response.actions.action[0].data.messages.message) {
                        mails.push(msg);
                    }
                    for (const msg of startMailsJson.server.response.actions.action) {
                        if (msg.command === 'continue_messages') {
                            moreMails = true;
                        }
                    }
                    while (moreMails) {
                        moreMails = false;
                        const moreMailsJson = await fetchMailWithCommand(fetchMoreMailsCommand);
                        for (const msg of moreMailsJson.server.response.actions.action[0].data.messages.message) {
                            mails.push(msg);
                        }
                        for (const msg of moreMailsJson.server.response.actions.action) {
                            if (msg.command === 'continue_messages') {
                                moreMails = true;
                            }
                        }
                    }
                    returnData.push({
                        json: { success: true, data: mails },
                        pairedItem: { item: itemIndex },
                    });
                    continue;
                }
                const mailId = this.getNodeParameter('mailId', itemIndex);
                const fetchMailCommand = `<request>
				<command>
					<subsystem>postboxes</subsystem>
					<action>show message</action>
					<params>
						<param name="msgID"><![CDATA[${mailId}]]></param>
						<param name="boxType"><![CDATA[${mailbox}]]></param>
						<param name="limitList"><![CDATA[true]]></param>
					</params>
				</command>
			</request>`;
                const mailJson = await fetchMailWithCommand(fetchMailCommand);
                let mail = null;
                const msg = mailJson.server.response.actions.action.data.message;
                if (msg) {
                    msg.body = msg.body.replace(/\n/g, '');
                    mail = msg;
                }
                returnData.push({
                    json: { success: true, data: mail },
                    pairedItem: { item: itemIndex },
                });
                continue;
            }
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported portal operation "${operation}"`, { itemIndex });
        }
        return [returnData];
    }
}
exports.SmartSchoolPortal = SmartSchoolPortal;
//# sourceMappingURL=SmartSchoolPortal.node.js.map