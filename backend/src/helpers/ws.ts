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
  WsSendHandler
} from '../types';

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

export const wsController = (path: string): WsController => {
  const wss = new WebSocketServer({ noServer: true });
  const hooks: WsHook[] = [];

  wss.on('connection', (ws, req) => {
    const socket = wsClient(ws, req as ReqWithPlayer);

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
  (wsController: WsController) =>
  <Type extends WsMessagesToServerType, T extends WsMessageToServer<Type>, Data extends T['data']>(
    type: Type,
    handler: WsHandler<Data>
  ) => {
    wsController.hooks.push({ type, handler } as WsHook);
  };

export type WsMessageHandler = ReturnType<typeof messageFactory>;
