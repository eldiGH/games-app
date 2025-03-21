import type { IncomingMessage, Server, ServerResponse } from 'http';
import { parse } from 'url';
import { accessTokenQueryRegex, authenticate } from './helpers';
import type { ReqWithPlayer } from './types';
import { CheckersWsController } from './ws-controllers';
import { ShipsWsController } from './ws-controllers/ShipsWsController';
import { ChessWsController } from './ws-controllers/ChessWsController';

const controllers = [CheckersWsController, ShipsWsController, ChessWsController];

export const addWebsocket = (server: Server<typeof IncomingMessage, typeof ServerResponse>) => {
  server.on('upgrade', async (req, socket, head) => {
    const { pathname, query } = parse(req.url ?? '');

    try {
      if (!query) throw new Error();

      const tokenMatch = query.match(accessTokenQueryRegex);
      if (!tokenMatch) throw new Error();

      const token = tokenMatch[0];

      const player = await authenticate(token);

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
