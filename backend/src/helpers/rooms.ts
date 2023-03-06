import { WsMessageType } from '@shared/types';
import type { Room, WsSocket } from '../types';
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

export const handleRooms = (message: WsMessageHandler, maxPlayers = 2) => {
	const roomListSubscribers: WsSocket[] = [];
	const rooms: Room[] = [];

	const getRoomById = (id: string) => rooms.find((room) => room.id);

	const getRoomByPlayer = (player: WsSocket) => rooms.find((room) => room.players.includes(player));

	const roomsInfo = rooms.map(({ id, players, spectators }) => ({
		id,
		players: players.map(({ player }) => player.nickname),
		spectators: spectators.map(({ player }) => player.nickname)
	}));

	const sendCurrentRoomsList = () => {
		for (const socket of roomListSubscribers) {
			socket.send(WsMessageType.RoomsList, roomsInfo);
		}
	};

	const removeRoom = (room: Room) => {
		const roomIndex = rooms.indexOf(room);

		if (roomIndex === -1) return;

		rooms.splice(roomIndex, 1);
	};

	const leaveRoom = (id: string, socket: WsSocket) => {
		const room = getRoomById(id);
		if (!room) return;

		const playerIndex = room.players.indexOf(socket);

		if (playerIndex >= 0) {
			room.players.splice(playerIndex, 1);
		}

		if (room.players.length > 0) return;

		removeRoom(room);
	};

	message(WsMessageType.SubscribeRoomList, (socket) => {
		if (roomListSubscribers.includes(socket)) return;

		roomListSubscribers.push(socket);

		// socket.on('close', () => {
		// 	const index = roomListSubscribers.indexOf(socket);
		// 	roomListSubscribers.splice(index, 1);
		// });
	});

	message(WsMessageType.CreateRoom, (socket) => {
		const currentRoom = getRoomByPlayer(socket);

		if (currentRoom) leaveRoom(currentRoom.id, socket);

		const currentRoomIds = Object.keys(rooms);
		const newId = getRandomRoomId(currentRoomIds);

		rooms.push({ id: newId, players: [socket], spectators: [] });
		sendCurrentRoomsList();

		// socket.on('close', () => {
		// 	onRoomLeave(newId, socket);
		// });
	});
};
