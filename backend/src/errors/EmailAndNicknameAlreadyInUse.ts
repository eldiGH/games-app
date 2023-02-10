import { ApiErrorCode } from '@shared/types';
import type { ApiError } from '../types/ApiError';
import { HttpStatus } from '../types/enums/HttpStatus';

export const EmailAndNicknameAlreadyInUse = (email: string, nickname: string): ApiError => ({
	errorCode: ApiErrorCode.EMAIL_AND_NICKNAME_ALREADY_IN_USE,
	httpStatus: HttpStatus.BAD_REQUEST,
	message: `Email "${email}" and nickname "${nickname}" is already in use`
});
