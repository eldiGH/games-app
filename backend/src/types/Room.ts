import type { WsClient } from './WsController';

export interface Room {
	id: string;
	leader: WsClient;
	players: (WsClient | null)[];
	playersInRoom: WsClient[];
}
