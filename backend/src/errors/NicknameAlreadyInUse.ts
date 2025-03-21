import { ApiErrorCode, HttpStatus, type ApiError } from '@shared/types';

export const NicknameAlreadyInUse = (nickname: string): ApiError => ({
	errorCode: ApiErrorCode.NICKNAME_ALREADY_IN_USE,
	httpStatus: HttpStatus.BAD_REQUEST,
	message: `Nickname '${nickname}' is already in use`
});
