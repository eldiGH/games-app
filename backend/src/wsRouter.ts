import type { IncomingMessage, Server, ServerResponse } from 'http';
import { parse } from 'url';
import { authenticate } from './helpers';
import type { ReqWithPlayer } from './types';
import { CheckersController } from './ws-controllers';

const controllers = [CheckersController];

export const addWebsocket = (server: Server<typeof IncomingMessage, typeof ServerResponse>) => {
	server.on('upgrade', async (req, socket, head) => {
		const { pathname } = parse(req.url ?? '');

		try {
			const player = await authenticate(req.headers);

			for (const controller of controllers) {
				if (pathname === controller.path) {
					controller.wss.handleUpgrade(req, socket, head, (ws, req) => {
						(req as ReqWithPlayer).player = player;

						controller.wss.emit('connection', ws, req);
					});
					break;
				}
			}
		} catch (e) {
			socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
			socket.destroy();
			return;
		}
	});
};
