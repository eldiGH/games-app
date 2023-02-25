import type WebSocket from 'ws';

export interface WsController {
	wss: WebSocket.Server;
	path: string;
	hooks: WsHook[];
}

export interface WsHook {
	type: string;
	handler: WsHandler;
}

export type WsHandler<T = Record<string, unknown>> = (data: T) => void;
