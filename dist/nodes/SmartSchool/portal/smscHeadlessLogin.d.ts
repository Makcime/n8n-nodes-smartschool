export declare function smscHeadlessLogin(creds: {
    domain: string;
    username: string;
    password: string;
    birthdate: string;
    totpSecret?: string;
}): Promise<{
    phpSessId: any;
    userId: string | undefined;
    cookieHeader: string;
}>;
