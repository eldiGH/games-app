import 'dotenv/config';
import { app } from './app';
import { testDBConnection } from './db';
import { WebSocketServer } from 'ws';
import { parse } from 'url';

const port = process.env.PORT ?? 3000;

const main = async () => {
	const dbError = await testDBConnection();

	if (dbError) {
		console.error("Can't connect to the DB");
		console.error(dbError);
		return;
	}

	const server = app.listen(port, () => {
		console.log(`Server running on port ${port}`);
	});

	const wss1 = new WebSocketServer({ noServer: true });
	const wss2 = new WebSocketServer({ noServer: true });

	server.on('upgrade', (req, socket, head) => {
		const { pathname } = parse(req.url ?? '');

		if (pathname === '/foo') {
			wss1.handleUpgrade(req, socket, head, function done(ws) {
				wss1.emit('connection', ws, req);
			});
		} else if (pathname === '/bar') {
			wss2.handleUpgrade(req, socket, head, function done(ws) {
				wss2.emit('connection', ws, req);
			});
		} else {
			socket.destroy();
		}
	});
};

main();

// const ws = require('ws');

// const client = new ws('ws://localhost:3000');

// client.on('open', () => {
//   // Causes the server to print "Hello"
//   client.send('Hello');
// });
