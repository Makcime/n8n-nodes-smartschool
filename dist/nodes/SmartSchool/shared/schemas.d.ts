import { z } from 'zod';
export declare const SmartSchoolCredentialsSchema: z.ZodObject<{
    apiEndpoint: z.ZodString;
    accesscode: z.ZodString;
}, z.core.$strip>;
export type SmartSchoolCredentials = z.infer<typeof SmartSchoolCredentialsSchema>;
