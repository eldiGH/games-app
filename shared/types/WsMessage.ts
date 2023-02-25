import type { Coordinates } from './Coordinates';

export type WsMessage = WsMove;

export interface WsMove {
	type: 'move';
	data: {
		from: Coordinates;
		to: Coordinates;
	};
}
