import type { Icon, ICredentialType, INodeProperties } from 'n8n-workflow';

export class SmartSchoolApi implements ICredentialType {
	name = 'smartSchoolApi';

	displayName = 'SmartSchool API';

	icon: Icon = { light: 'file:../icons/smartschool.logo.svg', dark: 'file:../icons/smartschool.logo.dark.svg' };

	documentationUrl = 'https://schoolsync.gitbook.io/smartschool-kit';
	test = {
		request: {
			method: 'POST' as const,
			baseURL: '={{$credentials.apiEndpoint}}',
			url: '',
			headers: {
				'Content-Type': 'text/xml; charset=utf-8',
				SOAPAction: '={{$credentials.apiEndpoint}}#getReferenceField',
			},
			body:
				'<?xml version="1.0" encoding="utf-8"?>' +
				'<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" ' +
				'xmlns:tns="={{$credentials.apiEndpoint}}">' +
				'<soap:Body><tns:getReferenceField>' +
				'<accesscode>{{$credentials.accesscode}}</accesscode>' +
				'</tns:getReferenceField></soap:Body></soap:Envelope>',
			json: false,
		},
	};

	properties: INodeProperties[] = [
		{
			displayName: 'API Endpoint',
			name: 'apiEndpoint',
			type: 'string',
			default: '',
			placeholder: 'https://myschool.smartschool.be/Webservices/V3',
			description: 'Base URL of your SmartSchool API endpoint',
			required: true,
		},
		{
			displayName: 'Access Code',
			name: 'accesscode',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'SmartSchool API access code',
			required: true,
		},
	];
}
