import type { WsSocket } from './WsController';

export interface Room {
	id: string;
	players: WsSocket[];
	spectators: WsSocket[];
}
