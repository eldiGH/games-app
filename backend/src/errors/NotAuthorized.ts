import { ApiErrorCode, HttpStatus, type ApiError } from '@shared/types';

export const NotAuthorized = (): ApiError => ({
	errorCode: ApiErrorCode.NOT_AUTHORIZED,
	httpStatus: HttpStatus.UNAUTHORIZED,
	message: `Not authorized`
});
