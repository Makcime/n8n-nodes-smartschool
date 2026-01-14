import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { XMLParser } from 'fast-xml-parser';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import { safeFetch } from './portal/safeFetch';
import { smscHeadlessLogin } from './portal/smscHeadlessLogin';

type PortalOperation =
	| 'generateSession'
	| 'validateSession'
	| 'fetchPlanner'
	| 'getPlannerElements'
	| 'getPlannerCalendarsAccessible'
	| 'getPlannerCalendarsReadable'
	| 'uploadTimetable'
	| 'fetchEmailInbox'
	| 'fetchEmail'
	| 'fetchResults'
	| 'getPortalCourses'
	| 'updatePortalCourseScheduleCodes'
	| 'getGradebookTemplates'
	| 'getGradebookConfig'
	| 'getGradebookPupilTree'
	| 'getGradebookCategories'
	| 'getGradebookCategoryGradesByPupil'
	| 'getGradebookOtherCategoryGradesByGroup'
	| 'getPresenceConfig'
	| 'getPresenceClass'
	| 'getPresenceDayAllClasses';

export class SmartSchoolPortal implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SmartSchool Portal',
		name: 'smartSchoolPortal',
		icon: { light: 'file:smartschool.logo.svg', dark: 'file:smartschool.logo.dark.svg' },
		group: ['transform'],
		version: 1,
		description: 'Interact with SmartSchool portal endpoints',
		defaults: { name: 'SmartSchool Portal' },
		subtitle: '={{$parameter.operation}}',
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
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
						name: 'Upload Timetable',
						value: 'uploadTimetable',
						description: 'Upload a timetable file and start the import',
						action: 'Upload timetable',
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
				description:
					'Optional cookie header from Generate Session (use when portal endpoints require more than PHPSESSID)',
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
				displayName: 'Classes (comma-separated)',
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
				displayName: 'Types (comma-separated)',
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
				displayName: 'Fields (comma-separated)',
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
				description: 'Delete planned elements that are not present in the uploaded file',
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
				description: 'Send a message to students when their planned elements change',
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
				description: 'Send a message to teachers when their planned elements change',
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

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			const operation = this.getNodeParameter('operation', itemIndex) as PortalOperation;
			const sessionCreds = await this.getCredentials('SmartschoolPortalApi');
			const normalizedDomain = (sessionCreds.domain as string)
				.replace(/^https?:\/\//, '')
				.replace(/\/+$/, '');

			const parsePortalJson = async (response: Response, label: string) => {
				try {
					return await response.json();
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`Failed to parse ${label} response to JSON, check your PHPSESSID and/or User ID: ${(error as Error).message}`,
						{ itemIndex },
					);
				}
			};
			const parsePortalJsonParam = (value: string, label: string) => {
				const trimmed = value.trim();
				if (!trimmed) {
					throw new NodeOperationError(this.getNode(), `${label} is required`, { itemIndex });
				}
				try {
					return JSON.stringify(JSON.parse(trimmed));
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`Invalid JSON for ${label}: ${(error as Error).message}`,
						{ itemIndex },
					);
				}
			};
			const parseScheduleCodes = (value: unknown) => {
				if (value === null || value === undefined) {
					return [] as string[];
				}
				const trimmed = String(value).trim();
				if (!trimmed) {
					return [] as string[];
				}
				if (trimmed.startsWith('[')) {
					try {
						const parsed = JSON.parse(trimmed);
						if (!Array.isArray(parsed)) {
							throw new Error('Expected an array of schedule codes');
						}
						return parsed.map((entry) => String(entry)).filter((entry) => entry.length > 0);
					} catch (error) {
						throw new NodeOperationError(
							this.getNode(),
							`Invalid Schedule Codes JSON: ${(error as Error).message}`,
							{ itemIndex },
						);
					}
				}
				return trimmed
					.split(/[\s,;]+/)
					.map((entry) => entry.trim())
					.filter(Boolean);
			};
			const parseDelimitedList = (value: string) =>
				value
					.split(/[\s,;]+/)
					.map((entry) => entry.trim())
					.filter(Boolean);
			const parseOptionalJsonObject = (value: string, label: string) => {
				const trimmed = value.trim();
				if (!trimmed) {
					return {};
				}
				try {
					const parsed = JSON.parse(trimmed);
					if (parsed === null || Array.isArray(parsed) || typeof parsed !== 'object') {
						throw new Error('Expected a JSON object');
					}
					return parsed as Record<string, unknown>;
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`Invalid JSON for ${label}: ${(error as Error).message}`,
						{ itemIndex },
					);
				}
			};
			const portalCookieHeader = this.getNodeParameter(
				'portalCookieHeader',
				itemIndex,
				'',
			) as string;
			const buildCookieHeader = (phpSessId: string) => {
				const trimmed = portalCookieHeader.trim();
				return trimmed.length > 0 ? trimmed : `PHPSESSID=${phpSessId}`;
			};
			const postGradebook = async (
				endpoint: string,
				params: Record<string, string>,
				phpSessId: string,
			) => {
				const body = Object.entries(params)
					.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
					.join('&');
				const response = await safeFetch.call(
					this,
					`https://${normalizedDomain}/Gradebook/Main/${endpoint}`,
					{
						method: 'POST',
						headers: {
							'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
							cookie: buildCookieHeader(phpSessId),
						},
						body,
					},
				);
				return await parsePortalJson(response, `gradebook ${endpoint}`);
			};

			if (operation === 'generateSession') {
				const result = await smscHeadlessLogin(sessionCreds as {
					domain: string;
					username: string;
					password: string;
					birthdate: string;
					totpSecret?: string;
				});
				const userIdRaw = result.userId ? String(result.userId) : '';
				let userIdNumeric: number | null = null;
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
				const phpSessId = this.getNodeParameter('phpSessId', itemIndex) as string;
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
				const phpSessId = this.getNodeParameter('phpSessId', itemIndex) as string;
				const userId = this.getNodeParameter('userId', itemIndex) as string;
				const fromDate = this.getNodeParameter('fromDate', itemIndex) as string;
				const toDate = this.getNodeParameter('toDate', itemIndex) as string;
				const types = (
					this.getNodeParameter('types', itemIndex) as string[] | string
				).toString();

				const plannerUrl = `https://${normalizedDomain}/planner/api/v1/planned-elements/user/${userId}?from=${fromDate.split('T')[0]}&to=${toDate.split('T')[0]}&types=${types}`;
				const response = await safeFetch.call(this, plannerUrl, {
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
				const phpSessId = this.getNodeParameter('phpSessId', itemIndex) as string;
				const userIdParam = this.getNodeParameter('userId', itemIndex, '') as string;
				const inputUserId =
					(this.getInputData()[itemIndex]?.json?.userId as string | undefined) ?? '';
				const userId = userIdParam || inputUserId;
				if (!userId) {
					throw new NodeOperationError(
						this.getNode(),
						'User ID is required for planner elements. Provide it in the node parameters or pass it from Generate Session.',
						{ itemIndex },
					);
				}
				const fromDate = this.getNodeParameter('fromDate', itemIndex) as string;
				const toDate = this.getNodeParameter('toDate', itemIndex) as string;

				const plannerUrl = `https://${normalizedDomain}/planner/api/v1/planned-elements/user/${userId}?from=${fromDate}&to=${toDate}`;
				const response = await safeFetch.call(this, plannerUrl, {
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
				const phpSessId = this.getNodeParameter('phpSessId', itemIndex) as string;
				const response = await safeFetch.call(
					this,
					`https://${normalizedDomain}/planner/api/v1/calendars/accessible-platform-calendars`,
					{
						headers: {
							cookie: buildCookieHeader(phpSessId),
						},
					},
				);
				const data = await parsePortalJson(response, 'planner calendars accessible');
				returnData.push({
					json: { plannerCalendarsAccessible: data },
					pairedItem: { item: itemIndex },
				});
				continue;
			}

			if (operation === 'getPlannerCalendarsReadable') {
				const phpSessId = this.getNodeParameter('phpSessId', itemIndex) as string;
				const response = await safeFetch.call(
					this,
					`https://${normalizedDomain}/planner/api/v1/calendars/readable-platform-calendars`,
					{
						headers: {
							cookie: buildCookieHeader(phpSessId),
						},
					},
				);
				const data = await parsePortalJson(response, 'planner calendars readable');
				returnData.push({
					json: { plannerCalendarsReadable: data },
					pairedItem: { item: itemIndex },
				});
				continue;
			}

			if (operation === 'uploadTimetable') {
				const phpSessId = this.getNodeParameter('phpSessId', itemIndex) as string;
				const binaryProperty = this.getNodeParameter(
					'timetableBinaryProperty',
					itemIndex,
				) as string;
				const binary = this.getInputData()[itemIndex]?.binary?.[binaryProperty];
				if (!binary) {
					throw new NodeOperationError(
						this.getNode(),
						`Binary property "${binaryProperty}" is missing. Attach the timetable file as binary data.`,
						{ itemIndex },
					);
				}

				const buffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryProperty);
				const fileName = binary.fileName || 'timetable.txt';
				const mimeType = binary.mimeType || 'text/plain';

				const uploadDirResponse = await safeFetch.call(
					this,
					`https://${normalizedDomain}/upload/api/v1/get-upload-directory`,
					{
						headers: {
							accept: 'application/json',
							cookie: buildCookieHeader(phpSessId),
						},
					},
				);
				const uploadDirData = await parsePortalJson(
					uploadDirResponse,
					'get upload directory',
				);
				const uploadDir = (uploadDirData as IDataObject).uploadDir as string;
				if (!uploadDir) {
					throw new NodeOperationError(
						this.getNode(),
						'Upload directory was not returned by Smartschool.',
						{ itemIndex },
					);
				}

				const formData = new FormData();
				formData.append(
					'file',
					new Blob([new Uint8Array(buffer)], { type: mimeType }),
					fileName,
				);

				await safeFetch.call(this, `https://${normalizedDomain}/Upload/Upload/Index`, {
					method: 'POST',
					headers: {
						cookie: buildCookieHeader(phpSessId),
						origin: `https://${normalizedDomain}`,
						referer: `https://${normalizedDomain}/`,
						'x-requested-with': 'XMLHttpRequest',
					},
					body: formData,
				});

				const filesResponse = await safeFetch.call(
					this,
					`https://${normalizedDomain}/upload/api/v1/files/${uploadDir}`,
					{
						headers: {
							accept: 'application/json',
							cookie: buildCookieHeader(phpSessId),
						},
					},
				);
				const filesData = (await parsePortalJson(
					filesResponse,
					'uploaded files',
				)) as IDataObject[];

				const capabilitiesResponse = await safeFetch.call(
					this,
					`https://${normalizedDomain}/planner/api/v1/schedule/upload`,
					{
						method: 'POST',
						headers: {
							accept: 'application/json',
							'content-type': 'application/json',
							cookie: buildCookieHeader(phpSessId),
							origin: `https://${normalizedDomain}`,
						},
						body: JSON.stringify({ uploadDir }),
					},
				);
				const capabilitiesData = (await parsePortalJson(
					capabilitiesResponse,
					'schedule upload',
				)) as IDataObject;

				const dateFromRaw = this.getNodeParameter(
					'timetableFromDate',
					itemIndex,
				) as string;
				const dateToRaw = this.getNodeParameter('timetableToDate', itemIndex) as string;
				const classesRaw = this.getNodeParameter(
					'timetableClasses',
					itemIndex,
				) as string;
				const teachersRaw = this.getNodeParameter(
					'timetableTeachers',
					itemIndex,
				) as string;
				const typesRaw = this.getNodeParameter('timetableTypes', itemIndex) as string;
				const fieldsRaw = this.getNodeParameter('timetableFields', itemIndex) as string;
				const deletePlannedElements = this.getNodeParameter(
					'timetableDeletePlannedElements',
					itemIndex,
				) as boolean;
				const notifyStudents = this.getNodeParameter(
					'timetableNotifyStudents',
					itemIndex,
				) as boolean;
				const notifyTeachers = this.getNodeParameter(
					'timetableNotifyTeachers',
					itemIndex,
				) as boolean;

				const classes = parseDelimitedList(classesRaw).map((value) =>
					/^\d+$/.test(value) ? Number(value) : value,
				);
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

				const validateResponse = await safeFetch.call(
					this,
					`https://${normalizedDomain}/planner/api/v1/schedule/validate`,
					{
						method: 'POST',
						headers: {
							accept: 'application/json',
							'content-type': 'application/json',
							cookie: buildCookieHeader(phpSessId),
							origin: `https://${normalizedDomain}`,
						},
						body: JSON.stringify({ options, uploadDir }),
					},
				);
				const validateData = (await parsePortalJson(
					validateResponse,
					'schedule validate',
				)) as IDataObject;
				const unknownTeachers = (validateData.unknownTeachers ?? []) as IDataObject[];
				if (unknownTeachers.length > 0) {
					const list = unknownTeachers
						.map((entry) => entry.value)
						.filter(Boolean)
						.slice(0, 10)
						.join(', ');
					throw new NodeOperationError(
						this.getNode(),
						`Timetable validation failed: unknown teachers (${list}).`,
						{ itemIndex },
					);
				}
				if (validateData.scheduleCouldNotBeValidated) {
					throw new NodeOperationError(
						this.getNode(),
						'Timetable validation failed: schedule could not be validated.',
						{ itemIndex },
					);
				}

				const startResponse = await safeFetch.call(
					this,
					`https://${normalizedDomain}/planner/api/v1/schedule/start`,
					{
						method: 'POST',
						headers: {
							accept: 'application/json',
							'content-type': 'application/json',
							cookie: buildCookieHeader(phpSessId),
							origin: `https://${normalizedDomain}`,
						},
						body: JSON.stringify({ options, uploadDir }),
					},
				);
				let startBody: IDataObject = {};
				try {
					const parsed = await startResponse.json();
					if (parsed && typeof parsed === 'object') {
						startBody = parsed as IDataObject;
					}
				} catch (_) {
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
				const phpSessId = this.getNodeParameter('phpSessId', itemIndex) as string;
				const amountOfResults = this.getNodeParameter('amountOfResults', itemIndex) as number;
				const resultsUrl = `https://${normalizedDomain}/results/api/v1/evaluations/?pageNumber=1&itemsOnPage=${amountOfResults}`;
				const response = await safeFetch.call(this, resultsUrl, {
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
				const phpSessId = this.getNodeParameter('phpSessId', itemIndex) as string;
				const coursesUrl = `https://${normalizedDomain}/course-list/api/v1/courses`;
				const response = await safeFetch.call(this, coursesUrl, {
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
				const phpSessId = this.getNodeParameter('phpSessId', itemIndex) as string;
				const courseId = this.getNodeParameter('portalCourseId', itemIndex) as string;
				const scheduleCodesRaw = this.getNodeParameter(
					'portalScheduleCodes',
					itemIndex,
				) as string;
				const scheduleCodes = parseScheduleCodes(scheduleCodesRaw);
				const updateUrl = `https://${normalizedDomain}/course-list/api/v1/courses/${courseId}/change-schedule-codes`;
				const response = await safeFetch.call(this, updateUrl, {
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

			if (
				operation === 'getGradebookTemplates' ||
				operation === 'getGradebookConfig' ||
				operation === 'getGradebookPupilTree' ||
				operation === 'getGradebookCategories' ||
				operation === 'getGradebookCategoryGradesByPupil' ||
				operation === 'getGradebookOtherCategoryGradesByGroup'
			) {
				const phpSessId = this.getNodeParameter('phpSessId', itemIndex) as string;
				const contextRaw = this.getNodeParameter('gradebookContext', itemIndex) as string;
				const context = parsePortalJsonParam(contextRaw, 'Gradebook Context');

				let data: unknown;
				if (operation === 'getGradebookTemplates') {
					data = await postGradebook('getTemplateList', { context }, phpSessId);
				} else if (operation === 'getGradebookConfig') {
					const templateRaw = this.getNodeParameter('gradebookTemplate', itemIndex) as string;
					const template = parsePortalJsonParam(templateRaw, 'Gradebook Template');
					data = await postGradebook('getGradebookConfig', { context, template }, phpSessId);
				} else if (operation === 'getGradebookPupilTree') {
					data = await postGradebook('getPupilTree', { context }, phpSessId);
				} else if (operation === 'getGradebookCategories') {
					const templateRaw = this.getNodeParameter('gradebookTemplate', itemIndex) as string;
					const template = parsePortalJsonParam(templateRaw, 'Gradebook Template');
					data = await postGradebook('getCategoriesList', { context, template }, phpSessId);
				} else if (operation === 'getGradebookCategoryGradesByPupil') {
					const templateRaw = this.getNodeParameter('gradebookTemplate', itemIndex) as string;
					const pupilRaw = this.getNodeParameter('gradebookPupil', itemIndex) as string;
					const template = parsePortalJsonParam(templateRaw, 'Gradebook Template');
					const pupil = parsePortalJsonParam(pupilRaw, 'Gradebook Pupil');
					data = await postGradebook(
						'getCategoryGradesByPupil',
						{
							context,
							template,
							pupil,
						},
						phpSessId,
					);
				} else {
					const groupRaw = this.getNodeParameter('gradebookGroup', itemIndex) as string;
					const group = parsePortalJsonParam(groupRaw, 'Gradebook Group');
					const classValue = this.getNodeParameter('gradebookClass', itemIndex) as string;
					data = await postGradebook(
						'getOtherCategoryGradesByGroup',
						{
							context,
							class: classValue ?? '',
							group,
						},
						phpSessId,
					);
				}

				const gradebookData = data as IDataObject | IDataObject[];
				returnData.push({
					json: { gradebookData },
					pairedItem: { item: itemIndex },
				});
				continue;
			}

			if (
				operation === 'getPresenceConfig' ||
				operation === 'getPresenceClass' ||
				operation === 'getPresenceDayAllClasses'
			) {
				const phpSessId = this.getNodeParameter('phpSessId', itemIndex) as string;
				const presenceGroupId = this.getNodeParameter('presenceGroupId', itemIndex) as number;
				const presenceDate = this.getNodeParameter('presenceDate', itemIndex) as string;
				const presenceUserId = this.getNodeParameter('presenceUserId', itemIndex) as number;
				const presenceDateOnly = presenceDate.split('T')[0];
				const tokenResponse = await safeFetch.call(
					this,
					`https://${normalizedDomain}/Topnav/Node/getToken`,
					{
						method: 'POST',
						headers: {
							accept: '*/*',
							'content-type': 'text/plain',
							cookie: buildCookieHeader(phpSessId),
							'x-requested-with': 'XMLHttpRequest',
						},
						body: JSON.stringify({ userID: presenceUserId }),
					},
				);
				const presenceToken = (await tokenResponse.text()).trim();
				const presenceTokenHeaders = {
					'x-smsc-token': presenceToken,
					'smsc-token': presenceToken,
					'x-token': presenceToken,
				};

				const fetchPresenceConfig = async () => {
					const response = await safeFetch.call(
						this,
						`https://${normalizedDomain}/Presence/Main/getConfig`,
						{
							method: 'POST',
							headers: {
								accept: 'application/json, text/javascript, */*; q=0.01',
								'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
								cookie: buildCookieHeader(phpSessId),
								'x-requested-with': 'XMLHttpRequest',
								...presenceTokenHeaders,
							},
							body: `route_controller=photoview&route_subcontroller=&groupID=${encodeURIComponent(
								String(presenceGroupId),
							)}&userID=${encodeURIComponent(
								String(presenceUserId),
							)}&date=${encodeURIComponent(presenceDateOnly)}&token=${encodeURIComponent(
								presenceToken,
							)}`,
						},
					);
					const data = await parsePortalJson(response, 'presence config');
					const config = data as IDataObject;
					const main = (config.main ?? {}) as IDataObject;
					const allowedClasses = (main.allowedClasses ?? []) as IDataObject[];
					const hourBlocks = (main.hourBlocks ?? []) as IDataObject[];
					return { config, allowedClasses, hourBlocks };
				};

				const fetchPresenceClass = async (classId: number, hourId: number) => {
					const response = await safeFetch.call(
						this,
						`https://${normalizedDomain}/Presence/Class/getClass`,
						{
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
								`official=${(this.getNodeParameter('presenceOfficial', itemIndex) as boolean)
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
						},
					);
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
					const presenceHourId = this.getNodeParameter('presenceHourId', itemIndex) as number;
					const data = await fetchPresenceClass(presenceGroupId, presenceHourId);
					returnData.push({
						json: { presenceClass: data },
						pairedItem: { item: itemIndex },
					});
					continue;
				}

				const { allowedClasses, hourBlocks } = await fetchPresenceConfig();
				const presenceOnlyActiveHours = this.getNodeParameter(
					'presenceOnlyActiveHours',
					itemIndex,
				) as boolean;
				const presenceClassIdsRaw = this.getNodeParameter(
					'presenceClassIds',
					itemIndex,
				) as string;
				const classIdFilter = presenceClassIdsRaw
					.split(/[\s,]+/)
					.map((value) => value.trim())
					.filter(Boolean)
					.map((value) => Number(value))
					.filter((value) => !Number.isNaN(value));
				const classesToFetch =
					classIdFilter.length > 0
						? allowedClasses.filter((entry) =>
								classIdFilter.includes(entry.groupID as number),
							)
						: allowedClasses;
				const hoursToFetch = presenceOnlyActiveHours
					? hourBlocks.filter((hour) => Boolean(hour.active))
					: hourBlocks;

				const rows: IDataObject[] = [];
				for (const classEntry of classesToFetch) {
					const classId = classEntry.groupID as number;
					const className = classEntry.name as string;
					for (const hourEntry of hoursToFetch) {
						const hourId = hourEntry.hourID as number;
						const hourTitle = hourEntry.title as string;
						const classData = (await fetchPresenceClass(classId, hourId)) as IDataObject;
						const pupils = (classData.pupils ?? []) as IDataObject[];
						for (const pupil of pupils) {
							const presences = (pupil.presence ?? []) as IDataObject[];
							for (const presence of presences) {
								const code = (presence.code ?? {}) as IDataObject;
								rows.push({
									classId,
									className,
									hourId,
									hourTitle,
									presenceDate: presence.presenceDate ?? presenceDateOnly,
									pupilId: pupil.userID ?? pupil.userId,
									pupilName: pupil.name,
									pupilSurname: pupil.surname,
									pupilFullName: pupil.nameBIN ?? pupil.name,
									presenceId: presence.presenceID,
									codeId: presence.codeID ?? code.codeID,
									codeName: code.name,
									codeColor: code.color,
									isOfficial: code.isOfficial ?? presence.isOfficial,
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
				const phpSessId = this.getNodeParameter('phpSessId', itemIndex) as string;
				const mailbox = this.getNodeParameter('mailbox', itemIndex) as string;
				const parser = new XMLParser({
					ignoreAttributes: false,
					trimValues: true,
					parseTagValue: true,
					htmlEntities: true,
				});

				const fetchMailWithCommand = async (commandXml: string) => {
					const response = await safeFetch.call(
						this,
						`https://${normalizedDomain}/?module=Messages&file=dispatcher`,
						{
							headers: {
								'content-type': 'application/x-www-form-urlencoded',
								cookie: buildCookieHeader(phpSessId),
							},
							body: `command=${encodeURIComponent(commandXml)}`,
							method: 'POST',
						},
					);

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

					const mails: IDataObject[] = [];
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

				const mailId = this.getNodeParameter('mailId', itemIndex) as string;
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
				let mail: IDataObject | null = null;
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

			throw new NodeOperationError(
				this.getNode(),
				`Unsupported portal operation "${operation}"`,
				{ itemIndex },
			);
		}

		return [returnData];
	}
}
