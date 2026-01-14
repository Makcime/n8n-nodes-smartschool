import type { IExecuteFunctions } from 'n8n-workflow';
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
export declare function smscHeadlessLoginLegacy(this: IExecuteFunctions, creds: SmartSchoolPortalCredentials): Promise<SmartSchoolPortalSession>;
export {};
