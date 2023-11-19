import type { GameType, Player } from '@prisma/client';
import type {
  WsMessagesToClientType,
  WsMessagesToServerType,
  WsMessageToClient,
  WsMessageToServer
} from '@shared/types';
import type { Server, WebSocket } from 'ws';

export interface WsController<T extends WsClient = WsClient> {
  wss: Server;
  path: string;
  hooks: WsHook<T>[];
}

export interface WsHook<T extends WsClient = WsClient> {
  type: string;
  handler: WsHandler<unknown, T>;
}

export type WsHandler<T = unknown, C extends WsClient = WsClient> = (socket: C, data: T) => void;

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
  addSocketEventListenerOnce: (type: 'close', callback: (this: WebSocket) => void) => void;
}

export interface WsRankingsClient extends WsClient {
  player: Player & { ranking: number; gameType: GameType };
}
