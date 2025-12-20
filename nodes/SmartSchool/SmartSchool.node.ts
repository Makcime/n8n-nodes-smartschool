import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import { getSmartSchoolClient } from './GenericFunctions';

type SupportedResource = 'group' | 'helpdesk' | 'message' | 'account' | 'parameter';
type SupportedOperation =
	| 'getAllAccounts'
	| 'getAllAccountsExtended'
	| 'getHelpdeskMiniDbItems'
	| 'addHelpdeskTicket'
	| 'sendMsg'
	| 'getUserDetails'
	| 'getUserDetailsByNumber'
	| 'getUserDetailsByUsername'
	| 'getUserDetailsByScannableCode'
	| 'getUserOfficialClass'
	| 'getReferenceField';

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
						resource: ['group'],
						operation: ['getAllAccounts', 'getAllAccountsExtended'],
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
						resource: ['helpdesk', 'message', 'account'],
						operation: [
							'addHelpdeskTicket',
							'sendMsg',
							'getUserDetails',
							'getUserOfficialClass',
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
