import type { WsClientFactory } from '$lib/types';
import { WsMessageType } from '@shared/types';

interface RoomsWsConnect {
	join: () => void;
	subscribeList: () => void;
	unsubscribeList: () => void;
}

export const roomsExtendedClient: WsClientFactory<RoomsWsConnect> = (wsClient) => {
	const connect = async () => {
		const client = await wsClient();
		const { send } = client;

		const additionalMethods = {
			join: () => {
				///
			},
			subscribeList: () => {
				send(WsMessageType.SubscribeRoomList, undefined);
			},
			unsubscribeList: () => {
				send(WsMessageType.UnsubscribeRoomList, undefined);
			}
		};

		return { ...client, ...additionalMethods };
	};

	return connect;
};
