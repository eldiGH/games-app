import type { ApiError } from '../../../../shared/types/ApiError';
import type { HttpStatus } from '../../../../shared/types/enums/enums';

export interface ApiClientError {
	status: HttpStatus;
	payload: ApiError;
}

export type ApiClientResponse<T> =
	| {
			data: T;
			error: undefined;
	  }
	| {
			data: undefined;
			error: ApiClientError;
	  };
