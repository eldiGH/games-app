import { ApiErrorCode, HttpStatus, type ApiError } from '@shared/types';

export const EmailAndNicknameAlreadyInUse = (email: string, nickname: string): ApiError => ({
	errorCode: ApiErrorCode.EMAIL_AND_NICKNAME_ALREADY_IN_USE,
	httpStatus: HttpStatus.BAD_REQUEST,
	message: `Email '${email}' and nickname '${nickname}' are already in use`
});
