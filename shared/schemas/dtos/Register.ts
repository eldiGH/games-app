import { object, ref, string, type InferType } from 'yup';

export const registerRequestSchema = object({
	email: string().required('errors.email.required').email('errors.email.notValid'),
	password: string()
		.required('errors.password.required')
		.min(3, 'errors.password.min')
		.max(20, 'errors.password.max'),
	nickname: string()
		.required('errors.nickname.required')
		.min(3, 'errors.nickname.min')
		.max(20, 'errors.nickname.max')
});

export const registerRequestFormSchema = registerRequestSchema.shape({
	passwordRepeat: string()
		.required('errors.password.required')
		.oneOf([ref('password')], 'errors.password.differs')
});

export type RegisterRequest = InferType<typeof registerRequestSchema>;
export type RegisterRequestForm = InferType<typeof registerRequestFormSchema>;

export interface RegisterResponse {
	token: string;
}
