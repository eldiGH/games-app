import type { Player } from '@prisma/client';
import type {
  WsMessagesToClientType,
  WsMessagesToServerType,
  WsMessageToClient,
  WsMessageToServer
} from '@shared/types';
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

export type WsHandler<T = unknown> = (socket: WsClient, data: T) => void;

export type WsSendHandler = <T extends WsMessagesToClientType>(
  type: T,
  data: WsMessageToClient<T>['data']
) => void;

export interface WsClient {
  send: WsSendHandler;
  player: Player;
  socket: WebSocket;
  waitForMessage: <T extends WsMessagesToServerType>(
    type: T
  ) => Promise<WsMessageToServer<T>['data']>;
  onClose: (callback: () => void) => void;
}
