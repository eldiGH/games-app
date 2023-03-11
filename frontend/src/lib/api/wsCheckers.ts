import { roomsExtendedClient } from '$lib/helpers';
import type { WsClientFactory } from '$lib/types';
import { wsClientFactory } from './wsClient';

export interface WsCheckersClientMethods {
	move: () => void;
}

roomsExtendedClient(wsClientFactory('checkers'));

export const wsCheckersClientFactory: WsClientFactory<WsCheckersClientMethods> = (wsClient) => {
	const connect = async () => {
		const client = await wsClient();

		const move = () => {
			///
		};

		return { ...client, move };
	};

	return connect;
};

export const wsCheckersClient = wsCheckersClientFactory(
	roomsExtendedClient(wsClientFactory('checkers'))
);

export type WsCheckersClient = Awaited<ReturnType<typeof wsCheckersClient>>;
