import { ApiErrorCode } from '@shared/types';
import type { ApiError } from '../types/ApiError';
import { HttpStatus } from '../types/enums/HttpStatus';

export const InternalServerError = (): ApiError => ({
	errorCode: ApiErrorCode.INTERNAL_SERVER_ERROR,
	httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
	message: `Internal server error`
});
