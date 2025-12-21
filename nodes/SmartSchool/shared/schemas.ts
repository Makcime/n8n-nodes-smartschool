import { z } from 'zod';

export const SmartSchoolCredentialsSchema = z.object({
	apiEndpoint: z.string().url('API Endpoint must be a valid URL'),
	accesscode: z.string().min(1, 'Access code is required'),
});

export type SmartSchoolCredentials = z.infer<typeof SmartSchoolCredentialsSchema>;
