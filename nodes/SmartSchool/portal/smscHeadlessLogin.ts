import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

type SmartSchoolPortalCredentials = {
	domain: string;
	username: string;
	password: string;
	birthdate: string;
	totpSecret?: string;
};

type SmartSchoolPortalSession = {
	phpSessId: string;
	userId?: string;
	cookieHeader: string;
};

export async function smscHeadlessLogin(
	this: IExecuteFunctions,
	creds: SmartSchoolPortalCredentials,
): Promise<SmartSchoolPortalSession> {
	const normalizedDomain = creds.domain.replace(/^https?:\/\//, '').replace(/\/+$/, '');
	throw new NodeOperationError(
		this.getNode(),
		`Automatic portal login is not supported in the community node build. Generate a PHPSESSID manually for ${normalizedDomain} and use Validate Session instead.`,
	);
}
