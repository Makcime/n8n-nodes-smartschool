"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartSchool = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const fields_1 = require("./shared/fields");
const errorCodes_1 = require("./shared/errorCodes");
const safeFetch_1 = require("./portal/safeFetch");
const smscHeadlessLogin_1 = require("./portal/smscHeadlessLogin");
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
                            name: 'Absence',
                            value: 'absence',
                        },
                        {
                            name: 'Account',
                            value: 'account',
                        },
                        {
                            name: 'Course',
                            value: 'course',
                        },
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
                            name: 'Parameter',
                            value: 'parameter',
                        },
                        {
                            name: 'System',
                            value: 'system',
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
                            name: 'Change Internal Number',
                            value: 'changeInternNumber',
                            description: 'Change the internal number for a user',
                            action: 'Change internal number',
                        },
                        {
                            name: 'Change Password at Next Login',
                            value: 'changePasswordAtNextLogin',
                            description: 'Force a password change on next login',
                            action: 'Change password at next login',
                        },
                        {
                            name: 'Change Username',
                            value: 'changeUsername',
                            description: 'Change a username using the internal number',
                            action: 'Change username',
                        },
                        {
                            name: 'Deactivate Two-Factor Authentication',
                            value: 'deactivateTwoFactorAuthentication',
                            description: 'Deprecated SmartSchool method to disable 2FA',
                            action: 'Deactivate two factor authentication',
                        },
                        {
                            name: 'Delete User',
                            value: 'delUser',
                            description: 'Remove a user from SmartSchool',
                            action: 'Delete user',
                        },
                        {
                            name: 'Force Password Reset',
                            value: 'forcePasswordReset',
                            description: 'Force a password reset for a user account',
                            action: 'Force password reset',
                        },
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
                            name: 'Get User Details by Scannable Code',
                            value: 'getUserDetailsByScannableCode',
                            action: 'Get user details by scannable code',
                        },
                        {
                            name: 'Get User Details by Username',
                            value: 'getUserDetailsByUsername',
                            action: 'Get user details by username',
                        },
                        {
                            name: 'Get User Official Class',
                            value: 'getUserOfficialClass',
                            description: 'Retrieve the official class for a user',
                            action: 'Get user official class',
                        },
                        {
                            name: 'Remove Co-Account',
                            value: 'removeCoAccount',
                            description: 'Remove a co-account from a user',
                            action: 'Remove co account',
                        },
                        {
                            name: 'Replace Internal Number',
                            value: 'replaceInum',
                            description: 'Replace a user internal number with a new one',
                            action: 'Replace internal number',
                        },
                        {
                            name: 'Save Password',
                            value: 'savePassword',
                            description: 'Set a new password for a user account',
                            action: 'Save password',
                        },
                        {
                            name: 'Save User',
                            value: 'saveUser',
                            description: 'Create or update a SmartSchool user',
                            action: 'Save user',
                        },
                        {
                            name: 'Save User Parameter',
                            value: 'saveUserParameter',
                            description: 'Update a SmartSchool user parameter',
                            action: 'Save user parameter',
                        },
                        {
                            name: 'Set Account Status',
                            value: 'setAccountStatus',
                            description: 'Activate, deactivate, or set account status',
                            action: 'Set account status',
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
                            name: 'Get Absents by Date',
                            value: 'getAbsentsByDate',
                            description: 'Get absences for all students on a date',
                            action: 'Get absents by date',
                        },
                        {
                            name: 'Get Absents by Date and Group',
                            value: 'getAbsentsByDateAndGroup',
                            description: 'Get absences for a date filtered by group',
                            action: 'Get absents by date and group',
                        },
                        {
                            name: 'Get Absents with Alias',
                            value: 'getAbsentsWithAlias',
                            description: 'Get absences with alias labels for a user and school year',
                            action: 'Get absents with alias',
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
                    ],
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    default: 'getCourses',
                    displayOptions: {
                        show: {
                            resource: ['course'],
                        },
                    },
                    options: [
                        {
                            name: 'Get Courses',
                            value: 'getCourses',
                            description: 'List available courses (CSV response)',
                            action: 'Get courses',
                        },
                        {
                            name: 'Add Course',
                            value: 'addCourse',
                            description: 'Create a new course',
                            action: 'Add course',
                        },
                        {
                            name: 'Add Course Students',
                            value: 'addCourseStudents',
                            description: 'Assign groups/classes to a course',
                            action: 'Add course students',
                        },
                        {
                            name: 'Add Course Teacher',
                            value: 'addCourseTeacher',
                            description: 'Assign a teacher to a course',
                            action: 'Add course teacher',
                        },
                    ],
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    default: 'startSkoreSync',
                    displayOptions: {
                        show: {
                            resource: ['system'],
                        },
                    },
                    options: [
                        {
                            name: 'Start Skore Sync',
                            value: 'startSkoreSync',
                            description: 'Start the Skore sync process',
                            action: 'Start skore sync',
                        },
                        {
                            name: 'Check Status',
                            value: 'checkStatus',
                            description: 'Check Skore sync status',
                            action: 'Check status',
                        },
                        {
                            name: 'Get Student Career',
                            value: 'getStudentCareer',
                            description: 'Retrieve student career history',
                            action: 'Get student career',
                        },
                        {
                            name: 'Get Deliberation Lines',
                            value: 'getDeliberationLines',
                            description: 'Retrieve deliberation lines for a date in the school year',
                            action: 'Get deliberation lines',
                        },
                    ],
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    default: 'generateSession',
                    displayOptions: {
                        show: {
                            resource: ['portal'],
                        },
                    },
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
                            description: 'Fetch inbox messages via Smartschool web endpoints',
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
                            description: 'Generate a portal session via the external login service',
                            action: 'Generate session',
                        },
                        {
                            name: 'Generate Session (Legacy)',
                            value: 'generateSessionLegacy',
                            description: 'Generate a portal session using Playwright (self-hosted only)',
                            action: 'Generate session legacy',
                        },
                        {
                            name: 'Get Course List (Portal)',
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
                            name: 'Update Course Schedule Codes (Portal)',
                            value: 'updatePortalCourseScheduleCodes',
                            description: 'Replace schedule codes for a portal course',
                            action: 'Update course schedule codes',
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
                            name: 'Change Group Visibility',
                            value: 'changeGroupVisibility',
                            description: 'Toggle visibility of a group or class',
                            action: 'Change group visibility',
                        },
                        {
                            name: 'Clear Group',
                            value: 'clearGroup',
                            description: 'Remove all users from a group',
                            action: 'Clear group',
                        },
                        {
                            name: 'Delete Class',
                            value: 'delClass',
                            description: 'Delete a class or group',
                            action: 'Delete class',
                        },
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
                        {
                            name: 'Get Schoolyear Data of Class',
                            value: 'getSchoolyearDataOfClass',
                            description: 'Retrieve schoolyear metadata for a class',
                            action: 'Get schoolyear data of class',
                        },
                        {
                            name: 'Get Skore Class Teacher Course Relation',
                            value: 'getSkoreClassTeacherCourseRelation',
                            description: 'Retrieve Skore class-teacher-course relations',
                            action: 'Get skore class teacher course relation',
                        },
                        {
                            name: 'Remove User From Group',
                            value: 'removeUserFromGroup',
                            description: 'Remove a user from a class or group',
                            action: 'Remove user from group',
                        },
                        {
                            name: 'Save Class',
                            value: 'saveClass',
                            description: 'Create or update a class',
                            action: 'Save class',
                        },
                        {
                            name: 'Save Class List (CSV)',
                            value: 'saveClassList',
                            description: 'Bulk update class list from CSV',
                            action: 'Save class list csv',
                        },
                        {
                            name: 'Save Class List (JSON)',
                            value: 'saveClassListJson',
                            description: 'Bulk update class list from JSON',
                            action: 'Save class list json',
                        },
                        {
                            name: 'Save Group',
                            value: 'saveGroup',
                            description: 'Create or update a group',
                            action: 'Save group',
                        },
                        {
                            name: 'Save Schoolyear Data of Class',
                            value: 'saveSchoolyearDataOfClass',
                            description: 'Update schoolyear metadata for a class',
                            action: 'Save schoolyear data of class',
                        },
                        {
                            name: 'Save User to Group',
                            value: 'saveUserToGroup',
                            description: 'Assign a user to a class or group',
                            action: 'Save user to group',
                        },
                        {
                            name: 'Unregister Student',
                            value: 'unregisterStudent',
                            description: 'Unregister a student from all groups',
                            action: 'Unregister student',
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
                            action: 'Send smart school message',
                        },
                        {
                            name: 'Save Signature',
                            value: 'saveSignature',
                            description: 'Save a message signature for a user account',
                            action: 'Save signature',
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
                                'clearGroup',
                                'changeGroupVisibility',
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
                    displayName: 'Group Visibility',
                    name: 'groupVisibility',
                    type: 'options',
                    options: fields_1.VISIBILITY_OPTIONS,
                    default: 1,
                    description: 'Visibility status for the group/class',
                    displayOptions: {
                        show: {
                            resource: ['group'],
                            operation: ['changeGroupVisibility'],
                        },
                    },
                },
                {
                    displayName: 'Group/Class Details',
                    name: 'groupClassDetails',
                    type: 'fixedCollection',
                    default: {},
                    description: 'Details for creating or updating a class or group',
                    displayOptions: {
                        show: {
                            resource: ['group'],
                            operation: ['saveGroup', 'saveClass'],
                        },
                    },
                    options: [
                        {
                            displayName: 'Required',
                            name: 'required',
                            values: [
                                {
                                    displayName: 'Code',
                                    name: 'code',
                                    type: 'string',
                                    default: '',
                                    required: true,
                                },
                                {
                                    displayName: 'Description',
                                    name: 'desc',
                                    type: 'string',
                                    default: '',
                                    required: true,
                                },
                                {
                                    displayName: 'Name',
                                    name: 'name',
                                    type: 'string',
                                    default: '',
                                    required: true,
                                },
                                {
                                    displayName: 'Parent Code',
                                    name: 'parent',
                                    type: 'string',
                                    default: '',
                                    required: true,
                                },
                                {
                                    displayName: 'Untis Code',
                                    name: 'untis',
                                    type: 'string',
                                    default: '',
                                    required: true,
                                },
                            ],
                        },
                        {
                            displayName: 'Optional (Classes Only)',
                            name: 'optional',
                            values: [
                                {
                                    displayName: 'Institute Number',
                                    name: 'instituteNumber',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'Administrative Number',
                                    name: 'adminNumber',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'School Year Date',
                                    name: 'schoolYearDate',
                                    type: 'string',
                                    default: '',
                                },
                            ],
                        },
                    ],
                },
                {
                    displayName: 'Class/Group Code',
                    name: 'classCode',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Class or group code',
                    displayOptions: {
                        show: {
                            resource: ['group'],
                            operation: [
                                'saveUserToGroup',
                                'removeUserFromGroup',
                                'delClass',
                                'getSchoolyearDataOfClass',
                                'saveSchoolyearDataOfClass',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Class List (CSV)',
                    name: 'classListCsv',
                    type: 'string',
                    typeOptions: {
                        rows: 6,
                    },
                    default: '',
                    required: true,
                    description: 'Serialized CSV list of classes',
                    displayOptions: {
                        show: {
                            resource: ['group'],
                            operation: ['saveClassList'],
                        },
                    },
                },
                {
                    displayName: 'Class List (JSON)',
                    name: 'classListJson',
                    type: 'string',
                    typeOptions: {
                        rows: 6,
                    },
                    default: '',
                    required: true,
                    description: 'Serialized JSON list of classes',
                    displayOptions: {
                        show: {
                            resource: ['group'],
                            operation: ['saveClassListJson'],
                        },
                    },
                },
                {
                    displayName: 'School Year Date',
                    name: 'schoolyearDate',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'School year date (YYYY-MM-DD)',
                    displayOptions: {
                        show: {
                            resource: ['group'],
                            operation: ['saveSchoolyearDataOfClass'],
                        },
                    },
                },
                {
                    displayName: 'Institute Number',
                    name: 'schoolyearInstituteNumber',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Institute number for the school year data',
                    displayOptions: {
                        show: {
                            resource: ['group'],
                            operation: ['saveSchoolyearDataOfClass'],
                        },
                    },
                },
                {
                    displayName: 'Administrative Group Number',
                    name: 'administrativeGroupNumber',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: ['group'],
                            operation: ['saveSchoolyearDataOfClass'],
                        },
                    },
                },
                {
                    displayName: 'Residence',
                    name: 'residence',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Residence location',
                    displayOptions: {
                        show: {
                            resource: ['group'],
                            operation: ['saveSchoolyearDataOfClass'],
                        },
                    },
                },
                {
                    displayName: 'Domain',
                    name: 'domain',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Domain of study',
                    displayOptions: {
                        show: {
                            resource: ['group'],
                            operation: ['saveSchoolyearDataOfClass'],
                        },
                    },
                },
                {
                    displayName: 'Principal',
                    name: 'principal',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Principal name or identifier',
                    displayOptions: {
                        show: {
                            resource: ['group'],
                            operation: ['saveSchoolyearDataOfClass'],
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
                    displayName: 'Course Name',
                    name: 'courseName',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Full course name',
                    displayOptions: {
                        show: {
                            resource: ['course'],
                            operation: ['addCourse', 'addCourseStudents', 'addCourseTeacher'],
                        },
                    },
                },
                {
                    displayName: 'Course Code',
                    name: 'courseCode',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Unique course code/description',
                    displayOptions: {
                        show: {
                            resource: ['course'],
                            operation: ['addCourse', 'addCourseStudents', 'addCourseTeacher'],
                        },
                    },
                },
                {
                    displayName: 'Visibility',
                    name: 'courseVisibility',
                    type: 'options',
                    options: fields_1.VISIBILITY_OPTIONS,
                    default: 1,
                    description: 'Course visibility status',
                    displayOptions: {
                        show: {
                            resource: ['course'],
                            operation: ['addCourse'],
                        },
                    },
                },
                {
                    displayName: 'Group Codes',
                    name: 'courseGroupIds',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Comma-separated class/group codes to assign',
                    displayOptions: {
                        show: {
                            resource: ['course'],
                            operation: ['addCourseStudents'],
                        },
                    },
                },
                {
                    displayName: 'Teacher Internal Number',
                    name: 'courseTeacherInternNumber',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Teacher internal number identifier',
                    displayOptions: {
                        show: {
                            resource: ['course'],
                            operation: ['addCourseTeacher'],
                        },
                    },
                },
                {
                    displayName: 'Service ID',
                    name: 'serviceId',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Service identifier returned by Start Skore Sync',
                    displayOptions: {
                        show: {
                            resource: ['system'],
                            operation: ['checkStatus'],
                        },
                    },
                },
                {
                    displayName: 'Deliberation Date',
                    name: 'deliberationDate',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Date in the school year (YYYY-MM-DD)',
                    displayOptions: {
                        show: {
                            resource: ['system'],
                            operation: ['getDeliberationLines'],
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
                    displayName: 'Wrap HTML',
                    name: 'wrapHtml',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to convert plain text into a minimal HTML document with paragraphs and line breaks',
                    displayOptions: {
                        show: {
                            resource: ['helpdesk', 'message'],
                            operation: ['addHelpdeskTicket', 'sendMsg'],
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
                            resource: ['helpdesk', 'message', 'account', 'absence', 'course', 'system'],
                            operation: [
                                'addHelpdeskTicket',
                                'sendMsg',
                                'saveSignature',
                                'getUserDetails',
                                'getUserOfficialClass',
                                'getAbsents',
                                'getAbsentsWithAlias',
                                'delUser',
                                'setAccountStatus',
                                'changePasswordAtNextLogin',
                                'forcePasswordReset',
                                'saveUserParameter',
                                'removeCoAccount',
                                'savePassword',
                                'deactivateTwoFactorAuthentication',
                                'saveUserToGroup',
                                'removeUserFromGroup',
                                'unregisterStudent',
                                'addCourseTeacher',
                                'getStudentCareer',
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
                            operation: ['getUserDetailsByNumber', 'changeUsername'],
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
                            operation: ['getUserDetailsByUsername', 'changeInternNumber'],
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
                    description: 'Date (YYYY-MM-DD). Leave empty to use today.',
                    displayOptions: {
                        show: {
                            resource: ['account'],
                            operation: ['getUserOfficialClass'],
                        },
                    },
                },
                {
                    displayName: 'New Username',
                    name: 'newUsername',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'New username to assign',
                    displayOptions: {
                        show: {
                            resource: ['account'],
                            operation: ['changeUsername'],
                        },
                    },
                },
                {
                    displayName: 'New Internal Number',
                    name: 'newInternNumber',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'New internal number to assign',
                    displayOptions: {
                        show: {
                            resource: ['account'],
                            operation: ['changeInternNumber'],
                        },
                    },
                },
                {
                    displayName: 'Account Status',
                    name: 'accountStatus',
                    type: 'options',
                    default: 'actief',
                    required: true,
                    description: 'SmartSchool account status',
                    options: fields_1.ACCOUNT_STATUS_OPTIONS,
                    displayOptions: {
                        show: {
                            resource: ['account'],
                            operation: ['setAccountStatus'],
                        },
                    },
                },
                {
                    displayName: 'Account Type',
                    name: 'accountType',
                    type: 'number',
                    typeOptions: {
                        minValue: 0,
                    },
                    default: 0,
                    description: '0 = main account, 1 = first co-account, etc',
                    displayOptions: {
                        show: {
                            resource: ['account'],
                            operation: [
                                'changePasswordAtNextLogin',
                                'forcePasswordReset',
                                'removeCoAccount',
                                'savePassword',
                                'deactivateTwoFactorAuthentication',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Signature Account Type',
                    name: 'signatureAccountType',
                    type: 'number',
                    typeOptions: {
                        minValue: 0,
                    },
                    default: 0,
                    description: '0 = main account, 1 = first co-account, etc',
                    displayOptions: {
                        show: {
                            resource: ['message'],
                            operation: ['saveSignature'],
                        },
                    },
                },
                {
                    displayName: 'Password',
                    name: 'password',
                    type: 'string',
                    default: '',
                    required: true,
                    typeOptions: {
                        password: true,
                    },
                    description: 'New password to set for the user',
                    displayOptions: {
                        show: {
                            resource: ['account'],
                            operation: ['savePassword'],
                        },
                    },
                },
                {
                    displayName: 'Change Password at Next Login',
                    name: 'mustChangePassword',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to force the user to change password at next login',
                    displayOptions: {
                        show: {
                            resource: ['account'],
                            operation: ['savePassword'],
                        },
                    },
                },
                {
                    displayName: 'Parameter Name',
                    name: 'paramName',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'User parameter name to update (e.g., email, status_coaccount1)',
                    displayOptions: {
                        show: {
                            resource: ['account'],
                            operation: ['saveUserParameter'],
                        },
                    },
                },
                {
                    displayName: 'Parameter Value',
                    name: 'paramValue',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Value to set for the parameter',
                    displayOptions: {
                        show: {
                            resource: ['account'],
                            operation: ['saveUserParameter'],
                        },
                    },
                },
                {
                    displayName: 'Official Date',
                    name: 'officialDate',
                    type: 'string',
                    default: '',
                    description: 'Date to apply the change (YYYY-MM-DD)',
                    displayOptions: {
                        show: {
                            resource: ['account', 'group'],
                            operation: [
                                'delUser',
                                'saveUserToGroup',
                                'removeUserFromGroup',
                                'clearGroup',
                                'unregisterStudent',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Old Internal Number',
                    name: 'oldInum',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Existing internal number to replace',
                    displayOptions: {
                        show: {
                            resource: ['account'],
                            operation: ['replaceInum'],
                        },
                    },
                },
                {
                    displayName: 'New Internal Number',
                    name: 'newInum',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'Replacement internal number',
                    displayOptions: {
                        show: {
                            resource: ['account'],
                            operation: ['replaceInum'],
                        },
                    },
                },
                {
                    displayName: 'User Profile',
                    name: 'userProfile',
                    type: 'fixedCollection',
                    default: {},
                    description: 'Core SmartSchool user fields',
                    displayOptions: {
                        show: {
                            resource: ['account'],
                            operation: ['saveUser'],
                        },
                    },
                    options: [
                        {
                            displayName: 'Required',
                            name: 'required',
                            values: [
                                {
                                    displayName: 'Username',
                                    name: 'username',
                                    type: 'string',
                                    default: '',
                                    required: true,
                                },
                                {
                                    displayName: 'First Name',
                                    name: 'name',
                                    type: 'string',
                                    default: '',
                                    required: true,
                                },
                                {
                                    displayName: 'Last Name',
                                    name: 'surname',
                                    type: 'string',
                                    default: '',
                                    required: true,
                                },
                                {
                                    displayName: 'Base Role',
                                    name: 'basisrol',
                                    type: 'options',
                                    options: [
                                        { name: 'Student (Leerling)', value: 'leerling' },
                                        { name: 'Teacher (Leerkracht)', value: 'leerkracht' },
                                        { name: 'Management (Directie)', value: 'directie' },
                                        { name: 'Other (Andere)', value: 'andere' },
                                    ],
                                    default: 'leerling',
                                    required: true,
                                },
                            ],
                        },
                        {
                            displayName: 'Optional',
                            name: 'optional',
                            values: [
                                {
                                    displayName: 'Address',
                                    name: 'address',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'Birth City',
                                    name: 'birthcity',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'Birth Country',
                                    name: 'birthcountry',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'Birthdate',
                                    name: 'birthdate',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'City',
                                    name: 'city',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'Country',
                                    name: 'country',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'Email',
                                    name: 'email',
                                    type: 'string',
                                    placeholder: 'name@email.com',
                                    default: '',
                                },
                                {
                                    displayName: 'Extra Names',
                                    name: 'extranames',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'Initials',
                                    name: 'initials',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'Internal Number',
                                    name: 'internnumber',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'Mobile',
                                    name: 'mobile',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'Nationality',
                                    name: 'nationality',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'Phone',
                                    name: 'phone',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'Postal Code',
                                    name: 'postalcode',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'Primary Password',
                                    name: 'passwd1',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'Secondary Password',
                                    name: 'passwd2',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'Sex',
                                    name: 'sex',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'Tertiary Password',
                                    name: 'passwd3',
                                    type: 'string',
                                    default: '',
                                },
                            ],
                        },
                        {
                            displayName: 'Custom Fields',
                            name: 'custom',
                            values: [
                                {
                                    displayName: 'Custom Fields (JSON)',
                                    name: 'customFields',
                                    type: 'string',
                                    typeOptions: {
                                        rows: 4,
                                    },
                                    default: '',
                                    description: 'JSON object of additional SmartSchool fields',
                                },
                            ],
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
                            resource: ['portal'],
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
                            resource: ['portal'],
                            operation: [
                                'validateSession',
                                'fetchPlanner',
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
                    required: true,
                    description: 'Smartschool numeric user ID returned by Generate Session',
                    displayOptions: {
                        show: {
                            resource: ['portal'],
                            operation: ['fetchPlanner'],
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
                            resource: ['portal'],
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
                            resource: ['portal'],
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
                            resource: ['portal'],
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
                            resource: ['portal'],
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
                            resource: ['portal'],
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
                            resource: ['portal'],
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
                    description: 'Course ID from Get Course List (Portal)',
                    displayOptions: {
                        show: {
                            resource: ['portal'],
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
                    description: 'Comma-separated or JSON array of schedule codes (e.g. ACINFO1, ACINFO2)',
                    displayOptions: {
                        show: {
                            resource: ['portal'],
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
                            resource: ['portal'],
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
                            resource: ['portal'],
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
                            resource: ['portal'],
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
                            resource: ['portal'],
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
                            resource: ['portal'],
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
                            resource: ['portal'],
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
                            resource: ['portal'],
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
                            resource: ['portal'],
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
                            resource: ['portal'],
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
                            resource: ['portal'],
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
                            resource: ['portal'],
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
                            resource: ['portal'],
                            operation: ['getPresenceDayAllClasses'],
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
                    displayName: 'Signature',
                    name: 'signature',
                    type: 'string',
                    typeOptions: {
                        rows: 4,
                    },
                    default: '',
                    required: true,
                    description: 'Signature text to save',
                    displayOptions: {
                        show: {
                            resource: ['message'],
                            operation: ['saveSignature'],
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
                    description: '0 = main account, 1 = first co-account, etc',
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
                    description: 'Whether to copy the message to the SmartSchool LVS (student tracking system)',
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
        const items = this.getInputData();
        const returnData = [];
        let accesscode = null;
        const getAccesscode = async () => {
            if (!accesscode) {
                const credentials = await GenericFunctions_1.getSmartSchoolCredentials.call(this);
                accesscode = credentials.accesscode;
            }
            return accesscode;
        };
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
                if (data === null || data === undefined) {
                    returnData.push({
                        json: {},
                        pairedItem: { item: itemIndex },
                    });
                    return;
                }
                if (typeof data !== 'object') {
                    returnData.push({
                        json: { value: data },
                        pairedItem: { item: itemIndex },
                    });
                    return;
                }
                returnData.push({
                    json: data,
                    pairedItem: { item: itemIndex },
                });
            };
            const maybeThrowSmartschoolError = (result) => {
                const code = typeof result === 'number'
                    ? result
                    : typeof result === 'string' && /^\d+$/.test(result)
                        ? Number(result)
                        : null;
                if (code !== null && errorCodes_1.SMARTSCHOOL_ERROR_CODES[code]) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `SmartSchool error ${code}: ${errorCodes_1.SMARTSCHOOL_ERROR_CODES[code]}`, { itemIndex });
                }
            };
            const callMethod = async (method, params) => {
                const accesscodeValue = await getAccesscode();
                const result = await GenericFunctions_1.callSmartschoolSoap.call(this, method, {
                    accesscode: accesscodeValue,
                    ...params,
                });
                maybeThrowSmartschoolError(result);
                return result;
            };
            try {
                const resource = this.getNodeParameter('resource', itemIndex);
                const operation = this.getNodeParameter('operation', itemIndex);
                if (resource === 'portal') {
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
                        const loginServiceUrl = (_a = sessionCreds.loginServiceUrl) !== null && _a !== void 0 ? _a : '';
                        const loginServiceApiKey = (_b = sessionCreds.loginServiceApiKey) !== null && _b !== void 0 ? _b : '';
                        if (!loginServiceUrl || !loginServiceApiKey) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Login service URL and API key are required to generate a portal session.', { itemIndex });
                        }
                        const loginPayload = {
                            domain: sessionCreds.domain,
                            username: sessionCreds.username,
                            password: sessionCreds.password,
                        };
                        if (sessionCreds.birthdate) {
                            loginPayload.birthdate = sessionCreds.birthdate;
                        }
                        if (sessionCreds.totpSecret) {
                            loginPayload.totpSecret = sessionCreds.totpSecret;
                        }
                        let result;
                        try {
                            result = (await this.helpers.httpRequest({
                                method: 'POST',
                                url: loginServiceUrl,
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-API-Key': loginServiceApiKey,
                                },
                                body: loginPayload,
                                json: true,
                            }));
                        }
                        catch (error) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Login service request failed: ${error.message}`, { itemIndex });
                        }
                        const phpSessId = result.phpSessId;
                        const userId = result.userId;
                        const cookieHeader = result.cookieHeader;
                        if (!phpSessId || !cookieHeader) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Login service did not return phpSessId or cookieHeader.', { itemIndex });
                        }
                        const userIdRaw = userId ? String(userId) : '';
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
                                phpSessId,
                                userId,
                                cookieHeader,
                                userIdNumeric,
                            },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'generateSessionLegacy') {
                        const result = await smscHeadlessLogin_1.smscHeadlessLoginLegacy.call(this, sessionCreds);
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
                        const inputUserId = (_e = (_d = (_c = this.getInputData()[itemIndex]) === null || _c === void 0 ? void 0 : _c.json) === null || _d === void 0 ? void 0 : _d.userId) !== null && _e !== void 0 ? _e : '';
                        const userId = userIdParam || inputUserId;
                        const fromDate = this.getNodeParameter('fromDate', itemIndex);
                        const toDate = this.getNodeParameter('toDate', itemIndex);
                        const plannerUrl = userId
                            ? `https://${normalizedDomain}/planner/api/v1/planned-elements/user/${userId}?from=${fromDate}&to=${toDate}`
                            : `https://${normalizedDomain}/planner/api/v1/planned-elements?from=${fromDate}&to=${toDate}`;
                        const response = await safeFetch_1.safeFetch.call(this, plannerUrl, {
                            headers: {
                                cookie: `PHPSESSID=${phpSessId}`,
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
                                const pupils = ((_f = classData.pupils) !== null && _f !== void 0 ? _f : []);
                                for (const pupil of pupils) {
                                    const presences = ((_g = pupil.presence) !== null && _g !== void 0 ? _g : []);
                                    for (const presence of presences) {
                                        const code = ((_h = presence.code) !== null && _h !== void 0 ? _h : {});
                                        rows.push({
                                            classId,
                                            className,
                                            hourId,
                                            hourTitle,
                                            presenceDate: (_j = presence.presenceDate) !== null && _j !== void 0 ? _j : presenceDateOnly,
                                            pupilId: (_k = pupil.userID) !== null && _k !== void 0 ? _k : pupil.userId,
                                            pupilName: pupil.name,
                                            pupilSurname: pupil.surname,
                                            pupilFullName: (_l = pupil.nameBIN) !== null && _l !== void 0 ? _l : pupil.name,
                                            presenceId: presence.presenceID,
                                            codeId: (_m = presence.codeID) !== null && _m !== void 0 ? _m : code.codeID,
                                            codeName: code.name,
                                            codeColor: code.color,
                                            isOfficial: (_o = code.isOfficial) !== null && _o !== void 0 ? _o : presence.isOfficial,
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
                            const startActions = toArray(((_p = startMailsJson.server) === null || _p === void 0 ? void 0 : _p.response) &&
                                startMailsJson.server.response.actions &&
                                startMailsJson.server.response.actions
                                    .action);
                            const startMessages = toArray(((_r = (_q = startActions[0]) === null || _q === void 0 ? void 0 : _q.data) === null || _r === void 0 ? void 0 : _r.messages) &&
                                ((_s = startActions[0]) === null || _s === void 0 ? void 0 : _s.data).messages.message);
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
                                const moreActions = toArray(((_t = moreMailsJson.server) === null || _t === void 0 ? void 0 : _t.response) &&
                                    moreMailsJson.server.response.actions &&
                                    moreMailsJson.server.response.actions
                                        .action);
                                const moreMessages = toArray(((_v = (_u = moreActions[0]) === null || _u === void 0 ? void 0 : _u.data) === null || _v === void 0 ? void 0 : _v.messages) &&
                                    ((_w = moreActions[0]) === null || _w === void 0 ? void 0 : _w.data).messages.message);
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
                        const mailActions = toArray(((_x = mailJson.server) === null || _x === void 0 ? void 0 : _x.response) &&
                            mailJson.server.response.actions &&
                            mailJson.server.response.actions.action);
                        const msg = (_z = (_y = mailActions[0]) === null || _y === void 0 ? void 0 : _y.data) === null || _z === void 0 ? void 0 : _z.message;
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
                if (resource === 'group' &&
                    (operation === 'getAllAccounts' || operation === 'getAllAccountsExtended')) {
                    const code = this.getNodeParameter('code', itemIndex);
                    const recursive = this.getNodeParameter('recursive', itemIndex, false);
                    const recursiveFlag = recursive ? '1' : '0';
                    const response = await callMethod(operation === 'getAllAccounts' ? 'getAllAccounts' : 'getAllAccountsExtended', {
                        code,
                        recursive: recursiveFlag,
                    });
                    normalizeAndPush(response);
                    continue;
                }
                if (resource === 'group') {
                    if (operation === 'getAllGroupsAndClasses') {
                        const response = await callMethod('getAllGroupsAndClasses', {});
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getClassList') {
                        const response = await callMethod('getClassList', {});
                        returnData.push({
                            json: { csv: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'getClassListJson') {
                        const response = await callMethod('getClassListJson', {});
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getClassTeachers') {
                        const getAllOwners = this.getNodeParameter('getAllOwners', itemIndex, false);
                        const response = await callMethod('getClassTeachers', { getAllOwners });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'changeGroupVisibility') {
                        const code = this.getNodeParameter('code', itemIndex);
                        const visibility = this.getNodeParameter('groupVisibility', itemIndex);
                        const response = await callMethod('changeGroupVisibility', {
                            code,
                            visbility: visibility,
                        });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'saveGroup' || operation === 'saveClass') {
                        const details = this.getNodeParameter('groupClassDetails', itemIndex, {});
                        const required = ((_0 = details.required) !== null && _0 !== void 0 ? _0 : {});
                        const optional = ((_1 = details.optional) !== null && _1 !== void 0 ? _1 : {});
                        const payload = {
                            name: required.name,
                            desc: required.desc,
                            code: required.code,
                            parent: required.parent,
                            untis: required.untis,
                        };
                        if (operation === 'saveClass') {
                            if (optional.instituteNumber) {
                                payload.instituteNumber = optional.instituteNumber;
                            }
                            if (optional.adminNumber) {
                                payload.adminNumber = optional.adminNumber;
                            }
                            if (optional.schoolYearDate) {
                                payload.schoolYearDate = optional.schoolYearDate;
                            }
                        }
                        const response = operation === 'saveGroup'
                            ? await callMethod('saveGroup', payload)
                            : await callMethod('saveClass', payload);
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'saveUserToGroup') {
                        const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                        const classCode = this.getNodeParameter('classCode', itemIndex);
                        const officialDate = this.getNodeParameter('officialDate', itemIndex, '');
                        const payload = {
                            userIdentifier,
                            class: classCode,
                        };
                        if (officialDate) {
                            payload.officialDate = officialDate;
                        }
                        const response = await callMethod('saveUserToClass', payload);
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'removeUserFromGroup') {
                        const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                        const classCode = this.getNodeParameter('classCode', itemIndex);
                        const officialDate = this.getNodeParameter('officialDate', itemIndex, '');
                        const payload = {
                            userIdentifier,
                            class: classCode,
                        };
                        if (officialDate) {
                            payload.officialDate = officialDate;
                        }
                        const response = await callMethod('removeUserFromGroup', payload);
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'delClass') {
                        const classCode = this.getNodeParameter('classCode', itemIndex);
                        const response = await callMethod('delClass', { code: classCode });
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'saveClassList') {
                        const serializedList = this.getNodeParameter('classListCsv', itemIndex);
                        const response = await callMethod('saveClassList', { serializedList });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'saveClassListJson') {
                        const jsonList = this.getNodeParameter('classListJson', itemIndex);
                        const response = await callMethod('saveClassListJson', { jsonList });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getSchoolyearDataOfClass') {
                        const classCode = this.getNodeParameter('classCode', itemIndex);
                        const response = await callMethod('getSchoolyearDataOfClass', { classCode });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'saveSchoolyearDataOfClass') {
                        const classCode = this.getNodeParameter('classCode', itemIndex);
                        const date = this.getNodeParameter('schoolyearDate', itemIndex);
                        const instituteNumber = this.getNodeParameter('schoolyearInstituteNumber', itemIndex);
                        const administrativeGroupNumber = this.getNodeParameter('administrativeGroupNumber', itemIndex);
                        const residence = this.getNodeParameter('residence', itemIndex);
                        const domain = this.getNodeParameter('domain', itemIndex);
                        const principal = this.getNodeParameter('principal', itemIndex);
                        const response = await callMethod('saveSchoolyearDataOfClass', {
                            classCode,
                            date,
                            instituteNumber,
                            administrativeGroupNumber,
                            residence,
                            domain,
                            principal,
                        });
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'getSkoreClassTeacherCourseRelation') {
                        const response = await callMethod('getSkoreClassTeacherCourseRelation', {});
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'clearGroup') {
                        const groupCode = this.getNodeParameter('code', itemIndex);
                        const officialDate = this.getNodeParameter('officialDate', itemIndex, '');
                        const payload = {
                            group: groupCode,
                        };
                        if (officialDate) {
                            payload.officialDate = officialDate;
                        }
                        const response = await callMethod('clearGroup', payload);
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'unregisterStudent') {
                        const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                        const officialDate = this.getNodeParameter('officialDate', itemIndex, '');
                        const payload = {
                            userIdentifier,
                        };
                        if (officialDate) {
                            payload.officialDate = officialDate;
                        }
                        const response = await callMethod('unregisterStudent', payload);
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                }
                if (resource === 'account') {
                    if (operation === 'getUserDetails') {
                        const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                        const response = await callMethod('getUserDetails', { userIdentifier });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getUserDetailsByNumber') {
                        const number = this.getNodeParameter('internalNumber', itemIndex);
                        const response = await callMethod('getUserDetailsByNumber', { number });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getUserDetailsByUsername') {
                        const username = this.getNodeParameter('accountUsername', itemIndex);
                        const response = await callMethod('getUserDetailsByUsername', { username });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getUserDetailsByScannableCode') {
                        const scannableCode = this.getNodeParameter('scannableCode', itemIndex);
                        const response = await callMethod('getUserDetailsByScannableCode', { scannableCode });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getUserOfficialClass') {
                        const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                        const date = this.getNodeParameter('officialClassDate', itemIndex, '') ||
                            new Date().toISOString().slice(0, 10);
                        const response = await callMethod('getUserOfficialClass', { userIdentifier, date });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'saveUser') {
                        const profile = this.getNodeParameter('userProfile', itemIndex, {});
                        const required = ((_2 = profile.required) !== null && _2 !== void 0 ? _2 : {});
                        const optional = ((_3 = profile.optional) !== null && _3 !== void 0 ? _3 : {});
                        const custom = ((_4 = profile.custom) !== null && _4 !== void 0 ? _4 : {});
                        const customFieldsRaw = ((_5 = custom.customFields) !== null && _5 !== void 0 ? _5 : '');
                        let customFields = {};
                        if (customFieldsRaw) {
                            try {
                                customFields = JSON.parse(customFieldsRaw);
                            }
                            catch {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Custom fields must be valid JSON.', { itemIndex });
                            }
                        }
                        const payload = {
                            username: required.username,
                            name: required.name,
                            surname: required.surname,
                            basisrol: required.basisrol,
                        };
                        const addIfValue = (key, value) => {
                            if (value !== undefined && value !== null && value !== '') {
                                payload[key] = value;
                            }
                        };
                        addIfValue('passwd1', optional.passwd1);
                        addIfValue('passwd2', optional.passwd2);
                        addIfValue('passwd3', optional.passwd3);
                        addIfValue('internnumber', optional.internnumber);
                        addIfValue('extranames', optional.extranames);
                        addIfValue('initials', optional.initials);
                        addIfValue('sex', optional.sex);
                        addIfValue('birthday', optional.birthdate);
                        addIfValue('birthplace', optional.birthcity);
                        addIfValue('birthcountry', optional.birthcountry);
                        addIfValue('address', optional.address);
                        addIfValue('postalcode', optional.postalcode);
                        addIfValue('location', optional.city);
                        addIfValue('country', optional.country);
                        addIfValue('email', optional.email);
                        addIfValue('mobilephone', optional.mobile);
                        addIfValue('homephone', optional.phone);
                        for (const [key, value] of Object.entries(customFields)) {
                            addIfValue(key, value);
                        }
                        const response = await callMethod('saveUser', payload);
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'delUser') {
                        const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                        const officialDate = this.getNodeParameter('officialDate', itemIndex, '');
                        const payload = {
                            userIdentifier,
                        };
                        if (officialDate) {
                            payload.officialDate = officialDate;
                        }
                        const response = await callMethod('delUser', payload);
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'setAccountStatus') {
                        const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                        const accountStatus = this.getNodeParameter('accountStatus', itemIndex);
                        const response = await callMethod('setAccountStatus', { userIdentifier, accountStatus });
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'changeUsername') {
                        const internNumber = this.getNodeParameter('internalNumber', itemIndex);
                        const newUsername = this.getNodeParameter('newUsername', itemIndex);
                        const response = await callMethod('changeUsername', { internNumber, newUsername });
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'changeInternNumber') {
                        const username = this.getNodeParameter('accountUsername', itemIndex);
                        const newInternNumber = this.getNodeParameter('newInternNumber', itemIndex);
                        const response = await callMethod('changeInternNumber', { username, newInternNumber });
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'changePasswordAtNextLogin') {
                        const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                        const accountType = this.getNodeParameter('accountType', itemIndex);
                        const response = await callMethod('changePasswordAtNextLogin', {
                            userIdentifier,
                            accountType,
                        });
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'forcePasswordReset') {
                        const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                        const accountType = this.getNodeParameter('accountType', itemIndex);
                        const response = await callMethod('forcePasswordReset', { userIdentifier, accountType });
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'replaceInum') {
                        const oldInum = this.getNodeParameter('oldInum', itemIndex);
                        const newInum = this.getNodeParameter('newInum', itemIndex);
                        const response = await callMethod('replaceInum', { oldInum, newInum });
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'saveUserParameter') {
                        const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                        const paramName = this.getNodeParameter('paramName', itemIndex);
                        const paramValue = this.getNodeParameter('paramValue', itemIndex);
                        const response = await callMethod('saveUserParameter', {
                            userIdentifier,
                            paramName,
                            paramValue,
                        });
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'removeCoAccount') {
                        const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                        const accountType = this.getNodeParameter('accountType', itemIndex);
                        const response = await callMethod('removeCoAccount', { userIdentifier, accountType });
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'savePassword') {
                        const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                        const accountType = this.getNodeParameter('accountType', itemIndex);
                        const password = this.getNodeParameter('password', itemIndex);
                        const mustChangePassword = this.getNodeParameter('mustChangePassword', itemIndex);
                        const response = await callMethod('savePassword', {
                            userIdentifier,
                            accountType,
                            password,
                            changePasswordAtNextLogin: mustChangePassword ? 1 : 0,
                        });
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'deactivateTwoFactorAuthentication') {
                        const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                        const accountType = this.getNodeParameter('accountType', itemIndex);
                        const response = await callMethod('deactivateTwoFactorAuthentication', {
                            userIdentifier,
                            accountType,
                        });
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                }
                if (resource === 'absence') {
                    if (operation === 'getAbsents' || operation === 'getAbsentsWithAlias') {
                        const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                        const schoolYear = this.getNodeParameter('schoolYear', itemIndex);
                        const response = operation === 'getAbsents'
                            ? await callMethod('getAbsents', { userIdentifier, schoolYear })
                            : await callMethod('getAbsentsWithAlias', { userIdentifier, schoolYear });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getAbsentsByDate') {
                        const date = this.getNodeParameter('absenceDate', itemIndex);
                        const response = await callMethod('getAbsentsByDate', { date });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getAbsentsWithAliasByDate') {
                        const date = this.getNodeParameter('absenceDate', itemIndex);
                        const response = await callMethod('getAbsentsWithAliasByDate', { date });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getAbsentsWithInternalNumberByDate') {
                        const date = this.getNodeParameter('absenceDate', itemIndex);
                        const response = await callMethod('getAbsentsWithInternalNumberByDate', { date });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getAbsentsWithUsernameByDate') {
                        const date = this.getNodeParameter('absenceDate', itemIndex);
                        const response = await callMethod('getAbsentsWithUsernameByDate', { date });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getAbsentsByDateAndGroup') {
                        const date = this.getNodeParameter('absenceDate', itemIndex);
                        const code = this.getNodeParameter('code', itemIndex);
                        const response = await callMethod('getAbsentsByDateAndGroup', { date, code });
                        normalizeAndPush(response);
                        continue;
                    }
                }
                if (resource === 'course') {
                    if (operation === 'getCourses') {
                        const response = await callMethod('getCourses', {});
                        returnData.push({
                            json: { csv: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'addCourse') {
                        const coursename = this.getNodeParameter('courseName', itemIndex);
                        const coursedesc = this.getNodeParameter('courseCode', itemIndex);
                        const visibility = this.getNodeParameter('courseVisibility', itemIndex);
                        const response = await callMethod('addCourse', { coursename, coursedesc, visibility });
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'addCourseStudents') {
                        const coursename = this.getNodeParameter('courseName', itemIndex);
                        const coursedesc = this.getNodeParameter('courseCode', itemIndex);
                        const groupIds = this.getNodeParameter('courseGroupIds', itemIndex);
                        const response = await callMethod('addCourseStudents', {
                            coursename,
                            coursedesc,
                            groupIds,
                        });
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'addCourseTeacher') {
                        const coursename = this.getNodeParameter('courseName', itemIndex);
                        const coursedesc = this.getNodeParameter('courseCode', itemIndex);
                        const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                        const internnummer = this.getNodeParameter('courseTeacherInternNumber', itemIndex);
                        const response = await callMethod('addCourseTeacher', {
                            coursename,
                            coursedesc,
                            internnummer,
                            userlist: userIdentifier,
                        });
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                }
                if (resource === 'system') {
                    if (operation === 'startSkoreSync') {
                        const response = await callMethod('startSkoreSync', {});
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'checkStatus') {
                        const serviceId = this.getNodeParameter('serviceId', itemIndex);
                        const response = await callMethod('checkStatus', { serviceId });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getStudentCareer') {
                        const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                        const response = await callMethod('getStudentCareer', { userIdentifier });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getDeliberationLines') {
                        const dateInSchoolYear = this.getNodeParameter('deliberationDate', itemIndex);
                        const response = await callMethod('getDeliberationLines', { dateInSchoolYear });
                        normalizeAndPush(response);
                        continue;
                    }
                }
                if (resource === 'helpdesk') {
                    if (operation === 'getHelpdeskMiniDbItems') {
                        const response = await callMethod('getHelpdeskMiniDbItems', {});
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'addHelpdeskTicket') {
                        const title = this.getNodeParameter('title', itemIndex);
                        const description = this.getNodeParameter('ticketDescription', itemIndex);
                        const wrapHtml = this.getNodeParameter('wrapHtml', itemIndex, false);
                        const priority = this.getNodeParameter('priority', itemIndex);
                        const miniDbItem = this.getNodeParameter('miniDbItem', itemIndex);
                        const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                        const response = await callMethod('addHelpdeskTicket', {
                            title,
                            description: wrapHtml ? (0, GenericFunctions_1.plaintextToHtml)(description) : description,
                            priority,
                            miniDbItem,
                            userIdentifier,
                        });
                        returnData.push({
                            json: typeof response === 'object' && response !== null
                                ? response
                                : { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                }
                if (resource === 'message' && operation === 'sendMsg') {
                    const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                    const title = this.getNodeParameter('title', itemIndex);
                    const body = this.getNodeParameter('messageBody', itemIndex);
                    const wrapHtml = this.getNodeParameter('wrapHtml', itemIndex, false);
                    const senderIdentifier = this.getNodeParameter('senderIdentifier', itemIndex);
                    const coaccount = this.getNodeParameter('coaccount', itemIndex, 0);
                    const copyToLVS = this.getNodeParameter('copyToLVS', itemIndex, false);
                    const attachmentCollection = this.getNodeParameter('attachments', itemIndex, {});
                    const payload = {
                        userIdentifier,
                        title,
                        body: wrapHtml ? (0, GenericFunctions_1.plaintextToHtml)(body) : body,
                        senderIdentifier,
                        coaccount,
                        copyToLVS,
                    };
                    const attachmentValues = ((_6 = attachmentCollection.attachment) !== null && _6 !== void 0 ? _6 : []);
                    const cleanedAttachments = attachmentValues.filter((entry) => (entry === null || entry === void 0 ? void 0 : entry.filename) && (entry === null || entry === void 0 ? void 0 : entry.filedata));
                    if (cleanedAttachments.length) {
                        payload.attachments = JSON.stringify(cleanedAttachments);
                    }
                    const response = await callMethod('sendMsg', payload);
                    returnData.push({
                        json: { success: response },
                        pairedItem: { item: itemIndex },
                    });
                    continue;
                }
                if (resource === 'message' && operation === 'saveSignature') {
                    const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                    const signature = this.getNodeParameter('signature', itemIndex);
                    const accountType = this.getNodeParameter('signatureAccountType', itemIndex);
                    const response = await callMethod('saveSignature', {
                        userIdentifier,
                        accountType,
                        signature,
                    });
                    returnData.push({
                        json: { success: response },
                        pairedItem: { item: itemIndex },
                    });
                    continue;
                }
                if (resource === 'parameter' && operation === 'getReferenceField') {
                    const response = await callMethod('getReferenceField', {});
                    normalizeAndPush(response);
                    continue;
                }
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported resource "${resource}" or operation "${operation}"`, { itemIndex });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: errorMessage,
                        },
                        pairedItem: { item: itemIndex },
                    });
                    continue;
                }
                if (error instanceof n8n_workflow_1.NodeOperationError) {
                    throw error;
                }
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), errorMessage, { itemIndex });
            }
        }
        return [returnData];
    }
}
exports.SmartSchool = SmartSchool;
//# sourceMappingURL=SmartSchool.node.js.map