import type { Icon, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class SmartSchoolApi implements ICredentialType {
    name: string;
    displayName: string;
    icon: Icon;
    documentationUrl: string;
    test: {
        request: {
            method: "POST";
            baseURL: string;
            url: string;
            headers: {
                'Content-Type': string;
                SOAPAction: string;
            };
            body: string;
            json: boolean;
        };
    };
    properties: INodeProperties[];
}
