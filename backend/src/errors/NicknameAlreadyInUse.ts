import { ApiErrorCode } from '@shared/types';
import type { ApiError } from '../types/ApiError';
import { HttpStatus } from '../types/enums/HttpStatus';

export const NicknameAlreadyInUse = (nickname: string): ApiError => ({
	errorCode: ApiErrorCode.NICKNAME_ALREADY_IN_USE,
	httpStatus: HttpStatus.BAD_REQUEST,
	message: `Nickname '${nickname}' is already in use`
});
