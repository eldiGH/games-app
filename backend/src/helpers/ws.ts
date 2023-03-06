import type { WsMessage, WsMessageType } from '@shared/types';
import { WebSocketServer, WebSocket } from 'ws';
import type { WsController, WsHook, WsHandler, WsSocket, ReqWithPlayer } from '../types';

const socketWrapper = (socket: WebSocket, req: ReqWithPlayer): WsSocket => {
	const send = <T extends WsMessageType>(type: T, data: WsMessage<T>['data']) => {
		socket.send(JSON.stringify({ type, data }));
	};

	const { player } = req;

	return { send, player };
};

export const wsController = (path: string): WsController => {
	const wss = new WebSocketServer({ noServer: true });
	const hooks: WsHook[] = [];

	wss.on('connection', (ws, req) => {
		const socket = socketWrapper(ws, req as ReqWithPlayer);

		ws.on('message', (data) => {
			try {
				const message: WsMessage<null> = JSON.parse(data.toString());
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

export const messageFactory =
	(wsController: WsController) =>
	<Type extends WsMessageType, T extends WsMessage<Type>, Data extends T['data']>(
		type: Type,
		handler: WsHandler<Data>
	) => {
		wsController.hooks.push({ type, handler } as WsHook);
	};

export type WsMessageHandler = ReturnType<typeof messageFactory>;
