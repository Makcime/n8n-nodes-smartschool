import type { IExecuteFunctions } from 'n8n-workflow';
export declare function getSmartSchoolCredentials(this: IExecuteFunctions): Promise<{
    apiEndpoint: string;
    accesscode: string;
}>;
export declare function callSmartschoolSoap(this: IExecuteFunctions, method: string, params: Record<string, string | number | boolean>): Promise<any>;
