import type { Static, TSchema } from '@sinclair/typebox';
import { WebSocketServer } from 'ws';
import type {
	Controller,
	EndpointConfig,
	AuthEndpointConfig,
	EndpointCallback,
	Endpoint,
	WsController,
	WsMessage,
	WsMessageHandler
} from '../types';

export const controller = (path: string): Controller => ({ path, endpoints: [] });

export const endpointFactory = (controller: Controller) => {
	return <Schema extends TSchema, Auth extends boolean = false>(
		endpointOptions: EndpointConfig<Schema> | AuthEndpointConfig<Schema, Auth>,
		callback: EndpointCallback<Static<Schema>, Auth>
	): Endpoint => {
		const endpoint = { auth: false, ...endpointOptions, callback } as Endpoint;

		controller.endpoints.push(endpoint);

		return endpoint;
	};
};

export const wsController = (path: string): WsController => {
	const wss = new WebSocketServer({ noServer: true });
	const events: WsMessage[] = [];

	wss.on('connection', (socket) => {
		socket.emit('test', { sadad: 'sdad' });

		for (const { name, handler } of events) {
			socket.on('message', (data, isBinary) => {
				console.log(data);
			});
		}
	});

	return { wss, path, messages: events };
};

export const messageFactory =
	(wsController: WsController) => (name: string, handler: WsMessageHandler) => {
		wsController.messages.push({ name, handler });
	};
