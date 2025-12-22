import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import { callSmartschoolSoap, getSmartSchoolCredentials, plaintextToHtml } from './GenericFunctions';
import { ACCOUNT_STATUS_OPTIONS, VISIBILITY_OPTIONS } from './shared/fields';
import { SMARTSCHOOL_ERROR_CODES } from './shared/errorCodes';

type SupportedResource =
	| 'group'
	| 'helpdesk'
	| 'message'
	| 'account'
	| 'parameter'
	| 'absence'
	| 'course'
	| 'system';
type SupportedOperation =
	| 'getAllAccounts'
	| 'getAllAccountsExtended'
	| 'getAllGroupsAndClasses'
	| 'getClassList'
	| 'getClassListJson'
	| 'getClassTeachers'
	| 'saveGroup'
	| 'saveClass'
	| 'saveUserToGroup'
	| 'removeUserFromGroup'
	| 'delClass'
	| 'saveClassList'
	| 'saveClassListJson'
	| 'getSchoolyearDataOfClass'
	| 'saveSchoolyearDataOfClass'
	| 'getSkoreClassTeacherCourseRelation'
	| 'clearGroup'
	| 'unregisterStudent'
	| 'addCourse'
	| 'addCourseStudents'
	| 'addCourseTeacher'
	| 'getCourses'
	| 'startSkoreSync'
	| 'checkStatus'
	| 'getStudentCareer'
	| 'getHelpdeskMiniDbItems'
	| 'addHelpdeskTicket'
	| 'sendMsg'
	| 'saveSignature'
	| 'getUserDetails'
	| 'getUserDetailsByNumber'
	| 'getUserDetailsByUsername'
	| 'getUserDetailsByScannableCode'
	| 'getUserOfficialClass'
	| 'getReferenceField'
	| 'getAbsents'
	| 'getAbsentsWithAlias'
	| 'getAbsentsByDate'
	| 'getAbsentsWithAliasByDate'
	| 'getAbsentsWithInternalNumberByDate'
	| 'getAbsentsWithUsernameByDate'
	| 'getAbsentsByDateAndGroup'
	| 'saveUser'
	| 'delUser'
	| 'setAccountStatus'
	| 'changeUsername'
	| 'changeInternNumber'
	| 'changePasswordAtNextLogin'
	| 'forcePasswordReset'
	| 'replaceInum'
	| 'saveUserParameter'
	| 'removeCoAccount'
	| 'savePassword'
	| 'deactivateTwoFactorAuthentication'
	| 'changeGroupVisibility'
	| 'getDeliberationLines';

export class SmartSchool implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SmartSchool',
		name: 'smartSchool',
		icon: { light: 'file:smartschool.logo.svg', dark: 'file:smartschool.logo.dark.svg' },
		group: ['transform'],
		version: 1,
		description: 'Interact with the SmartSchool API',
		defaults: { name: 'SmartSchool' },
		subtitle: '={{$parameter.operation + ": " + $parameter.resource}}',
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
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
				description:
					'Whether to include the accounts of all descendant subgroups (SmartSchool expects 1 or 0)',
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
				options: VISIBILITY_OPTIONS,
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
							required:	true,
							},
							{
						displayName: 'Description',
						name: 'desc',
						type: 'string',
						default: '',
							required:	true,
							},
							{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
							required:	true,
							},
							{
						displayName: 'Parent Code',
						name: 'parent',
						type: 'string',
						default: '',
							required:	true,
							},
							{
						displayName: 'Untis Code',
						name: 'untis',
						type: 'string',
						default: '',
							required:	true,
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
				options: VISIBILITY_OPTIONS,
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
				description:
					'Whether to convert plain text into a minimal HTML document with paragraphs and line breaks',
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
				description:
					'Identifier of the helpdesk category item (retrieve via the "List Helpdesk Items" operation)',
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
				options: ACCOUNT_STATUS_OPTIONS,
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

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const { accesscode } = await getSmartSchoolCredentials.call(this);

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			const normalizeAndPush = (data: unknown) => {
				if (Array.isArray(data)) {
					for (const entry of data) {
						returnData.push({
							json: (entry ?? {}) as IDataObject,
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
					json: data as IDataObject,
					pairedItem: { item: itemIndex },
				});
			};
			const maybeThrowSmartschoolError = (result: unknown) => {
				const code =
					typeof result === 'number'
						? result
						: typeof result === 'string' && /^\d+$/.test(result)
							? Number(result)
							: null;
				if (code !== null && SMARTSCHOOL_ERROR_CODES[code]) {
					throw new NodeOperationError(
						this.getNode(),
						`SmartSchool error ${code}: ${SMARTSCHOOL_ERROR_CODES[code]}`,
						{ itemIndex },
					);
				}
			};
			const callMethod = async (
				method: string,
				params: Record<string, string | number | boolean>,
			) => {
				const result = await callSmartschoolSoap.call(this, method, {
					accesscode,
					...params,
				});
				maybeThrowSmartschoolError(result);
				return result;
			};

			try {
				const resource = this.getNodeParameter('resource', itemIndex) as SupportedResource;
				const operation = this.getNodeParameter('operation', itemIndex) as SupportedOperation;

				if (
					resource === 'group' &&
					(operation === 'getAllAccounts' || operation === 'getAllAccountsExtended')
				) {
					const code = this.getNodeParameter('code', itemIndex) as string;
					const recursive = this.getNodeParameter('recursive', itemIndex, false) as boolean;
					const recursiveFlag = recursive ? '1' : '0';
					const response = await callMethod(
						operation === 'getAllAccounts' ? 'getAllAccounts' : 'getAllAccountsExtended',
						{
							code,
							recursive: recursiveFlag,
						},
					);
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
						const getAllOwners = this.getNodeParameter('getAllOwners', itemIndex, false) as boolean;
						const response = await callMethod('getClassTeachers', { getAllOwners });
						normalizeAndPush(response);
						continue;
					}

					if (operation === 'changeGroupVisibility') {
						const code = this.getNodeParameter('code', itemIndex) as string;
						const visibility = this.getNodeParameter('groupVisibility', itemIndex) as number;
						// WSDL parameter is misspelled as "visbility".
						const response = await callMethod('changeGroupVisibility', {
							code,
							visbility: visibility,
						});
						normalizeAndPush(response);
						continue;
					}

					if (operation === 'saveGroup' || operation === 'saveClass') {
						const details = this.getNodeParameter('groupClassDetails', itemIndex, {}) as IDataObject;
						const required = (details.required ?? {}) as IDataObject;
						const optional = (details.optional ?? {}) as IDataObject;

						const payload: IDataObject = {
							name: required.name as string,
							desc: required.desc as string,
							code: required.code as string,
							parent: required.parent as string,
							untis: required.untis as string,
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

						const response =
							operation === 'saveGroup'
								? await callMethod('saveGroup', payload as Record<string, string | number | boolean>)
								: await callMethod('saveClass', payload as Record<string, string | number | boolean>);

						returnData.push({
							json: { success: response },
							pairedItem: { item: itemIndex },
						});
						continue;
					}

					if (operation === 'saveUserToGroup') {
						const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
						const classCode = this.getNodeParameter('classCode', itemIndex) as string;
						const officialDate = this.getNodeParameter('officialDate', itemIndex, '') as string;
						const payload: IDataObject = {
							userIdentifier,
							class: classCode,
						};
						if (officialDate) {
							payload.officialDate = officialDate;
						}
						const response = await callMethod(
							'saveUserToClass',
							payload as Record<string, string | number | boolean>,
						);
						returnData.push({
							json: { success: response },
							pairedItem: { item: itemIndex },
						});
						continue;
					}

					if (operation === 'removeUserFromGroup') {
						const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
						const classCode = this.getNodeParameter('classCode', itemIndex) as string;
						const officialDate = this.getNodeParameter('officialDate', itemIndex, '') as string;
						const payload: IDataObject = {
							userIdentifier,
							class: classCode,
						};
						if (officialDate) {
							payload.officialDate = officialDate;
						}
						const response = await callMethod(
							'removeUserFromGroup',
							payload as Record<string, string | number | boolean>,
						);
						returnData.push({
							json: { success: response },
							pairedItem: { item: itemIndex },
						});
						continue;
					}

					if (operation === 'delClass') {
						const classCode = this.getNodeParameter('classCode', itemIndex) as string;
						const response = await callMethod('delClass', { code: classCode });
						returnData.push({
							json: { success: response },
							pairedItem: { item: itemIndex },
						});
						continue;
					}

					if (operation === 'saveClassList') {
						const serializedList = this.getNodeParameter('classListCsv', itemIndex) as string;
						const response = await callMethod('saveClassList', { serializedList });
						normalizeAndPush(response);
						continue;
					}

					if (operation === 'saveClassListJson') {
						const jsonList = this.getNodeParameter('classListJson', itemIndex) as string;
						const response = await callMethod('saveClassListJson', { jsonList });
						normalizeAndPush(response);
						continue;
					}

					if (operation === 'getSchoolyearDataOfClass') {
						const classCode = this.getNodeParameter('classCode', itemIndex) as string;
						const response = await callMethod('getSchoolyearDataOfClass', { classCode });
						normalizeAndPush(response);
						continue;
					}

					if (operation === 'saveSchoolyearDataOfClass') {
						const classCode = this.getNodeParameter('classCode', itemIndex) as string;
						const date = this.getNodeParameter('schoolyearDate', itemIndex) as string;
						const instituteNumber = this.getNodeParameter(
							'schoolyearInstituteNumber',
							itemIndex,
						) as string;
						const administrativeGroupNumber = this.getNodeParameter(
							'administrativeGroupNumber',
							itemIndex,
						) as string;
						const residence = this.getNodeParameter('residence', itemIndex) as string;
						const domain = this.getNodeParameter('domain', itemIndex) as string;
						const principal = this.getNodeParameter('principal', itemIndex) as string;

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
						const groupCode = this.getNodeParameter('code', itemIndex) as string;
						const officialDate = this.getNodeParameter('officialDate', itemIndex, '') as string;
						const payload: IDataObject = {
							group: groupCode,
						};
						if (officialDate) {
							payload.officialDate = officialDate;
						}
						const response = await callMethod(
							'clearGroup',
							payload as Record<string, string | number | boolean>,
						);
						returnData.push({
							json: { success: response },
							pairedItem: { item: itemIndex },
						});
						continue;
					}

					if (operation === 'unregisterStudent') {
						const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
						const officialDate = this.getNodeParameter('officialDate', itemIndex, '') as string;
						const payload: IDataObject = {
							userIdentifier,
						};
						if (officialDate) {
							payload.officialDate = officialDate;
						}
						const response = await callMethod(
							'unregisterStudent',
							payload as Record<string, string | number | boolean>,
						);
						returnData.push({
							json: { success: response },
							pairedItem: { item: itemIndex },
						});
						continue;
					}
				}

				if (resource === 'account') {
					if (operation === 'getUserDetails') {
						const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
						const response = await callMethod('getUserDetails', { userIdentifier });
						normalizeAndPush(response);
						continue;
					}

					if (operation === 'getUserDetailsByNumber') {
						const number = this.getNodeParameter('internalNumber', itemIndex) as string;
						const response = await callMethod('getUserDetailsByNumber', { number });
						normalizeAndPush(response);
						continue;
					}

					if (operation === 'getUserDetailsByUsername') {
						const username = this.getNodeParameter('accountUsername', itemIndex) as string;
						const response = await callMethod('getUserDetailsByUsername', { username });
						normalizeAndPush(response);
						continue;
					}

					if (operation === 'getUserDetailsByScannableCode') {
						const scannableCode = this.getNodeParameter('scannableCode', itemIndex) as string;
						const response = await callMethod('getUserDetailsByScannableCode', { scannableCode });
						normalizeAndPush(response);
						continue;
					}

					if (operation === 'getUserOfficialClass') {
						const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
						const date =
							(this.getNodeParameter('officialClassDate', itemIndex, '') as string) ||
							new Date().toISOString().slice(0, 10);

						const response = await callMethod('getUserOfficialClass', { userIdentifier, date });
						normalizeAndPush(response);
						continue;
					}

					if (operation === 'saveUser') {
						const profile = this.getNodeParameter('userProfile', itemIndex, {}) as IDataObject;
						const required = (profile.required ?? {}) as IDataObject;
						const optional = (profile.optional ?? {}) as IDataObject;
						const custom = (profile.custom ?? {}) as IDataObject;
						const customFieldsRaw = (custom.customFields ?? '') as string;

						let customFields: IDataObject = {};
						if (customFieldsRaw) {
							try {
								customFields = JSON.parse(customFieldsRaw) as IDataObject;
						} catch {
							throw new NodeOperationError(
								this.getNode(),
								'Custom fields must be valid JSON.',
									{ itemIndex },
								);
							}
						}

						const payload: Record<string, string | number | boolean> = {
							username: required.username as string,
							name: required.name as string,
							surname: required.surname as string,
							basisrol: required.basisrol as string,
						};

						const addIfValue = (key: string, value?: unknown) => {
							if (value !== undefined && value !== null && value !== '') {
								payload[key] = value as string;
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
						const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
						const officialDate = this.getNodeParameter('officialDate', itemIndex, '') as string;
						const payload: Record<string, string | number | boolean> = {
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
						const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
						const accountStatus = this.getNodeParameter('accountStatus', itemIndex) as string;
						const response = await callMethod('setAccountStatus', { userIdentifier, accountStatus });
						returnData.push({
							json: { success: response },
							pairedItem: { item: itemIndex },
						});
						continue;
					}

					if (operation === 'changeUsername') {
						const internNumber = this.getNodeParameter('internalNumber', itemIndex) as string;
						const newUsername = this.getNodeParameter('newUsername', itemIndex) as string;
						const response = await callMethod('changeUsername', { internNumber, newUsername });
						returnData.push({
							json: { success: response },
							pairedItem: { item: itemIndex },
						});
						continue;
					}

					if (operation === 'changeInternNumber') {
						const username = this.getNodeParameter('accountUsername', itemIndex) as string;
						const newInternNumber = this.getNodeParameter('newInternNumber', itemIndex) as string;
						const response = await callMethod('changeInternNumber', { username, newInternNumber });
						returnData.push({
							json: { success: response },
							pairedItem: { item: itemIndex },
						});
						continue;
					}

					if (operation === 'changePasswordAtNextLogin') {
						const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
						const accountType = this.getNodeParameter('accountType', itemIndex) as number;
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
						const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
						const accountType = this.getNodeParameter('accountType', itemIndex) as number;
						const response = await callMethod('forcePasswordReset', { userIdentifier, accountType });
						returnData.push({
							json: { success: response },
							pairedItem: { item: itemIndex },
						});
						continue;
					}

					if (operation === 'replaceInum') {
						const oldInum = this.getNodeParameter('oldInum', itemIndex) as string;
						const newInum = this.getNodeParameter('newInum', itemIndex) as string;
						const response = await callMethod('replaceInum', { oldInum, newInum });
						returnData.push({
							json: { success: response },
							pairedItem: { item: itemIndex },
						});
						continue;
					}

					if (operation === 'saveUserParameter') {
						const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
						const paramName = this.getNodeParameter('paramName', itemIndex) as string;
						const paramValue = this.getNodeParameter('paramValue', itemIndex) as string;
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
						const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
						const accountType = this.getNodeParameter('accountType', itemIndex) as number;
						const response = await callMethod('removeCoAccount', { userIdentifier, accountType });
						returnData.push({
							json: { success: response },
							pairedItem: { item: itemIndex },
						});
						continue;
					}

					if (operation === 'savePassword') {
						const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
						const accountType = this.getNodeParameter('accountType', itemIndex) as number;
						const password = this.getNodeParameter('password', itemIndex) as string;
						const mustChangePassword = this.getNodeParameter('mustChangePassword', itemIndex) as boolean;
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
						const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
						const accountType = this.getNodeParameter('accountType', itemIndex) as number;
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
						const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
						const schoolYear = this.getNodeParameter('schoolYear', itemIndex) as string;
						const response =
							operation === 'getAbsents'
								? await callMethod('getAbsents', { userIdentifier, schoolYear })
								: await callMethod('getAbsentsWithAlias', { userIdentifier, schoolYear });
						normalizeAndPush(response);
						continue;
					}

					if (operation === 'getAbsentsByDate') {
						const date = this.getNodeParameter('absenceDate', itemIndex) as string;
						const response = await callMethod('getAbsentsByDate', { date });
						normalizeAndPush(response);
						continue;
					}

					if (operation === 'getAbsentsWithAliasByDate') {
						const date = this.getNodeParameter('absenceDate', itemIndex) as string;
						const response = await callMethod('getAbsentsWithAliasByDate', { date });
						normalizeAndPush(response);
						continue;
					}

					if (operation === 'getAbsentsWithInternalNumberByDate') {
						const date = this.getNodeParameter('absenceDate', itemIndex) as string;
						const response = await callMethod('getAbsentsWithInternalNumberByDate', { date });
						normalizeAndPush(response);
						continue;
					}

					if (operation === 'getAbsentsWithUsernameByDate') {
						const date = this.getNodeParameter('absenceDate', itemIndex) as string;
						const response = await callMethod('getAbsentsWithUsernameByDate', { date });
						normalizeAndPush(response);
						continue;
					}

					if (operation === 'getAbsentsByDateAndGroup') {
						const date = this.getNodeParameter('absenceDate', itemIndex) as string;
						const code = this.getNodeParameter('code', itemIndex) as string;
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
						const coursename = this.getNodeParameter('courseName', itemIndex) as string;
						const coursedesc = this.getNodeParameter('courseCode', itemIndex) as string;
						const visibility = this.getNodeParameter('courseVisibility', itemIndex) as number;
						const response = await callMethod('addCourse', { coursename, coursedesc, visibility });
						returnData.push({
							json: { success: response },
							pairedItem: { item: itemIndex },
						});
						continue;
					}

					if (operation === 'addCourseStudents') {
						const coursename = this.getNodeParameter('courseName', itemIndex) as string;
						const coursedesc = this.getNodeParameter('courseCode', itemIndex) as string;
						const groupIds = this.getNodeParameter('courseGroupIds', itemIndex) as string;
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
						const coursename = this.getNodeParameter('courseName', itemIndex) as string;
						const coursedesc = this.getNodeParameter('courseCode', itemIndex) as string;
						const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
						const internnummer = this.getNodeParameter(
							'courseTeacherInternNumber',
							itemIndex,
						) as string;
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
						const serviceId = this.getNodeParameter('serviceId', itemIndex) as string;
						const response = await callMethod('checkStatus', { serviceId });
						normalizeAndPush(response);
						continue;
					}

					if (operation === 'getStudentCareer') {
						const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
						const response = await callMethod('getStudentCareer', { userIdentifier });
						normalizeAndPush(response);
						continue;
					}

					if (operation === 'getDeliberationLines') {
						const dateInSchoolYear = this.getNodeParameter('deliberationDate', itemIndex) as string;
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
						const title = this.getNodeParameter('title', itemIndex) as string;
						const description = this.getNodeParameter('ticketDescription', itemIndex) as string;
						const wrapHtml = this.getNodeParameter('wrapHtml', itemIndex, false) as boolean;
						const priority = this.getNodeParameter('priority', itemIndex) as number;
						const miniDbItem = this.getNodeParameter('miniDbItem', itemIndex) as string;
						const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;

						const response = await callMethod('addHelpdeskTicket', {
							title,
							description: wrapHtml ? plaintextToHtml(description) : description,
							priority,
							miniDbItem,
							userIdentifier,
						});
						returnData.push({
							json:
								typeof response === 'object' && response !== null
									? (response as IDataObject)
									: ({ success: response } as IDataObject),
							pairedItem: { item: itemIndex },
						});

						continue;
					}
				}

				if (resource === 'message' && operation === 'sendMsg') {
					const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
					const title = this.getNodeParameter('title', itemIndex) as string;
					const body = this.getNodeParameter('messageBody', itemIndex) as string;
					const wrapHtml = this.getNodeParameter('wrapHtml', itemIndex, false) as boolean;
					const senderIdentifier = this.getNodeParameter('senderIdentifier', itemIndex) as string;
					const coaccount = this.getNodeParameter('coaccount', itemIndex, 0) as number;
					const copyToLVS = this.getNodeParameter('copyToLVS', itemIndex, false) as boolean;
					const attachmentCollection = this.getNodeParameter('attachments', itemIndex, {}) as IDataObject;

					const payload: Record<string, string | number | boolean> = {
						userIdentifier,
						title,
						body: wrapHtml ? plaintextToHtml(body) : body,
						senderIdentifier,
						coaccount,
						copyToLVS,
					};

					const attachmentValues = (attachmentCollection.attachment ?? []) as IDataObject[];
					const cleanedAttachments = attachmentValues.filter(
						(entry) => entry?.filename && entry?.filedata,
					);

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
					const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
					const signature = this.getNodeParameter('signature', itemIndex) as string;
					const accountType = this.getNodeParameter('signatureAccountType', itemIndex) as number;
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

				throw new NodeOperationError(
					this.getNode(),
					`Unsupported resource "${resource}" or operation "${operation}"`,
					{ itemIndex },
				);
			} catch (error) {
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

				if (error instanceof NodeOperationError) {
					throw error;
				}

				throw new NodeOperationError(this.getNode(), errorMessage, { itemIndex });
			}
		}

		return [returnData];
	}
}
