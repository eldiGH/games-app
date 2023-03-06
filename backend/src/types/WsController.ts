import type { Player } from '@prisma/client';
import type { WsMessage, WsMessageType } from '@shared/types';
import type { Server } from 'ws';

export interface WsController {
	wss: Server;
	path: string;
	hooks: WsHook[];
}

export interface WsHook {
	type: string;
	handler: WsHandler;
}

export type WsHandler<T = Record<string, unknown> | undefined> = (
	socket: WsSocket,
	data: T
) => void;

export type WsSendHandler = <T extends WsMessageType>(type: T, data: WsMessage<T>['data']) => void;

export interface WsSocket {
	send: WsSendHandler;
	player: Player;
}
