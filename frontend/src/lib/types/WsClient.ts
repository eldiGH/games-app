import type { WsMessage, WsMessageType } from '@shared/types';

export type WsConnectedBase<S> = {
	socket: WebSocket;
	send: <T extends WsMessageType>(type: T, data: WsMessage<T>['data']) => void;
	waitForMessage: <T extends WsMessageType>(
		type: T,
		waitTime?: number
	) => Promise<WsMessage<T>['data']>;
	addMessageListener: <T extends WsMessageType>(type: T, callback: WsMessageListener<T>) => void;
	removeMessageListener: (callback: WsMessageListener<never>) => void;
} & S;

export type WsClient<T> = () => Promise<WsConnectedBase<T>>;

export type WsClientFactory<T> = <C>(wsClient: WsClient<C>) => WsClient<T & C>;

export type WsControllerFactory = (controller: string) => WsClient<unknown>;

export type WsMessageListener<T extends WsMessageType> = (data: WsMessage<T>['data']) => void;
