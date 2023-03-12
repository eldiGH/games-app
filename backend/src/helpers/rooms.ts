import { RoomStatus, WsMessageType, type RoomInfo } from '@shared/types';
import type { Room, WsClient } from '../types';
import type { WsMessageHandler } from './ws';

const getRandomRoomId = (currentIds: string[]): string => {
	let id = '';

	for (let i = 0; i < 6; i++) {
		const randomIndex = Math.floor(Math.random() * 36);

		let charCode;

		if (randomIndex > 9) {
			charCode = randomIndex + 87;
		} else {
			charCode = randomIndex + 48;
		}

		id += String.fromCharCode(charCode);
	}

	if (currentIds.includes(id)) return getRandomRoomId(currentIds);

	return id;
};

export const handleRooms = (message: WsMessageHandler) => {
	const roomListSubscribers: WsClient[] = [];
	const rooms: Room[] = [];

	const getRoomById = (id: string) => rooms.find((room) => room.id === id);

	const getRoomByClient = (client: WsClient) =>
		rooms.find((room) => room.playersInRoom.includes(client));

	const roomMapper = (room: Room): RoomInfo => {
		const { id, players, playersInRoom, leader } = room;

		return {
			id,
			leader: leader.player.nickname,
			players: players.map((client) => (client ? playersInRoom.indexOf(client) : null)),
			playersInRoom: playersInRoom.map(({ player }) => ({
				nickname: player.nickname,
				rating: 1000
			})),
			status: RoomStatus.Waiting,
			time: 300
		};
	};

	const getRoomsInfo = () => {
		const roomsInfo: RoomInfo[] = rooms.map(roomMapper);

		return roomsInfo;
	};

	const sendCurrentRoomsList = () => {
		const roomsInfo = getRoomsInfo();

		for (const client of roomListSubscribers) {
			client.send(WsMessageType.RoomsList, roomsInfo);
		}
	};

	const sendRoomData = (room: Room) => {
		const roomInfo = roomMapper(room);

		for (const client of room.playersInRoom) {
			client.send(WsMessageType.RoomData, roomInfo);
		}
	};

	const removeRoom = (room: Room) => {
		const roomIndex = rooms.indexOf(room);

		if (roomIndex === -1) return;

		rooms.splice(roomIndex, 1);
	};

	const leaveRoom = (room: Room, client: WsClient) => {
		const playerIndex = room.players.indexOf(client);

		if (playerIndex !== -1) {
			room.players.splice(playerIndex, 1, null);
		}

		const playerInRoomIndex = room.playersInRoom.indexOf(client);

		if (playerInRoomIndex !== -1) {
			room.playersInRoom.splice(playerInRoomIndex, 1);
		}

		if (room.playersInRoom.length === 0) {
			removeRoom(room);
			return;
		}

		if (client === room.leader) {
			room.leader = room.playersInRoom[0];
		}
	};

	const joinRoom = (room: Room, client: WsClient) => {
		if (room.playersInRoom.includes(client)) return;
		room.playersInRoom.push(client);
	};

	message(WsMessageType.SubscribeRoomList, (client) => {
		if (roomListSubscribers.includes(client)) return;

		roomListSubscribers.push(client);

		client.send(WsMessageType.RoomsList, getRoomsInfo());

		client.onClose(() => {
			const index = roomListSubscribers.indexOf(client);
			if (index !== -1) roomListSubscribers.splice(index, 1);
		});
	});

	message(WsMessageType.UnsubscribeRoomList, (client) => {
		const index = roomListSubscribers.findIndex((sc) => sc === client);
		if (index === -1) return;

		roomListSubscribers.splice(index, 1);
	});

	message(WsMessageType.CreateRoom, (client) => {
		const currentRoom = getRoomByClient(client);

		if (currentRoom) leaveRoom(currentRoom, client);

		const currentRoomIds = Object.keys(rooms);
		const newId = getRandomRoomId(currentRoomIds);

		const newRoom: Room = {
			id: newId,
			leader: client,
			players: [client, null],
			playersInRoom: [client]
		};
		rooms.push(newRoom);

		client.send(WsMessageType.RoomCreated, newId);

		sendCurrentRoomsList();

		client.onClose(() => {
			leaveRoom(newRoom, client);
			sendCurrentRoomsList();
		});
	});

	message(WsMessageType.JoinRoom, (client, id) => {
		const room = getRoomById(id);
		if (!room) return;

		const currentRoom = getRoomByClient(client);

		if (currentRoom && currentRoom.id !== id) {
			leaveRoom(currentRoom, client);
		}

		if (room.playersInRoom.includes(client)) {
			sendRoomData(room);
			return;
		}

		joinRoom(room, client);
		sendRoomData(room);

		client.onClose(() => {
			leaveRoom(room, client);
			sendCurrentRoomsList();
		});
	});

	message(WsMessageType.Sit, (client, index) => {
		if (index < -1 || index > 1) return;

		const room = getRoomByClient(client);
		if (!room || room.players[index] !== null) return;

		const currentSpot = room.players.indexOf(client);
		if (currentSpot !== -1) room.players[currentSpot] = null;

		if (index !== -1) room.players[index] = client;

		sendRoomData(room);
	});
};
