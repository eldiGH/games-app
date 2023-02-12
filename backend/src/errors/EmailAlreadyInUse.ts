import { ApiErrorCode } from '@shared/types';
import { type ApiError, HttpStatus } from '../types';

export const EmailAlreadyInUse = (email: string): ApiError => ({
	errorCode: ApiErrorCode.EMAIL_ALREADY_IN_USE,
	httpStatus: HttpStatus.BAD_REQUEST,
	message: `Email '${email}' is already in use`
});
