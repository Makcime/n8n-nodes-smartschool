import type { IExecuteFunctions } from 'n8n-workflow';
import { SmartschoolClient } from '@abrianto/smartschool-kit';
export declare function getSmartSchoolClient(this: IExecuteFunctions): Promise<SmartschoolClient>;
export declare function callSmartschoolSoap(this: IExecuteFunctions, method: string, params: Record<string, string | number | boolean>): Promise<any>;
