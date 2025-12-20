import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports
import { SmartschoolClient } from '@abrianto/smartschool-kit';

export async function getSmartSchoolClient(this: IExecuteFunctions) {
	const credentials = (await this.getCredentials('smartSchoolApi')) as IDataObject;

	if (!credentials?.apiEndpoint || !credentials?.accesscode) {
		throw new NodeOperationError(this.getNode(), 'SmartSchool credentials are not configured correctly.');
	}

	return new SmartschoolClient({
		apiEndpoint: credentials.apiEndpoint as string,
		accesscode: credentials.accesscode as string,
	});
}
