import type { WsControllerFactory, WsMessageListener } from '$lib/types';
import type { WsAnyMessage, WsMessage, WsMessageType } from '@shared/types';
import { get } from 'svelte/store';
import urljoin from 'url-join';
import config from '../../config.json';

const getStores = async () => {
	const { authStore } = await import('$lib/stores');

	return { authStore };
};

const getMessageFromEvent = (event: MessageEvent): WsAnyMessage => JSON.parse(event.data);

export const wsClientFactory: WsControllerFactory = (controller: string) => {
	const apiPath = `${config.USE_WSS ? 'wss://' : 'ws://'}${config.API_URL}`;
	const url = urljoin(apiPath, controller);

	const connect = async () => {
		const messageQueue: string[] = [];
		const messageListeners: { type: WsMessageType; callbacks: WsMessageListener<never>[] }[] = [];

		const { authStore } = await getStores();

		const token = get(authStore).token;

		if (!token) throw new Error('no token');

		const accessToken = `Bearer ${token}`;

		const socket = new WebSocket(`${url}?accessToken=${accessToken}`);

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

		const send = <T extends WsMessageType>(type: T, data: WsMessage<T>['data']) => {
			const message = JSON.stringify({ type, data });

			if (socket.readyState === socket.OPEN) {
				socket.send(message);
			} else messageQueue.push(message);
		};

		const waitForMessage = <T extends WsMessageType>(
			type: T,
			waitTime = 3000
		): Promise<WsMessage<T>['data']> => {
			return new Promise((res, rej) => {
				const callback = (event: MessageEvent) => {
					const message = getMessageFromEvent(event);

					if (message.type !== type) return;

					socket.removeEventListener('message', callback);
					clearTimeout(timeout);

					res(message.data);
				};

				const timeout = setTimeout(() => {
					socket.removeEventListener('message', callback);
					rej(new Error('Server did not respond with awaited message'));
				}, waitTime);

				socket.addEventListener('message', callback);
			});
		};

		const addMessageListener = <T extends WsMessageType>(
			type: T,
			callback: WsMessageListener<T>
		) => {
			let listener = messageListeners.find((listener) => type === listener.type);

			if (!listener) {
				listener = { type, callbacks: [] };
				messageListeners.push(listener);
			}

			if (listener.callbacks.includes(callback)) return;

			listener.callbacks.push(callback);
		};

		const removeMessageListener = (callback: WsMessageListener<never>) => {
			for (const listener of messageListeners) {
				const index = listener.callbacks.findIndex((cb) => cb === callback);
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
