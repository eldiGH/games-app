import type { ApiErrorCode } from '@shared/types';
import type { HttpStatus } from './enums/HttpStatus';

export interface ApiError {
	errorCode: ApiErrorCode;
	message: string;
	httpStatus: HttpStatus;
	[x: string | number | symbol]: unknown;
}

export const isApiError = (error: unknown): error is ApiError => {
	const keys: (keyof ApiError)[] = ['errorCode', 'httpStatus', 'message'];

	return keys.every((key) => error && typeof error === 'object' && key in error);
};
