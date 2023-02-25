import type { WsMessage } from '@shared/types';
import { WebSocketServer } from 'ws';
import type {
	Controller,
	EndpointConfig,
	AuthEndpointConfig,
	EndpointCallback,
	Endpoint,
	WsController,
	WsHook,
	WsHandler
} from '../types';

import type { InferType, Schema } from 'yup';

export const controller = (path: string): Controller => ({ path, endpoints: [] });

export const endpointFactory = (controller: Controller) => {
	return <MySchema extends Schema, Auth extends boolean = false>(
		endpointOptions: EndpointConfig<MySchema> | AuthEndpointConfig<MySchema, Auth>,
		callback: EndpointCallback<InferType<MySchema>, Auth>
	): Endpoint => {
		const endpoint = { auth: false, ...endpointOptions, callback } as Endpoint;

		controller.endpoints.push(endpoint);

		return endpoint;
	};
};

export const wsController = (path: string): WsController => {
	const wss = new WebSocketServer({ noServer: true });
	const hooks: WsHook[] = [];

	wss.on('connection', (ws) => {
		ws.on('message', (data) => {
			try {
				const message: WsMessage = JSON.parse(data.toString());
				const hook = hooks.find(({ type }) => type === message.type);
				if (!hook) return;

				hook.handler(message.data);
			} catch (e) {
				console.error(e);
			}
		});
	});

	return { wss, path, hooks };
};

export const messageFactory =
	(wsController: WsController) =>
	<T extends WsMessage>(type: T['type'], handler: WsHandler<T['data']>) => {
		wsController.hooks.push({ type, handler } as WsHook);
	};
