import type { WsConnectedBase, WsControllerFactory, WsMessageListenerHandler } from '$lib/types';
import type { AnyWsMessagesToClient, WsMessagesToClientType } from '@shared/types';
import { get } from 'svelte/store';
import urljoin from 'url-join';
import config from '../../config.json';

const getStores = async () => {
  const { authStore } = await import('$lib/stores');

  return { authStore };
};

const getMessageFromEvent = (event: MessageEvent): AnyWsMessagesToClient => JSON.parse(event.data);

export const wsControllerFactory: WsControllerFactory = (controller: string) => {
  const apiPath = `${config.USE_WSS ? 'wss://' : 'ws://'}${config.API_URL}`;
  const url = urljoin(apiPath, controller);

  const connect = async () => {
    const messageQueue: string[] = [];
    const messageListeners: {
      type: WsMessagesToClientType;
      callbacks: WsMessageListenerHandler<WsMessagesToClientType>[];
    }[] = [];

    const { authStore } = await getStores();

    const token = get(authStore).token;

    if (!token) throw new Error('no token');

    const accessToken = `Bearer ${token}`;

    const socket: WebSocket = new WebSocket(`${url}?accessToken=${accessToken}`);

    socket.addEventListener('message', (event) => {
      const { data, type } = getMessageFromEvent(event);

      const listener = messageListeners.find((listener) => listener.type === type);

      if (!listener) return;

      for (const callback of listener.callbacks) {
        callback(data as never);
      }
    });

    socket.addEventListener('open', () => {
      for (const message of messageQueue) {
        socket.send(message);
      }

      messageQueue.splice(0, messageQueue.length);
    });

    const send = ((type, data) => {
      const message = JSON.stringify({ type, data });

      if (socket.readyState === socket.OPEN) {
        socket.send(message);
      } else messageQueue.push(message);
    }) as WsConnectedBase['send'];

    const waitForMessage: WsConnectedBase['waitForMessage'] = (type, waitTime = 3000) => {
      return new Promise((res, rej) => {
        const callback = (event: MessageEvent) => {
          const message = getMessageFromEvent(event);

          if (message.type !== type) return;

          socket.removeEventListener('message', callback);
          clearTimeout(timeout);

          res(message.data as never);
        };

        const timeout = setTimeout(() => {
          socket.removeEventListener('message', callback);
          rej(new Error('Server did not respond with awaited message'));
        }, waitTime);

        socket.addEventListener('message', callback);
      });
    };

    const addMessageListener: WsConnectedBase['addMessageListener'] = (type, callback) => {
      let listener = messageListeners.find((listener) => type === listener.type);

      if (!listener) {
        listener = { type, callbacks: [] };
        messageListeners.push(listener);
      }

      if (listener.callbacks.includes(callback as never)) return;

      listener.callbacks.push(callback as never);
    };

    const removeMessageListener: WsConnectedBase['removeMessageListener'] = (callback) => {
      for (const listener of messageListeners) {
        const index = listener.callbacks.findIndex(
          (cb) => (cb as unknown as WsMessageListenerHandler<never>) === callback
        );
        if (index >= 0) {
          listener.callbacks.splice(index, 1);
          break;
        }
      }
    };

    return { send, socket, waitForMessage, addMessageListener, removeMessageListener };
  };

  return connect;
};
