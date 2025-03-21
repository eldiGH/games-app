import { ApiErrorCode, HttpStatus, type ApiError } from '@shared/types';

export const InternalServerError = (): ApiError => ({
	errorCode: ApiErrorCode.INTERNAL_SERVER_ERROR,
	httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
	message: `Internal server error`
});
