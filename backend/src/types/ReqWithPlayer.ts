import type { Player } from '@prisma/client';
import type { IncomingMessage } from 'http';

export interface ReqWithPlayer extends IncomingMessage {
	player: Player;
}
