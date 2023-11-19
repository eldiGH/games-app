import type {
  AnyWsMessagesToServer,
  WsMessagesToClientType,
  WsMessagesToServerType,
  WsMessageToClient,
  WsMessageToServer
} from '@shared/types';
import { WebSocketServer, WebSocket, type RawData } from 'ws';
import type {
  WsController,
  WsHook,
  WsHandler,
  WsClient,
  ReqWithPlayer,
  WsSendHandler,
  WsRankingsClient
} from '../types';
import { db } from '../db';
import { defaultRankingFactory } from '../services/RankingsService';
import type { GameType, Ranking } from '@prisma/client';

const parseData = (data: RawData): AnyWsMessagesToServer => {
  const message: AnyWsMessagesToServer = JSON.parse(data.toString());

  return message;
};

const wsClient = (socket: WebSocket, req: ReqWithPlayer): WsClient => {
  const send = ((type, data) => {
    socket.send(JSON.stringify({ type, data }));
  }) as WsSendHandler;

  const waitForMessage = async <T extends WsMessagesToServerType>(
    type: T,
    waitTime = 3000
  ): Promise<WsMessageToServer<T>['data']> => {
    return new Promise((res, rej) => {
      const listener = (data: RawData) => {
        const message = parseData(data);

        if (message.type !== type) return;

        socket.off('message', listener);
        res(message.data as never);
        clearTimeout(timeout);
      };

      const timeout = setTimeout(() => {
        socket.off('message', listener);
        rej(new Error('Client did not respond with awaited message'));
      }, waitTime);

      socket.on('message', listener);
    });
  };

  const onClose = (callback: () => void) => {
    socket.on('close', callback);
  };

  const addSocketEventListenerOnce = (type: 'close', callback: (this: WebSocket) => void) => {
    const listeners = socket.listeners(type);

    if (listeners.includes(callback)) return;

    socket.on(type, callback);
  };

  const { player } = req;

  return { send, player, socket, waitForMessage, onClose, addSocketEventListenerOnce };
};

export const wsController = <T extends WsClient = WsClient>(
  path: string,
  clientTransformer?: (client: WsClient) => T | Promise<T>
): WsController<T> => {
  const wss = new WebSocketServer({ noServer: true });
  const hooks: WsHook<T>[] = [];

  wss.on('connection', async (ws, req) => {
    let socket: T;
    if (clientTransformer) {
      socket = await clientTransformer(wsClient(ws, req as ReqWithPlayer));
    } else {
      socket = wsClient(ws, req as ReqWithPlayer) as T;
    }

    ws.on('message', (data) => {
      try {
        const message = parseData(data);

        const hook = hooks.find(({ type }) => type === message.type);
        if (!hook) return;

        hook.handler(socket, message.data);
      } catch (e) {
        console.error(e);
      }
    });
  });

  return { wss, path, hooks };
};

export const sendToAllClients = <T extends WsMessagesToClientType>(
  clients: WsClient[],
  type: T,
  data: WsMessageToClient<T>['data']
) => {
  for (const client of clients) {
    client.send(type, data);
  }
};

export const messageFactory =
  <C extends WsClient = WsClient>(wsController: WsController<C>): WsMessageHandler<C> =>
  (type, handler) => {
    wsController.hooks.push({ type, handler } as WsHook);
  };

export const updateRankingClients = async (clients: WsRankingsClient[]) => {
  if (clients.length === 0) return;

  const gameType = clients[0].player.gameType;

  const sortedClients = [...clients].sort();
  const ids = sortedClients.map(({ player }) => player.id);

  console.log(ids);

  const rankings = await db.ranking.findMany({
    where: { AND: [{ game: gameType }, { playerId: { in: ids } }] }
  });

  rankings.sort();

  let rankingIndex = 0;
  for (const client of sortedClients) {
    const ranking = rankings[rankingIndex];
    if (!ranking) {
      break;
    }

    if (ranking.playerId !== client.player.id) {
      continue;
    } else {
      client.player.ranking = ranking.value;
      rankingIndex++;
    }
  }
};

export const rankingsClientTransformer =
  (gameType: GameType) =>
  async (client: WsClient): Promise<WsRankingsClient> => {
    let ranking: Omit<Ranking, 'id'> | null = await db.ranking.findFirst({
      where: { playerId: client.player.id, game: gameType }
    });

    if (!ranking) {
      ranking = defaultRankingFactory(gameType, client.player.id);
    }

    return { ...client, player: { ...client.player, ranking: ranking.value, gameType } };
  };

export type WsMessageHandler<C extends WsClient = WsClient> = <
  Type extends WsMessagesToServerType,
  T extends WsMessageToServer<Type>,
  Data extends T['data']
>(
  type: Type,
  handler: WsHandler<Data, C>
) => void;
