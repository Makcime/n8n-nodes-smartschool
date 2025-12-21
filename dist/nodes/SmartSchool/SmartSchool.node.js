"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartSchool = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const smartschool_kit_1 = require("@abrianto/smartschool-kit");
const GenericFunctions_1 = require("./GenericFunctions");
const fields_1 = require("./shared/fields");
const errorCodes_1 = require("./shared/errorCodes");
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
                        {
                            name: 'Course',
                            value: 'course',
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
                        {
                            name: 'Save User',
                            value: 'saveUser',
                            description: 'Create or update a SmartSchool user',
                            action: 'Save user',
                        },
                        {
                            name: 'Delete User',
                            value: 'delUser',
                            description: 'Remove a user from SmartSchool',
                            action: 'Delete user',
                        },
                        {
                            name: 'Set Account Status',
                            value: 'setAccountStatus',
                            description: 'Activate, deactivate, or set account status',
                            action: 'Set account status',
                        },
                        {
                            name: 'Change Username',
                            value: 'changeUsername',
                            description: 'Change a username using the internal number',
                            action: 'Change username',
                        },
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
                            name: 'Force Password Reset',
                            value: 'forcePasswordReset',
                            description: 'Force a password reset for a user account',
                            action: 'Force password reset',
                        },
                        {
                            name: 'Replace Internal Number',
                            value: 'replaceInum',
                            description: 'Replace a user internal number with a new one',
                            action: 'Replace internal number',
                        },
                        {
                            name: 'Save User Parameter',
                            value: 'saveUserParameter',
                            description: 'Update a SmartSchool user parameter',
                            action: 'Save user parameter',
                        },
                        {
                            name: 'Remove Co-Account',
                            value: 'removeCoAccount',
                            description: 'Remove a co-account from a user',
                            action: 'Remove co-account',
                        },
                        {
                            name: 'Save Password',
                            value: 'savePassword',
                            description: 'Set a new password for a user account',
                            action: 'Save password',
                        },
                        {
                            name: 'Deactivate Two-Factor Authentication',
                            value: 'deactivateTwoFactorAuthentication',
                            description: 'Deprecated SmartSchool method to disable 2FA',
                            action: 'Deactivate two-factor authentication',
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
                        {
                            name: 'Change Group Visibility',
                            value: 'changeGroupVisibility',
                            description: 'Toggle visibility of a group or class',
                            action: 'Change group visibility',
                        },
                        {
                            name: 'Save Group',
                            value: 'saveGroup',
                            description: 'Create or update a group',
                            action: 'Save group',
                        },
                        {
                            name: 'Save Class',
                            value: 'saveClass',
                            description: 'Create or update a class',
                            action: 'Save class',
                        },
                        {
                            name: 'Save User to Group',
                            value: 'saveUserToGroup',
                            description: 'Assign a user to a class or group',
                            action: 'Save user to group',
                        },
                        {
                            name: 'Remove User from Group',
                            value: 'removeUserFromGroup',
                            description: 'Remove a user from a class or group',
                            action: 'Remove user from group',
                        },
                        {
                            name: 'Delete Class',
                            value: 'delClass',
                            description: 'Delete a class or group',
                            action: 'Delete class',
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
                            name: 'Get Schoolyear Data of Class',
                            value: 'getSchoolyearDataOfClass',
                            description: 'Retrieve schoolyear metadata for a class',
                            action: 'Get schoolyear data of class',
                        },
                        {
                            name: 'Save Schoolyear Data of Class',
                            value: 'saveSchoolyearDataOfClass',
                            description: 'Update schoolyear metadata for a class',
                            action: 'Save schoolyear data of class',
                        },
                        {
                            name: 'Get Skore Class Teacher Course Relation',
                            value: 'getSkoreClassTeacherCourseRelation',
                            description: 'Retrieve Skore class-teacher-course relations',
                            action: 'Get skore class teacher course relation',
                        },
                        {
                            name: 'Clear Group',
                            value: 'clearGroup',
                            description: 'Remove all users from a group',
                            action: 'Clear group',
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
                            action: 'Send SmartSchool message',
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
                                    displayName: 'Name',
                                    name: 'name',
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
                                    displayName: 'Code',
                                    name: 'code',
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
                            displayName: 'Optional (Classes only)',
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
                    description: 'Administrative group number',
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
                    description: 'Date (YYYY-MM-DD). Leave empty to use today',
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
                    description: '0 = main account, 1 = first co-account, etc.',
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
                    description: '0 = main account, 1 = first co-account, etc.',
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
                    description: 'Force the user to change password at next login',
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
                                        { name: 'Student (leerling)', value: 'leerling' },
                                        { name: 'Teacher (leerkracht)', value: 'leerkracht' },
                                        { name: 'Management (directie)', value: 'directie' },
                                        { name: 'Other (andere)', value: 'andere' },
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
                                    displayName: 'Primary Password',
                                    name: 'passwd1',
                                    type: 'string',
                                    typeOptions: { password: true },
                                    default: '',
                                },
                                {
                                    displayName: 'Internal Number',
                                    name: 'internnumber',
                                    type: 'string',
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
                                    displayName: 'Sex',
                                    name: 'sex',
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
                                    displayName: 'Nationality',
                                    name: 'nationality',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'Address',
                                    name: 'address',
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
                                    displayName: 'Phone',
                                    name: 'phone',
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
                                    displayName: 'Email',
                                    name: 'email',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'Secondary Password',
                                    name: 'passwd2',
                                    type: 'string',
                                    typeOptions: { password: true },
                                    default: '',
                                },
                                {
                                    displayName: 'Tertiary Password',
                                    name: 'passwd3',
                                    type: 'string',
                                    typeOptions: { password: true },
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
        var _a, _b, _c, _d, _e, _f, _g;
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
            const formatSmartschoolError = (error) => {
                if (error instanceof smartschool_kit_1.SmartschoolError) {
                    const code = Number(error.code);
                    const mapped = errorCodes_1.SMARTSCHOOL_ERROR_CODES[code];
                    if (mapped) {
                        return `SmartSchool error ${code}: ${mapped}`;
                    }
                    return `SmartSchool error ${code}: ${error.message}`;
                }
                if (error instanceof Error) {
                    return error.message;
                }
                return 'Unknown error';
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
                    if (operation === 'changeGroupVisibility') {
                        const code = this.getNodeParameter('code', itemIndex);
                        const visibility = this.getNodeParameter('groupVisibility', itemIndex);
                        const response = await GenericFunctions_1.callSmartschoolSoap.call(this, 'changeGroupVisibility', {
                            accesscode,
                            code,
                            visbility: visibility,
                        });
                        returnData.push({
                            json: { xml: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'saveGroup' || operation === 'saveClass') {
                        const details = this.getNodeParameter('groupClassDetails', itemIndex, {});
                        const required = ((_a = details.required) !== null && _a !== void 0 ? _a : {});
                        const optional = ((_b = details.optional) !== null && _b !== void 0 ? _b : {});
                        const payload = {
                            accesscode,
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
                            ? await client.saveGroup(payload)
                            : await client.saveClass(payload);
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
                            accesscode,
                            userIdentifier,
                            class: classCode,
                        };
                        if (officialDate) {
                            payload.officialDate = officialDate;
                        }
                        const response = await client.saveUserToClass(payload);
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
                            accesscode,
                            userIdentifier,
                            class: classCode,
                        };
                        if (officialDate) {
                            payload.officialDate = officialDate;
                        }
                        const response = await client.removeUserFromGroup(payload);
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'delClass') {
                        const classCode = this.getNodeParameter('classCode', itemIndex);
                        const response = await client.delClass({
                            accesscode,
                            code: classCode,
                        });
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'saveClassList') {
                        const serializedList = this.getNodeParameter('classListCsv', itemIndex);
                        const response = await client.saveClassList({
                            accesscode,
                            serializedList,
                        });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'saveClassListJson') {
                        const jsonList = this.getNodeParameter('classListJson', itemIndex);
                        const response = await client.saveClassListJson({
                            accesscode,
                            jsonList,
                        });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getSchoolyearDataOfClass') {
                        const classCode = this.getNodeParameter('classCode', itemIndex);
                        const response = await client.getSchoolyearDataOfClass({
                            accesscode,
                            classCode,
                        });
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
                        const response = await client.saveSchoolyearDataOfClass({
                            accesscode,
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
                        const response = await client.getSkoreClassTeacherCourseRelation();
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'clearGroup') {
                        const groupCode = this.getNodeParameter('code', itemIndex);
                        const officialDate = this.getNodeParameter('officialDate', itemIndex, '');
                        const payload = {
                            accesscode,
                            group: groupCode,
                        };
                        if (officialDate) {
                            payload.officialDate = officialDate;
                        }
                        const response = await client.clearGroup(payload);
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
                            accesscode,
                            userIdentifier,
                        };
                        if (officialDate) {
                            payload.officialDate = officialDate;
                        }
                        const response = await client.unregisterStudent(payload);
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
                    if (operation === 'saveUser') {
                        const profile = this.getNodeParameter('userProfile', itemIndex, {});
                        const required = ((_c = profile.required) !== null && _c !== void 0 ? _c : {});
                        const optional = ((_d = profile.optional) !== null && _d !== void 0 ? _d : {});
                        const custom = ((_e = profile.custom) !== null && _e !== void 0 ? _e : {});
                        const customFieldsRaw = ((_f = custom.customFields) !== null && _f !== void 0 ? _f : '');
                        let customFields = {};
                        if (customFieldsRaw) {
                            try {
                                customFields = JSON.parse(customFieldsRaw);
                            }
                            catch (error) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Custom fields must be valid JSON.', { itemIndex });
                            }
                        }
                        const payload = {
                            accesscode,
                            username: required.username,
                            name: required.name,
                            surname: required.surname,
                            basisrol: required.basisrol,
                            ...optional,
                            ...customFields,
                        };
                        const response = await client.saveUser(payload);
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
                            accesscode,
                            userIdentifier,
                        };
                        if (officialDate) {
                            payload.officialDate = officialDate;
                        }
                        const response = await client.delUser(payload);
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'setAccountStatus') {
                        const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                        const accountStatus = this.getNodeParameter('accountStatus', itemIndex);
                        const response = await client.setAccountStatus({
                            accesscode,
                            userIdentifier,
                            accountStatus,
                        });
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'changeUsername') {
                        const internNumber = this.getNodeParameter('internalNumber', itemIndex);
                        const newUsername = this.getNodeParameter('newUsername', itemIndex);
                        const response = await client.changeUsername({
                            accesscode,
                            internNumber,
                            newUsername,
                        });
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'changeInternNumber') {
                        const username = this.getNodeParameter('accountUsername', itemIndex);
                        const newInternNumber = this.getNodeParameter('newInternNumber', itemIndex);
                        const response = await client.changeInternNumber({
                            accesscode,
                            username,
                            newInternNumber,
                        });
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'changePasswordAtNextLogin') {
                        const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                        const accountType = this.getNodeParameter('accountType', itemIndex);
                        const response = await client.changePasswordAtNextLogin({
                            accesscode,
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
                        const response = await client.forcePasswordReset({
                            accesscode,
                            userIdentifier,
                            accountType,
                        });
                        returnData.push({
                            json: { success: response },
                            pairedItem: { item: itemIndex },
                        });
                        continue;
                    }
                    if (operation === 'replaceInum') {
                        const oldInum = this.getNodeParameter('oldInum', itemIndex);
                        const newInum = this.getNodeParameter('newInum', itemIndex);
                        const response = await client.replaceInum({
                            accesscode,
                            oldInum,
                            newInum,
                        });
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
                        const response = await client.saveUserParameter({
                            accesscode,
                            userIdentifier,
                            paramName: paramName,
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
                        const response = await client.removeCoAccount({
                            accesscode,
                            userIdentifier,
                            accountType,
                        });
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
                        const response = await client.savePassword({
                            accesscode,
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
                        const response = await client.deactivateTwoFactorAuthentication({
                            accesscode,
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
                if (resource === 'course') {
                    if (operation === 'getCourses') {
                        const response = await client.getCourses();
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
                        const response = await client.addCourse({
                            accesscode,
                            coursename,
                            coursedesc,
                            visibility,
                        });
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
                        const response = await client.addCourseStudents({
                            accesscode,
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
                        const response = await client.addCourseTeacher({
                            accesscode,
                            coursename,
                            coursedesc,
                            userIdentifier,
                            internnummer,
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
                        const response = await client.startSkoreSync();
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'checkStatus') {
                        const serviceId = this.getNodeParameter('serviceId', itemIndex);
                        const response = await client.checkStatus({ accesscode, serviceId });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getStudentCareer') {
                        const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                        const response = await client.getStudentCareer({ accesscode, userIdentifier });
                        normalizeAndPush(response);
                        continue;
                    }
                    if (operation === 'getDeliberationLines') {
                        const dateInSchoolYear = this.getNodeParameter('deliberationDate', itemIndex);
                        const response = await GenericFunctions_1.callSmartschoolSoap.call(this, 'getDeliberationLines', {
                            accesscode,
                            dateInSchoolYear,
                        });
                        returnData.push({
                            json: { xml: response },
                            pairedItem: { item: itemIndex },
                        });
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
                    const attachmentValues = ((_g = attachmentCollection.attachment) !== null && _g !== void 0 ? _g : []);
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
                if (resource === 'message' && operation === 'saveSignature') {
                    const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex);
                    const signature = this.getNodeParameter('signature', itemIndex);
                    const accountType = this.getNodeParameter('signatureAccountType', itemIndex);
                    const response = await client.saveSignature({
                        accesscode,
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
                    const response = await client.getReferenceField();
                    normalizeAndPush(response);
                    continue;
                }
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported resource "${resource}" or operation "${operation}"`, { itemIndex });
            }
            catch (error) {
                const errorMessage = formatSmartschoolError(error);
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