import { RoomStatus, WsMessageType, type RoomInfo } from '@shared/types';
import type { WsClient } from '../types';

export interface UpdateRequest {
	updateThisRoom: boolean;
	updateRoomsList: boolean;
	update: () => void;
}

export interface Room {
	id: string;
	leader: WsClient;
	players: (WsClient | null)[];
	playersInRoom: WsClient[];
	status: RoomStatus;
	readyState: boolean[];
	leave: (client: WsClient) => UpdateRequest;
	join: (client: WsClient) => UpdateRequest;
	sit: (client: WsClient, slot: number) => UpdateRequest;
	kick: (client: WsClient, slot: number) => UpdateRequest;
	sendRoomData: () => void;
}

export interface RoomManager {
	addRoom: (client: WsClient) => void;
	joinRoom: (client: WsClient, id: string) => void;
	leaveRoom: (client: WsClient) => void;
	sit: (client: WsClient, index: number) => void;
	kick: (client: WsClient, index: number) => void;
	subscribeRoomList: (client: WsClient) => void;
	unsubscribeRoomList: (client: WsClient) => void;
}

const getRandomRoomId = (): string => {
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

	return id;
};

const roomMapper = (room: Room): RoomInfo => {
	const { id, players, playersInRoom, leader, status } = room;

	return {
		id,
		leader: leader.player.nickname,
		players: players.map((client) => (client ? playersInRoom.indexOf(client) : null)),
		playersInRoom: playersInRoom.map(({ player }) => ({
			nickname: player.nickname,
			rating: 1000
		})),
		status: status,
		time: 300
	};
};

export const roomsManagerFactory = (playersCount: number) => {
	const rooms: Room[] = [];
	const roomListSubscribers: WsClient[] = [];

	const roomFactory = (id: string, client: WsClient, playersCount: number): Room => {
		const players: (WsClient | null)[] = [client];
		const playersInRoom = [client];
		const leader = client;
		const status = playersCount;
		const readyState: boolean[] = [];

		for (let i = 1; i < playersCount; i++) {
			players.push(null);
		}

		const updateRequestFactory = (): UpdateRequest => {
			const update = () => {
				updateRequest.updateRoomsList && sendCurrentRoomsList();
				updateRequest.updateThisRoom && sendRoomData();
			};

			const updateRequest = { updateRoomsList: false, updateThisRoom: false, update };

			return updateRequest;
		};

		const leave = (client: WsClient) => {
			const updateRequest = updateRequestFactory();

			const playerInRoomIndex = thisRoom.playersInRoom.indexOf(client);
			if (playerInRoomIndex === -1) return;

			thisRoom.playersInRoom.splice(playerInRoomIndex, 1);
			updateRequest.updateThisRoom = true;

			const playerIndex = thisRoom.players.indexOf(client);
			if (playerIndex !== -1) {
				thisRoom.players.splice(playerIndex, 1, null);
				updateRequest.updateRoomsList = true;
				updateRequest.updateThisRoom = true;
			}

			const isRoomEmpty = thisRoom.playersInRoom.length === 0;
			if (!isRoomEmpty) {
				updateRequest.updateThisRoom = true;
				return;
			}

			const index = rooms.indexOf(thisRoom);
			if (index === -1) return;

			rooms.splice(index, 1);
			updateRequest.updateRoomsList = true;
			updateRequest.updateThisRoom = false;
		};

		const join = (client: WsClient) => {
			const { update, updateRoomsList, updateThisRoom } = updateWatcher();

			const currentRoom = getRoomByClient(client);
			let isRoomUpdated = false;

			if (currentRoom && currentRoom !== thisRoom) {
				currentRoom.leave(client);
				isRoomUpdated = true;
			} else if (thisRoom.playersInRoom.includes(client)) {
				update();
				return;
			}

			thisRoom.playersInRoom.push(client);
			isRoomUpdated = true;

			update();
			return;
		};

		const sit = (client: WsClient, index: number): boolean => {
			if (index < 0 || index > playersCount) return false;

			const isSpotBusy = thisRoom.players[index] !== null;
			if (isSpotBusy) return false;

			const currentSpot = thisRoom.players.indexOf(client);
			if (currentSpot !== -1) thisRoom.players[currentSpot] = null;

			thisRoom.players[index] = client;

			const isFull = thisRoom.players.every((player) => player !== null);
			if (isFull) thisRoom.status = RoomStatus.Full;

			return true;
		};

		const kick = (client: WsClient, index: number): boolean => {
			if (index < 0 || index > playersCount) return false;

			const room = getRoomByClient(client);
			if (!room || room.players[index] === null) return false;

			if (!(room.leader === client || room.players[index] === client)) return false;

			room.players[index] = null;
			room.status = RoomStatus.Waiting;

			return true;
		};

		const sendRoomData = () => {
			const roomInfo = roomMapper(thisRoom);

			for (const client of thisRoom.playersInRoom) {
				client.send(WsMessageType.RoomData, roomInfo);
			}
		};

		const thisRoom: Room = {
			id,
			players,
			playersInRoom,
			leader,
			status,
			readyState,
			leave,
			join,
			sit,
			kick,
			sendRoomData
		};

		return thisRoom;
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

	const getCurrentRoomsIds = () => rooms.map(({ id }) => id);

	const getRoomByClient = (client: WsClient) =>
		rooms.find((room) => room.playersInRoom.includes(client));
	const getRoomById = (id: string) => rooms.find((room) => room.id === id);

	const addRoom = (client: WsClient) => {
		const currentRoom = getRoomByClient(client);

		if (currentRoom) {
			const wasUpdated = currentRoom.leave(client);
			if (wasUpdated) currentRoom.sendRoomData();
		}

		const currentRoomIds = getCurrentRoomsIds();

		let newId: string;
		do {
			newId = getRandomRoomId();
		} while (currentRoomIds.includes(newId));

		const newRoom = roomFactory(newId, client, playersCount);
		rooms.push(newRoom);
	};

	const removeRoom = (room: Room) => {
		const roomIndex = rooms.indexOf(room);

		if (roomIndex === -1) return;

		rooms.splice(roomIndex, 1);
	};

	const joinRoom = (client: WsClient, id: string) => {
		const room = getRoomById(id);

		const isRoomUpdated = room?.join(client);

		if (isRoomUpdated) {
			sendCurrentRoomsList();
			room?.sendRoomData();
		}
	};

	const leaveRoom = (client: WsClient) => {
		const room = getRoomByClient(client);

		if (!room) return;

		const wasRoomUpdated = room.leave(client);
	};

	const sit = (client: WsClient, index: number) => {
		const room = getRoomByClient(client);

		const isRoomUpdated = room?.sit(client, index);

		if (isRoomUpdated) {
			sendCurrentRoomsList();
			room?.sendRoomData();
		}
	};

	const kick = (client: WsClient, index: number) => {
		const room = getRoomByClient(client);

		const isRoomUpdated = room?.kick(client, index);

		if (isRoomUpdated) {
			sendCurrentRoomsList();
			room?.sendRoomData();
		}
	};

	const subscribeRoomList = (client: WsClient) => {
		if (roomListSubscribers.includes(client)) return;

		roomListSubscribers.push(client);

		client.send(WsMessageType.RoomsList, getRoomsInfo());
	};

	const unsubscribeRoomList = (client: WsClient) => {
		const index = roomListSubscribers.findIndex((sc) => sc === client);
		if (index === -1) return;

		roomListSubscribers.splice(index, 1);
	};

	const manager: RoomManager = {
		addRoom,
		sit,
		kick,
		joinRoom,
		leaveRoom,
		subscribeRoomList,
		unsubscribeRoomList
	};

	return manager;
};
