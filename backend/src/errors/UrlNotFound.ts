import { ApiErrorCode } from '@shared/types';
import type { ApiError } from '../types/ApiError';
import { HttpStatus } from '../types/enums/HttpStatus';

export const UrlNotFound = (url: string): ApiError => ({
	errorCode: ApiErrorCode.URL_NOT_FOUND,
	httpStatus: HttpStatus.NOT_FOUND,
	message: `Url '${url}' not found`
});
