import type { WsAnyMessage, WsMessage, WsMessageType } from '@shared/types';
import { WebSocketServer, WebSocket, type RawData } from 'ws';
import type { WsController, WsHook, WsHandler, WsClient, ReqWithPlayer } from '../types';

const parseData = (data: RawData): WsAnyMessage => {
	const message: WsAnyMessage = JSON.parse(data.toString());

	return message;
};

const wsClient = (socket: WebSocket, req: ReqWithPlayer): WsClient => {
	const send = <T extends WsMessageType>(type: T, data: WsMessage<T>['data']) => {
		socket.send(JSON.stringify({ type, data }));
	};

	const waitForMessage = async <T extends WsMessageType>(
		type: T,
		waitTime = 3000
	): Promise<WsMessage<T>['data']> => {
		return new Promise((res, rej) => {
			const listener = (data: RawData) => {
				const message = parseData(data);

				if (message.type !== type) return;

				socket.off('message', listener);
				res(message.data);
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

	const { player } = req;

	return { send, player, socket, waitForMessage, onClose };
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

				hook.handler(socket, message.data as never);
			} catch (e) {
				console.error(e);
			}
		});
	});

	return { wss, path, hooks };
};

export const messageFactory =
	(wsController: WsController) =>
	<Type extends WsMessageType, T extends WsMessage<Type>, Data extends T['data']>(
		type: Type,
		handler: WsHandler<Data>
	) => {
		wsController.hooks.push({ type, handler } as WsHook);
	};

export type WsMessageHandler = ReturnType<typeof messageFactory>;
