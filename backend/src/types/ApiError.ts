import type { ApiErrorCode } from '@shared/types';
import type { HttpStatus } from './enums/HttpStatus';

export interface ApiError {
	errorCode: ApiErrorCode;
	message: string;
	httpStatus: HttpStatus;
}
