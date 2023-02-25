import type { IncomingMessage, Server, ServerResponse } from 'http';
import { parse } from 'url';
import { CheckersController } from './ws-controllers';

const controllers = [CheckersController];

export const addWebsocket = (server: Server<typeof IncomingMessage, typeof ServerResponse>) => {
	server.on('upgrade', (req, socket, head) => {
		const { pathname } = parse(req.url ?? '');

		for (const controller of controllers) {
			if (pathname === controller.path) {
				controller.wss.handleUpgrade(req, socket, head, (ws, req) => {
					controller.wss.emit('connection', ws, req);
				});
				break;
			}
		}
	});
};
