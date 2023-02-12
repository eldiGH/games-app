import { ApiErrorCode } from '@shared/types';
import { HttpStatus, type ApiError } from '../types';

export const PlayerNotFound = (): ApiError => ({
	errorCode: ApiErrorCode.PLAYER_NOT_FOUND,
	httpStatus: HttpStatus.NOT_FOUND,
	message: `Player not found`
});
