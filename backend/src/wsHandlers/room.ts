import { WsMessageType } from '@shared/types';
import { roomsManagerFactory, type RoomManager, type WsMessageHandler } from '../helpers';

export const handleRooms = (message: WsMessageHandler, playersCount = 2): RoomManager => {
	const roomsManager = roomsManagerFactory(playersCount);

	message(WsMessageType.SubscribeRoomList, (client) => {
		roomsManager.subscribeRoomList(client);

		client.onClose(() => {
			roomsManager.unsubscribeRoomList(client);
		});
	});

	message(WsMessageType.UnsubscribeRoomList, (client) => {
		roomsManager.unsubscribeRoomList(client);
	});

	message(WsMessageType.CreateRoom, (client) => {
		roomsManager.addRoom(client);

		client.onClose(() => {
			roomsManager.leaveRoom(client);
		});
	});

	message(WsMessageType.JoinRoom, (client, id) => {
		roomsManager.joinRoom(client, id);

		client.onClose(() => {
			roomsManager.leaveRoom(client);
		});
	});

	message(WsMessageType.Sit, (client, index) => {
		roomsManager.sit(client, index);
	});

	message(WsMessageType.Kick, (client, index) => {
		roomsManager.kick(client, index);
	});

	// message(WsMessageType.Ready, (client) => {});

	return roomsManager;
};
