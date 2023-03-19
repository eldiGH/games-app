import type {
  WsMessagesToClientType,
  WsMessagesToServerType,
  WsMessageToClient,
  WsMessageToServer
} from '@shared/types';

export type WsConnectedBase = {
  socket: WebSocket;
  send: <T extends WsMessagesToServerType>(type: T, data: WsMessageToServer<T>['data']) => void;
  waitForMessage: <T extends WsMessagesToClientType>(
    type: T,
    waitTime?: number
  ) => Promise<WsMessageToClient<T>['data']>;
  addMessageListener: <T extends WsMessagesToClientType>(
    type: T,
    callback: WsMessageListenerHandler<T>
  ) => void;
  removeMessageListener: (callback: WsMessageListenerHandler<never>) => void;
};

export type WsClient<T> = () => Promise<T & WsConnectedBase>;

export type WsClientFactory<T, C = unknown> = (wsClient: WsClient<C>) => WsClient<T & C>;

export type WsControllerFactory = (controller: string) => WsClient<WsConnectedBase>;

export type WsMessageListenerHandler<T extends WsMessagesToClientType> = (
  data: WsMessageToClient<T>['data']
) => void;
