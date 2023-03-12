import type { Player } from '@prisma/client';
import type { WsMessage, WsMessageType } from '@shared/types';
import type { Server, WebSocket } from 'ws';

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
	socket: WsClient,
	data: T
) => void;

export type WsSendHandler = <T extends WsMessageType>(type: T, data: WsMessage<T>['data']) => void;

export interface WsClient {
	send: WsSendHandler;
	player: Player;
	socket: WebSocket;
	waitForMessage: <T extends WsMessageType>(type: T) => Promise<WsMessage<T>['data']>;
	onClose: (callback: () => void) => void;
}
