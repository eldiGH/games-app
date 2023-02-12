import { ApiErrorCode } from '@shared/types';
import { type ApiError, HttpStatus } from '../types';

export const NotAuthorized = (): ApiError => ({
	errorCode: ApiErrorCode.NOT_AUTHORIZED,
	httpStatus: HttpStatus.UNAUTHORIZED,
	message: `Not authorized`
});
