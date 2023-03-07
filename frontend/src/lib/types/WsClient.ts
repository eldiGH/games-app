import type { WsMessage, WsMessageType } from '@shared/types';

export type WsConnect = () => Promise<{
	socket: WebSocket;
	send: <T extends WsMessageType>(type: T, data: WsMessage<T>['data']) => void;
}>;

export interface WsClient {
	connect: WsConnect;
}
