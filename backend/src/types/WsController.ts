import type { RawData } from 'ws';
import type WebSocket from 'ws';

export interface WsController {
	wss: WebSocket.Server;
	path: string;
	messages: WsMessage[];
}

export interface WsMessage {
	name: string;
	handler: WsMessageHandler;
}

export type WsMessageHandler = (data: RawData, isBinary: boolean) => void;
