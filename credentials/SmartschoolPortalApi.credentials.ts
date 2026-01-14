import type { Icon, ICredentialType, INodeProperties } from 'n8n-workflow';

export class SmartschoolPortalApi implements ICredentialType {
	name = 'smartschoolPortalApi';
	displayName = 'Smartschool Portal API';
	icon: Icon = { light: 'file:../icons/smartschool.logo.svg', dark: 'file:../icons/smartschool.logo.dark.svg' };
	documentationUrl = 'https://schoolsync.gitbook.io/smartschool-kit';
	properties: INodeProperties[] = [
		{
			displayName: 'Login Service URL',
			name: 'loginServiceUrl',
			type: 'string',
			default: 'http://localhost:8000/api/v1/portal/login/',
			description: 'Endpoint that generates Smartschool portal sessions',
			required: true,
		},
		{
			displayName: 'Login Service API Key',
			name: 'loginServiceApiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'API key for the login service',
			required: true,
		},
		{
			displayName: 'Smartschool Domain',
			placeholder: 'school.smartschool.be',
			name: 'domain',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: 'TOTP Secret (2FA)',
			name: 'totpSecret',
			type: 'string',
			typeOptions: { password: true },
			required: false,
			default: '',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
		{
			displayName: 'Date of Birth (YYYY-MM-DD)',
			placeholder: 'YYYY-MM-DD',
			name: 'birthdate',
			type: 'dateTime',
			required: true,
			default: '',
		},
	];
}
