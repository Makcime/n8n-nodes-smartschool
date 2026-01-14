"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartSchoolPortal = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
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
            usableAsTool: true,
            credentials: [
                {
                    name: 'smartschoolPortalApi',
                    required: true,
                    testedBy: 'smartSchoolPortal',
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
                            name: 'Fetch Email',
                            value: 'fetchEmail',
                            description: 'Fetch a single inbox message by ID',
                            action: 'Fetch email',
                        },
                        {
                            name: 'Fetch Email Inbox',
                            value: 'fetchEmailInbox',
                            description: 'Fetch inbox messages via SmartSchool web endpoints',
                            action: 'Fetch email inbox',
                        },
                        {
                            name: 'Fetch Planner',
                            value: 'fetchPlanner',
                            description: 'Fetch planner items for a date range',
                            action: 'Fetch planner',
                        },
                        {
                            name: 'Fetch Results',
                            value: 'fetchResults',
                            description: 'Fetch latest results for the account',
                            action: 'Fetch results',
                        },
                        {
                            name: 'Generate Session',
                            value: 'generateSession',
                            description: 'Automatic login is not supported; supply PHPSESSID manually instead',
                            action: 'Generate session',
                        },
                        {
                            name: 'Get Course List',
                            value: 'getPortalCourses',
                            description: 'Fetch course list from the Smartschool portal',
                            action: 'Get course list',
                        },
                        {
                            name: 'Get Gradebook Categories',
                            value: 'getGradebookCategories',
                            description: 'Fetch gradebook categories for a template',
                            action: 'Get gradebook categories',
                        },
                        {
                            name: 'Get Gradebook Category Grades (Group)',
                            value: 'getGradebookOtherCategoryGradesByGroup',
                            description: 'Fetch group grades for a gradebook category',
                            action: 'Get gradebook category grades by group',
                        },
                        {
                            name: 'Get Gradebook Category Grades (Pupil)',
                            value: 'getGradebookCategoryGradesByPupil',
                            description: 'Fetch pupil grades for a gradebook category',
                            action: 'Get gradebook category grades by pupil',
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
                            name: 'Get Gradebook Templates',
                            value: 'getGradebookTemplates',
                            description: 'Fetch Skore gradebook templates',
                            action: 'Get gradebook templates',
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
                            name: 'Get Planner Elements',
                            value: 'getPlannerElements',
                            description: 'Fetch planner elements for a date range (raw)',
                            action: 'Get planner elements',
                        },
                        {
                            name: 'Get Presence Class',
                            value: 'getPresenceClass',
                            description: 'Fetch raw presence entries for a class and hour',
                            action: 'Get presence class',
                        },
                        {
                            name: 'Get Presence Config',
                            value: 'getPresenceConfig',
                            description: 'Fetch allowed classes and hour mappings for presences',
                            action: 'Get presence config',
                        },
                        {
                            name: 'Get Presence Day (All Classes)',
                            value: 'getPresenceDayAllClasses',
                            description: 'Fetch and flatten presence entries for all classes and hours',
                            action: 'Get presence day all classes',
                        },
                        {
                            name: 'Update Course Schedule Codes',
                            value: 'updatePortalCourseScheduleCodes',
                            description: 'Replace schedule codes for a portal course',
                            action: 'Update course schedule codes',
                        },
                        {
                            name: 'Upload Timetable',
                            value: 'uploadTimetable',
                            description: 'Upload a timetable file and start the import',
                            action: 'Upload timetable',
                        },
                        {
                            name: 'Validate Session',
                            value: 'validateSession',
                            description: 'Check whether a PHPSESSID is still valid',
                            action: 'Validate session',
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
                                'uploadTimetable',
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
                                'uploadTimetable',
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
                    displayName: 'Timetable File (Binary Property)',
                    name: 'timetableBinaryProperty',
                    type: 'string',
                    default: 'data',
                    required: true,
                    description: 'Binary property that holds the timetable file to upload',
                    displayOptions: {
                        show: {
                            operation: ['uploadTimetable'],
                        },
                    },
                },
                {
                    displayName: 'Import From',
                    name: 'timetableFromDate',
                    type: 'dateTime',
                    default: '',
                    required: true,
                    description: 'Start date for the timetable import',
                    displayOptions: {
                        show: {
                            operation: ['uploadTimetable'],
                        },
                    },
                },
                {
                    displayName: 'Import To',
                    name: 'timetableToDate',
                    type: 'dateTime',
                    default: '',
                    required: true,
                    description: 'End date for the timetable import',
                    displayOptions: {
                        show: {
                            operation: ['uploadTimetable'],
                        },
                    },
                },
                {
                    displayName: 'Classes (Comma-Separated)',
                    name: 'timetableClasses',
                    type: 'string',
                    default: '',
                    description: 'Optional class IDs to include; leave empty for all classes',
                    displayOptions: {
                        show: {
                            operation: ['uploadTimetable'],
                        },
                    },
                },
                {
                    displayName: 'Teachers (JSON)',
                    name: 'timetableTeachers',
                    type: 'string',
                    default: '',
                    description: 'Optional teachers selection JSON; leave empty for all teachers',
                    displayOptions: {
                        show: {
                            operation: ['uploadTimetable'],
                        },
                    },
                },
                {
                    displayName: 'Types (Comma-Separated)',
                    name: 'timetableTypes',
                    type: 'string',
                    default: '',
                    description: 'Optional planned element types to include',
                    displayOptions: {
                        show: {
                            operation: ['uploadTimetable'],
                        },
                    },
                },
                {
                    displayName: 'Fields (Comma-Separated)',
                    name: 'timetableFields',
                    type: 'string',
                    default: '',
                    description: 'Optional fields to include during import',
                    displayOptions: {
                        show: {
                            operation: ['uploadTimetable'],
                        },
                    },
                },
                {
                    displayName: 'Delete Missing Elements',
                    name: 'timetableDeletePlannedElements',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to delete planned elements that are not present in the uploaded file',
                    displayOptions: {
                        show: {
                            operation: ['uploadTimetable'],
                        },
                    },
                },
                {
                    displayName: 'Notify Students',
                    name: 'timetableNotifyStudents',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to notify students when their planned elements change',
                    displayOptions: {
                        show: {
                            operation: ['uploadTimetable'],
                        },
                    },
                },
                {
                    displayName: 'Notify Teachers',
                    name: 'timetableNotifyTeachers',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to notify teachers when their planned elements change',
                    displayOptions: {
                        show: {
                            operation: ['uploadTimetable'],
                        },
                    },
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
                    displayName: 'Amount of Results (Latest First)',
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
                    description: 'Whether to fetch hours marked active in the presence config',
                    displayOptions: {
                        show: {
                            operation: ['getPresenceDayAllClasses'],
                        },
                    },
                },
                {
                    displayName: 'Class IDs (Comma-Separated)',
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
        const items = this.getInputData();
        const returnData = [];
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            const operation = this.getNodeParameter('operation', itemIndex);
            const sessionCreds = await this.getCredentials('smartschoolPortalApi');
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
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Expected an array of schedule codes', { itemIndex });
                        }
                        return parsed.map((entry) => String(entry)).filter((entry) => entry.length > 0);
                    }
                    catch (error) {
                        if (error instanceof n8n_workflow_1.NodeOperationError) {
                            throw error;
                        }
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Invalid Schedule Codes JSON: ${error.message}`, { itemIndex });
                    }
                }
                return trimmed
                    .split(/[\s,;]+/)
                    .map((entry) => entry.trim())
                    .filter(Boolean);
            };
            const parseDelimitedList = (value) => value
                .split(/[\s,;]+/)
                .map((entry) => entry.trim())
                .filter(Boolean);
            const parseOptionalJsonObject = (value, label) => {
                const trimmed = value.trim();
                if (!trimmed) {
                    return {};
                }
                try {
                    const parsed = JSON.parse(trimmed);
                    if (parsed === null || Array.isArray(parsed) || typeof parsed !== 'object') {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Expected a JSON object', { itemIndex });
                    }
                    return parsed;
                }
                catch (error) {
                    if (error instanceof n8n_workflow_1.NodeOperationError) {
                        throw error;
                    }
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Invalid JSON for ${label}: ${error.message}`, { itemIndex });
                }
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
                const result = await smscHeadlessLogin_1.smscHeadlessLogin.call(this, sessionCreds);
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
            if (operation === 'uploadTimetable') {
                const phpSessId = this.getNodeParameter('phpSessId', itemIndex);
                const binaryProperty = this.getNodeParameter('timetableBinaryProperty', itemIndex);
                const binary = (_e = (_d = this.getInputData()[itemIndex]) === null || _d === void 0 ? void 0 : _d.binary) === null || _e === void 0 ? void 0 : _e[binaryProperty];
                if (!binary) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Binary property "${binaryProperty}" is missing. Attach the timetable file as binary data.`, { itemIndex });
                }
                const buffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryProperty);
                const fileName = binary.fileName || 'timetable.txt';
                const mimeType = binary.mimeType || 'text/plain';
                const uploadDirResponse = await safeFetch_1.safeFetch.call(this, `https://${normalizedDomain}/upload/api/v1/get-upload-directory`, {
                    headers: {
                        accept: 'application/json',
                        cookie: buildCookieHeader(phpSessId),
                    },
                });
                const uploadDirData = await parsePortalJson(uploadDirResponse, 'get upload directory');
                const uploadDir = uploadDirData.uploadDir;
                if (!uploadDir) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Upload directory was not returned by Smartschool.', { itemIndex });
                }
                const formData = new FormData();
                formData.append('file', new Blob([new Uint8Array(buffer)], { type: mimeType }), fileName);
                await safeFetch_1.safeFetch.call(this, `https://${normalizedDomain}/Upload/Upload/Index`, {
                    method: 'POST',
                    headers: {
                        cookie: buildCookieHeader(phpSessId),
                        origin: `https://${normalizedDomain}`,
                        referer: `https://${normalizedDomain}/`,
                        'x-requested-with': 'XMLHttpRequest',
                    },
                    body: formData,
                });
                const filesResponse = await safeFetch_1.safeFetch.call(this, `https://${normalizedDomain}/upload/api/v1/files/${uploadDir}`, {
                    headers: {
                        accept: 'application/json',
                        cookie: buildCookieHeader(phpSessId),
                    },
                });
                const filesData = (await parsePortalJson(filesResponse, 'uploaded files'));
                const capabilitiesResponse = await safeFetch_1.safeFetch.call(this, `https://${normalizedDomain}/planner/api/v1/schedule/upload`, {
                    method: 'POST',
                    headers: {
                        accept: 'application/json',
                        'content-type': 'application/json',
                        cookie: buildCookieHeader(phpSessId),
                        origin: `https://${normalizedDomain}`,
                    },
                    body: JSON.stringify({ uploadDir }),
                });
                const capabilitiesData = (await parsePortalJson(capabilitiesResponse, 'schedule upload'));
                const dateFromRaw = this.getNodeParameter('timetableFromDate', itemIndex);
                const dateToRaw = this.getNodeParameter('timetableToDate', itemIndex);
                const classesRaw = this.getNodeParameter('timetableClasses', itemIndex);
                const teachersRaw = this.getNodeParameter('timetableTeachers', itemIndex);
                const typesRaw = this.getNodeParameter('timetableTypes', itemIndex);
                const fieldsRaw = this.getNodeParameter('timetableFields', itemIndex);
                const deletePlannedElements = this.getNodeParameter('timetableDeletePlannedElements', itemIndex);
                const notifyStudents = this.getNodeParameter('timetableNotifyStudents', itemIndex);
                const notifyTeachers = this.getNodeParameter('timetableNotifyTeachers', itemIndex);
                const classes = parseDelimitedList(classesRaw).map((value) => /^\d+$/.test(value) ? Number(value) : value);
                const teachers = parseOptionalJsonObject(teachersRaw, 'Teachers');
                const types = parseDelimitedList(typesRaw);
                const fields = parseDelimitedList(fieldsRaw);
                const options = {
                    dateFrom: dateFromRaw.split('T')[0],
                    dateTo: dateToRaw.split('T')[0],
                    classes,
                    teachers,
                    types,
                    fields,
                    sendNotificationStudents: notifyStudents,
                    sendNotificationTeachers: notifyTeachers,
                    deletePlannedElements,
                };
                const validateResponse = await safeFetch_1.safeFetch.call(this, `https://${normalizedDomain}/planner/api/v1/schedule/validate`, {
                    method: 'POST',
                    headers: {
                        accept: 'application/json',
                        'content-type': 'application/json',
                        cookie: buildCookieHeader(phpSessId),
                        origin: `https://${normalizedDomain}`,
                    },
                    body: JSON.stringify({ options, uploadDir }),
                });
                const validateData = (await parsePortalJson(validateResponse, 'schedule validate'));
                const unknownTeachers = ((_f = validateData.unknownTeachers) !== null && _f !== void 0 ? _f : []);
                if (unknownTeachers.length > 0) {
                    const list = unknownTeachers
                        .map((entry) => entry.value)
                        .filter(Boolean)
                        .slice(0, 10)
                        .join(', ');
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Timetable validation failed: unknown teachers (${list}).`, { itemIndex });
                }
                if (validateData.scheduleCouldNotBeValidated) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Timetable validation failed: schedule could not be validated.', { itemIndex });
                }
                const startResponse = await safeFetch_1.safeFetch.call(this, `https://${normalizedDomain}/planner/api/v1/schedule/start`, {
                    method: 'POST',
                    headers: {
                        accept: 'application/json',
                        'content-type': 'application/json',
                        cookie: buildCookieHeader(phpSessId),
                        origin: `https://${normalizedDomain}`,
                    },
                    body: JSON.stringify({ options, uploadDir }),
                });
                let startBody = {};
                try {
                    const parsed = await startResponse.json();
                    if (parsed && typeof parsed === 'object') {
                        startBody = parsed;
                    }
                }
                catch (error) {
                    startBody = {};
                }
                returnData.push({
                    json: {
                        uploadDir,
                        files: filesData,
                        capabilities: capabilitiesData,
                        validation: validateData,
                        start: startBody,
                    },
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
                        const pupils = ((_g = classData.pupils) !== null && _g !== void 0 ? _g : []);
                        for (const pupil of pupils) {
                            const presences = ((_h = pupil.presence) !== null && _h !== void 0 ? _h : []);
                            for (const presence of presences) {
                                const code = ((_j = presence.code) !== null && _j !== void 0 ? _j : {});
                                rows.push({
                                    classId,
                                    className,
                                    hourId,
                                    hourTitle,
                                    presenceDate: (_k = presence.presenceDate) !== null && _k !== void 0 ? _k : presenceDateOnly,
                                    pupilId: (_l = pupil.userID) !== null && _l !== void 0 ? _l : pupil.userId,
                                    pupilName: pupil.name,
                                    pupilSurname: pupil.surname,
                                    pupilFullName: (_m = pupil.nameBIN) !== null && _m !== void 0 ? _m : pupil.name,
                                    presenceId: presence.presenceID,
                                    codeId: (_o = presence.codeID) !== null && _o !== void 0 ? _o : code.codeID,
                                    codeName: code.name,
                                    codeColor: code.color,
                                    isOfficial: (_p = code.isOfficial) !== null && _p !== void 0 ? _p : presence.isOfficial,
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
                const toArray = (value) => Array.isArray(value) ? value : value ? [value] : [];
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
                    return (0, GenericFunctions_1.parseXmlSimple)(body);
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
                    const startActions = toArray(((_q = startMailsJson.server) === null || _q === void 0 ? void 0 : _q.response) &&
                        startMailsJson.server.response.actions &&
                        startMailsJson.server.response.actions
                            .action);
                    const startMessages = toArray(((_s = (_r = startActions[0]) === null || _r === void 0 ? void 0 : _r.data) === null || _s === void 0 ? void 0 : _s.messages) &&
                        ((_t = startActions[0]) === null || _t === void 0 ? void 0 : _t.data).messages.message);
                    for (const msg of startMessages) {
                        mails.push(msg);
                    }
                    for (const msg of startActions) {
                        if (msg.command === 'continue_messages') {
                            moreMails = true;
                        }
                    }
                    while (moreMails) {
                        moreMails = false;
                        const moreMailsJson = await fetchMailWithCommand(fetchMoreMailsCommand);
                        const moreActions = toArray(((_u = moreMailsJson.server) === null || _u === void 0 ? void 0 : _u.response) &&
                            moreMailsJson.server.response.actions &&
                            moreMailsJson.server.response.actions
                                .action);
                        const moreMessages = toArray(((_w = (_v = moreActions[0]) === null || _v === void 0 ? void 0 : _v.data) === null || _w === void 0 ? void 0 : _w.messages) &&
                            ((_x = moreActions[0]) === null || _x === void 0 ? void 0 : _x.data).messages.message);
                        for (const msg of moreMessages) {
                            mails.push(msg);
                        }
                        for (const msg of moreActions) {
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
                const mailActions = toArray(((_y = mailJson.server) === null || _y === void 0 ? void 0 : _y.response) &&
                    mailJson.server.response.actions &&
                    mailJson.server.response.actions.action);
                const msg = (_0 = (_z = mailActions[0]) === null || _z === void 0 ? void 0 : _z.data) === null || _0 === void 0 ? void 0 : _0.message;
                if (msg) {
                    const body = msg.body;
                    msg.body = body ? body.replace(/\n/g, '') : body;
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