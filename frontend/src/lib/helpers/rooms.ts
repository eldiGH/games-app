import type { WsClientFactory } from '$lib/types';
import { WsMessageType, type RoomInfo } from '@shared/types';
import { writable, type Readable } from 'svelte/store';

interface RoomsWsConnect {
	join: (id: string) => Promise<void>;
	subscribeList: () => void;
	unsubscribeList: () => void;
	createRoom: () => Promise<string>;
	sit: (index: number) => Promise<void>;
	roomsList: Readable<RoomInfo[] | null>;
	room: Readable<RoomInfo | null>;
}

export const roomsExtendedClient: WsClientFactory<RoomsWsConnect> = (wsClient) => {
	const connect = async () => {
		const client = await wsClient();
		const { send, addMessageListener, removeMessageListener, waitForMessage } = client;

		const roomsList = writable<RoomInfo[] | null>(null);
		const room = writable<RoomInfo | null>(null);

		const refreshRoomsListCallback = (data: RoomInfo[]) => {
			roomsList.set(data);
		};

		const refreshRoomCallback = (data: RoomInfo) => {
			room.set(data);
		};

		const additionalMethods = {
			join: async (id: string) => {
				send(WsMessageType.JoinRoom, id);

				const roomData = await waitForMessage(WsMessageType.RoomData);
				room.set(roomData);

				addMessageListener(WsMessageType.RoomData, refreshRoomCallback);
			},

			subscribeList: () => {
				send(WsMessageType.SubscribeRoomList, undefined);

				addMessageListener(WsMessageType.RoomsList, refreshRoomsListCallback);
			},

			unsubscribeList: () => {
				send(WsMessageType.UnsubscribeRoomList, undefined);

				removeMessageListener(refreshRoomsListCallback);
				roomsList.set(null);
			},

			createRoom: async () => {
				send(WsMessageType.CreateRoom, undefined);

				return await waitForMessage(WsMessageType.RoomCreated);
			},

			sit: async (index: number) => {
				send(WsMessageType.Sit, index);

				await waitForMessage(WsMessageType.RoomData);
			}
		};

		return {
			...client,
			...additionalMethods,
			roomsList: { subscribe: roomsList.subscribe },
			room: { subscribe: room.subscribe }
		};
	};

	return connect;
};
