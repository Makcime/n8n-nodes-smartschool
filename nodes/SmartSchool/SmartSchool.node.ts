import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import { getSmartSchoolClient } from './GenericFunctions';

type SupportedResource = 'group' | 'helpdesk' | 'message' | 'account' | 'parameter' | 'absence';
type SupportedOperation =
	| 'getAllAccounts'
	| 'getAllAccountsExtended'
	| 'getAllGroupsAndClasses'
	| 'getClassList'
	| 'getClassListJson'
	| 'getClassTeachers'
	| 'getHelpdeskMiniDbItems'
	| 'addHelpdeskTicket'
	| 'sendMsg'
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
	| 'savePassword';

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
						resource: ['helpdesk', 'message', 'account', 'absence'],
						operation: [
							'addHelpdeskTicket',
							'sendMsg',
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
				options: [
					{ name: 'Active (actief)', value: 'actief' },
					{ name: 'Active (active)', value: 'active' },
					{ name: 'Active (enabled)', value: 'enabled' },
					{ name: 'Inactive (inactief)', value: 'inactief' },
					{ name: 'Inactive (inactive)', value: 'inactive' },
					{ name: 'Inactive (disabled)', value: 'disabled' },
					{ name: 'Administrative (administrative)', value: 'administrative' },
					{ name: 'Administrative (administratief)', value: 'administratief' },
				],
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
						operation: ['changePasswordAtNextLogin', 'forcePasswordReset', 'removeCoAccount', 'savePassword'],
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
						resource: ['account'],
						operation: ['delUser'],
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

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const client = await getSmartSchoolClient.call(this);
		const credentials = (await this.getCredentials('smartSchoolApi')) as IDataObject;
		const accesscode = credentials.accesscode as string;

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

				returnData.push({
					json: (data ?? {}) as IDataObject,
					pairedItem: { item: itemIndex },
				});
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
					const params = {
						accesscode,
						code,
						recursive: recursiveFlag,
					};

					const response =
						operation === 'getAllAccounts'
							? await client.getAllAccounts(params)
							: await client.getAllAccountsExtended(params);

					if (Array.isArray(response)) {
						for (const entry of response) {
							returnData.push({
								json: entry as IDataObject,
								pairedItem: { item: itemIndex },
							});
						}
					} else {
						returnData.push({
							json: response as IDataObject,
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
						const response = (await client.getClassList()) as string;
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
						const getAllOwners = this.getNodeParameter('getAllOwners', itemIndex, false) as boolean;
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
						const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
						const response = await client.getUserDetails({
							accesscode,
							userIdentifier,
						});
						normalizeAndPush(response);
						continue;
					}

					if (operation === 'getUserDetailsByNumber') {
						const number = this.getNodeParameter('internalNumber', itemIndex) as string;
						const response = await client.getUserDetailsByNumber({
							accesscode,
							number,
						});
						normalizeAndPush(response);
						continue;
					}

					if (operation === 'getUserDetailsByUsername') {
						const username = this.getNodeParameter('accountUsername', itemIndex) as string;
						const response = await client.getUserDetailsByUsername({
							accesscode,
							username,
						});
						normalizeAndPush(response);
						continue;
					}

					if (operation === 'getUserDetailsByScannableCode') {
						const scannableCode = this.getNodeParameter('scannableCode', itemIndex) as string;
						const response = await client.getUserDetailsByScannableCode({
							accesscode,
							scannableCode,
						});
						normalizeAndPush(response);
						continue;
					}

					if (operation === 'getUserOfficialClass') {
						const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
						const date =
							(this.getNodeParameter('officialClassDate', itemIndex, '') as string) ||
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
						const profile = this.getNodeParameter('userProfile', itemIndex, {}) as IDataObject;
						const required = (profile.required ?? {}) as IDataObject;
						const optional = (profile.optional ?? {}) as IDataObject;
						const custom = (profile.custom ?? {}) as IDataObject;
						const customFieldsRaw = (custom.customFields ?? '') as string;

						let customFields: IDataObject = {};
						if (customFieldsRaw) {
							try {
								customFields = JSON.parse(customFieldsRaw) as IDataObject;
							} catch (error) {
								throw new NodeOperationError(
									this.getNode(),
									'Custom fields must be valid JSON.',
									{ itemIndex },
								);
							}
						}

						const payload: IDataObject = {
							accesscode,
							username: required.username as string,
							name: required.name as string,
							surname: required.surname as string,
							basisrol: required.basisrol as string,
							...optional,
							...customFields,
						};

						const response = await client.saveUser(payload as never);
						returnData.push({
							json: { success: response },
							pairedItem: { item: itemIndex },
						});
						continue;
					}

					if (operation === 'delUser') {
						const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
						const officialDate = this.getNodeParameter('officialDate', itemIndex, '') as string;
						const payload: IDataObject = {
							accesscode,
							userIdentifier,
						};
						if (officialDate) {
							payload.officialDate = officialDate;
						}
						const response = await client.delUser(payload as never);
						returnData.push({
							json: { success: response },
							pairedItem: { item: itemIndex },
						});
						continue;
					}

					if (operation === 'setAccountStatus') {
						const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
						const accountStatus = this.getNodeParameter('accountStatus', itemIndex) as string;
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
						const internNumber = this.getNodeParameter('internalNumber', itemIndex) as string;
						const newUsername = this.getNodeParameter('newUsername', itemIndex) as string;
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
						const username = this.getNodeParameter('accountUsername', itemIndex) as string;
						const newInternNumber = this.getNodeParameter('newInternNumber', itemIndex) as string;
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
						const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
						const accountType = this.getNodeParameter('accountType', itemIndex) as number;
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
						const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
						const accountType = this.getNodeParameter('accountType', itemIndex) as number;
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
						const oldInum = this.getNodeParameter('oldInum', itemIndex) as string;
						const newInum = this.getNodeParameter('newInum', itemIndex) as string;
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
						const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
						const paramName = this.getNodeParameter('paramName', itemIndex) as string;
						const paramValue = this.getNodeParameter('paramValue', itemIndex) as string;
						const response = await client.saveUserParameter({
							accesscode,
							userIdentifier,
							paramName: paramName as never,
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
						const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
						const accountType = this.getNodeParameter('accountType', itemIndex) as number;
						const password = this.getNodeParameter('password', itemIndex) as string;
						const mustChangePassword = this.getNodeParameter('mustChangePassword', itemIndex) as boolean;
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
				}

				if (resource === 'absence') {
					if (operation === 'getAbsents' || operation === 'getAbsentsWithAlias') {
						const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
						const schoolYear = this.getNodeParameter('schoolYear', itemIndex) as string;
						const response =
							operation === 'getAbsents'
								? await client.getAbsents({ accesscode, userIdentifier, schoolYear })
								: await client.getAbsentsWithAlias({ accesscode, userIdentifier, schoolYear });
						normalizeAndPush(response);
						continue;
					}

					if (operation === 'getAbsentsByDate') {
						const date = this.getNodeParameter('absenceDate', itemIndex) as string;
						const response = await client.getAbsentsByDate({ accesscode, date });
						normalizeAndPush(response);
						continue;
					}

					if (operation === 'getAbsentsWithAliasByDate') {
						const date = this.getNodeParameter('absenceDate', itemIndex) as string;
						const response = await client.getAbsentsWithAliasByDate({ accesscode, date });
						normalizeAndPush(response);
						continue;
					}

					if (operation === 'getAbsentsWithInternalNumberByDate') {
						const date = this.getNodeParameter('absenceDate', itemIndex) as string;
						const response = await client.getAbsentsWithInternalNumberByDate({ accesscode, date });
						normalizeAndPush(response);
						continue;
					}

					if (operation === 'getAbsentsWithUsernameByDate') {
						const date = this.getNodeParameter('absenceDate', itemIndex) as string;
						const response = await client.getAbsentsWithUsernameByDate({ accesscode, date });
						normalizeAndPush(response);
						continue;
					}

					if (operation === 'getAbsentsByDateAndGroup') {
						const date = this.getNodeParameter('absenceDate', itemIndex) as string;
						const code = this.getNodeParameter('code', itemIndex) as string;
						const response = await client.getAbsentsByDateAndGroup({ accesscode, date, code });
						normalizeAndPush(response);
						continue;
					}
				}

				if (resource === 'helpdesk') {
					if (operation === 'getHelpdeskMiniDbItems') {
						const response = (await client.getHelpdeskMiniDbItems()) as unknown;

						if (Array.isArray(response)) {
							for (const entry of response) {
								returnData.push({
									json: entry as unknown as IDataObject,
									pairedItem: { item: itemIndex },
								});
							}
						} else {
							returnData.push({
								json: response as IDataObject,
								pairedItem: { item: itemIndex },
							});
						}

						continue;
					}

					if (operation === 'addHelpdeskTicket') {
						const title = this.getNodeParameter('title', itemIndex) as string;
						const description = this.getNodeParameter('ticketDescription', itemIndex) as string;
						const priority = this.getNodeParameter('priority', itemIndex) as number;
						const miniDbItem = this.getNodeParameter('miniDbItem', itemIndex) as string;
						const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;

						const response = await client.addHelpdeskTicket({
							accesscode,
							title,
							description,
							priority,
							miniDbItem,
							userIdentifier,
						});

						const ticketResult =
							typeof response === 'object' && response !== null
								? (response as IDataObject)
								: ({ success: response } as IDataObject);

						returnData.push({
							json: ticketResult,
							pairedItem: { item: itemIndex },
						});

						continue;
					}
				}

				if (resource === 'message' && operation === 'sendMsg') {
					const userIdentifier = this.getNodeParameter('userIdentifier', itemIndex) as string;
					const title = this.getNodeParameter('title', itemIndex) as string;
					const body = this.getNodeParameter('messageBody', itemIndex) as string;
					const senderIdentifier = this.getNodeParameter('senderIdentifier', itemIndex) as string;
					const coaccount = this.getNodeParameter('coaccount', itemIndex, 0) as number;
					const copyToLVS = this.getNodeParameter('copyToLVS', itemIndex, false) as boolean;
					const attachmentCollection = this.getNodeParameter('attachments', itemIndex, {}) as IDataObject;

					const payload: IDataObject = {
						accesscode,
						userIdentifier,
						title,
						body,
						senderIdentifier,
						coaccount,
						copyToLVS,
					};

					const attachmentValues = (attachmentCollection.attachment ?? []) as IDataObject[];
					const cleanedAttachments = attachmentValues.filter(
						(entry) => entry?.filename && entry?.filedata,
					);

					if (cleanedAttachments.length) {
						payload.attachments = cleanedAttachments;
					}

					const response = await client.sendMsg(payload as never);

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

				throw new NodeOperationError(
					this.getNode(),
					`Unsupported resource "${resource}" or operation "${operation}"`,
					{ itemIndex },
				);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error instanceof Error ? error.message : 'Unknown error',
						},
						pairedItem: { item: itemIndex },
					});
					continue;
				}

				if (error instanceof NodeOperationError) {
					throw error;
				}

				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex });
			}
		}

		return [returnData];
	}
}
