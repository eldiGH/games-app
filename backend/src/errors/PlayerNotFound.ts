import { ApiErrorCode, HttpStatus, type ApiError } from '@shared/types';

export const PlayerNotFound = (): ApiError => ({
	errorCode: ApiErrorCode.PLAYER_NOT_FOUND,
	httpStatus: HttpStatus.NOT_FOUND,
	message: `Player not found`
});
