import { object, string, type InferType } from 'yup';

export const registerRequestSchema = object({
	email: string().required().email(),
	password: string().required().min(3).max(20),
	nickname: string().required().min(3).max(20)
});

export type RegisterRequest = InferType<typeof registerRequestSchema>;

export interface RegisterResponse {
	token: string;
}
