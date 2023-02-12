import type { Player } from '@prisma/client';

export interface GetCurrentPlayerResponse {
	nickname: string;
}

export const getCurrentPlayerMapper = ({ nickname }: Player): GetCurrentPlayerResponse => ({
	nickname
});
