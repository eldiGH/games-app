import { object, string, type InferType } from 'yup';

export const loginRequestSchema = object({
	email: string().required('errors.email.required').email('errors.email.notValid'),
	password: string().required('errors.password.required')
});

export type LoginRequest = InferType<typeof loginRequestSchema>;

export interface LoginResponse {
	token: string;
	nickname: string;
}
