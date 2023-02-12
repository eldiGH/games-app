import { ApiErrorCode } from '@shared/types';
import type { ValueError } from '@sinclair/typebox/errors';
import { type ApiError, HttpStatus } from '../types';

export const ValidationError = (errors: ValueError[]): ApiError => ({
	errorCode: ApiErrorCode.VALIDATION_ERROR,
	httpStatus: HttpStatus.BAD_REQUEST,
	message: `Validation error`,
	errors
});
