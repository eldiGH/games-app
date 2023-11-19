import { RoomStatus, type WsRoom } from '@shared/types';
import type WebSocket from 'ws';
import type { WsClient } from '../types';

export interface UpdateRequest {
  updateThisRoom: boolean;
  updateRoomsList: boolean;
  roomUpdater: () => void;
  update: (withList?: boolean) => void;
  childRequests: UpdateRequest[];
}

export interface Room {
  id: string;
  leader: WsClient;
  players: (PlayerInRoom | null)[];
  playersInRoom: WsClient[];
  status: RoomStatus;
  readyState: boolean[];
  leave: (client: WsClient) => UpdateRequest;
  join: (client: WsClient) => UpdateRequest;
  sit: (client: WsClient, slot: number) => UpdateRequest;
  kick: (client: WsClient, slot: number) => UpdateRequest;
  ready: (client: WsClient) => UpdateRequest;
  unready: (client: WsClient) => UpdateRequest;
  end: (winnerIndex: number) => UpdateRequest;
  sendRoomData: () => void;
}

export interface PlayerInRoom {
  client: WsClient;
  isReady: boolean;
}

export interface RoomManager {
  addRoom: (client: WsClient) => string;
  joinRoom: (client: WsClient, id: string) => void;
  leaveRoom: (client: WsClient) => void;
  sit: (client: WsClient, index: number) => void;
  kick: (client: WsClient, index: number) => void;
  subscribeRoomList: (client: WsClient) => void;
  unsubscribeRoomList: (client: WsClient) => void;
  ready: (client: WsClient) => void;
  unready: (client: WsClient) => void;
  end: (client: WsClient, winnerIndex: number) => void;
  onRoomStart: (callback: (room: Room) => void) => void;
  getSubscriptionClientFromSocket: (socket: WebSocket) => WsClient | undefined;
  getRoomClientFromSocket: (socket: WebSocket) => WsClient | undefined;
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

const roomMapper = (room: Room): WsRoom => {
  const { id, players, playersInRoom, leader, status } = room;

  return {
    id,
    leader: leader.player.nickname,
    players: players.map((player) =>
      player
        ? {
            index: playersInRoom.indexOf(player.client),
            isReady: player.isReady
          }
        : null
    ),
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

  const onRoomStartEventHandlers: ((room: Room) => void)[] = [];

  const roomFactory = (id: string, client: WsClient, playersCount: number): Room => {
    const players: (PlayerInRoom | null)[] = [{ client, isReady: false }];
    const playersInRoom = [client];
    const leader = client;
    const status = RoomStatus.Waiting;
    const readyState: boolean[] = [];

    for (let i = 1; i < playersCount; i++) {
      players.push(null);
    }

    const updateRequestFactory = (): UpdateRequest => {
      const update = (withList = true) => {
        let updatedRoomsList = false;

        const recursiveUpdate = (request: UpdateRequest) => {
          if (!updatedRoomsList && request.updateRoomsList && withList) {
            updatedRoomsList = true;
            sendCurrentRoomsList();
          }

          request.updateThisRoom && request.roomUpdater();

          for (const child of request.childRequests) {
            recursiveUpdate(child);
          }
        };

        recursiveUpdate(updateRequest);
      };

      const updateRequest: UpdateRequest = {
        updateRoomsList: false,
        updateThisRoom: false,
        roomUpdater: () => sendRoomData(),
        update,
        childRequests: []
      };

      return updateRequest;
    };

    const areAllPlayersReady = () => thisRoom.players.every((player) => player?.isReady);

    const leave = (client: WsClient) => {
      const updateRequest = updateRequestFactory();

      const playerInRoomIndex = thisRoom.playersInRoom.indexOf(client);
      if (playerInRoomIndex === -1) return updateRequest;

      thisRoom.playersInRoom.splice(playerInRoomIndex, 1);
      updateRequest.updateThisRoom = true;

      const playerIndex = thisRoom.players.findIndex((player) => player?.client === client);
      if (playerIndex !== -1) {
        thisRoom.players.splice(playerIndex, 1, null);
        thisRoom.status = RoomStatus.Waiting;

        for (const player of thisRoom.players) {
          if (player) player.isReady = false;
        }

        updateRequest.updateRoomsList = true;
        updateRequest.updateThisRoom = true;
      }

      const isRoomEmpty = thisRoom.playersInRoom.length === 0;
      if (!isRoomEmpty) {
        updateRequest.updateThisRoom = true;
        return updateRequest;
      }

      const index = rooms.indexOf(thisRoom);
      if (index === -1) return updateRequest;

      rooms.splice(index, 1);
      updateRequest.updateRoomsList = true;
      updateRequest.updateThisRoom = false;

      return updateRequest;
    };

    const join = (client: WsClient) => {
      const updateRequest = updateRequestFactory();

      const currentRoom = getRoomByClient(client);

      if (currentRoom && currentRoom !== thisRoom) {
        updateRequest.childRequests.push(currentRoom.leave(client));
      } else if (thisRoom.playersInRoom.includes(client)) {
        return updateRequest;
      }

      thisRoom.playersInRoom.push(client);
      updateRequest.updateThisRoom = true;

      return updateRequest;
    };

    const sit = (client: WsClient, index: number) => {
      const updateRequest = updateRequestFactory();

      if (index < 0 || index > playersCount) return updateRequest;

      const isSpotBusy = thisRoom.players[index] !== null;
      if (isSpotBusy) return updateRequest;

      const currentSpot = thisRoom.players.findIndex((player) => player?.client === client);
      if (currentSpot !== -1) thisRoom.players[currentSpot] = null;

      thisRoom.players[index] = { client, isReady: false };
      updateRequest.updateThisRoom = true;
      updateRequest.updateRoomsList = true;

      const isFull = thisRoom.players.every((player) => player !== null);
      if (isFull) thisRoom.status = RoomStatus.Full;

      return updateRequest;
    };

    const kick = (client: WsClient, index: number) => {
      const updateRequest = updateRequestFactory();

      if (index < 0 || index > playersCount) return updateRequest;

      if (!(thisRoom.leader === client || thisRoom.players[index]?.client === client))
        return updateRequest;

      thisRoom.players[index] = null;
      thisRoom.status = RoomStatus.Waiting;

      updateRequest.updateRoomsList = true;
      updateRequest.updateThisRoom = true;

      for (const player of thisRoom.players) {
        if (player) player.isReady = false;
      }

      return updateRequest;
    };

    const ready = (client: WsClient) => {
      const updateRequest = updateRequestFactory();

      const player = thisRoom.players.find((player) => player?.client === client);
      if (!player || player.isReady) return updateRequest;

      player.isReady = true;
      updateRequest.updateThisRoom = true;

      if (!areAllPlayersReady()) return updateRequest;

      thisRoom.status = RoomStatus.Playing;
      updateRequest.updateRoomsList = true;

      for (const eventHandler of onRoomStartEventHandlers) {
        eventHandler(thisRoom);
      }

      return updateRequest;
    };

    const unready = (client: WsClient) => {
      const updateRequest = updateRequestFactory();

      const player = thisRoom.players.find((player) => player?.client === client);
      if (!player || !player.isReady || areAllPlayersReady()) return updateRequest;

      player.isReady = false;
      updateRequest.updateThisRoom = true;

      return updateRequest;
    };

    const end = (winnerIndex: number) => {
      const updateRequest = updateRequestFactory();

      for (const player of thisRoom.players) {
        if (player) player.isReady = false;
      }

      updateRequest.updateThisRoom = true;
      updateRequest.updateRoomsList = true;

      thisRoom.status = RoomStatus.Full;

      for (const player of thisRoom.playersInRoom) {
        player.send('end', { winnerIndex });
      }

      return updateRequest;
    };

    const sendRoomData = () => {
      const roomInfo = roomMapper(thisRoom);

      for (const client of thisRoom.playersInRoom) {
        client.send('roomData', roomInfo);
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
      ready,
      unready,
      end,
      sendRoomData
    };

    return thisRoom;
  };

  const getRoomsInfo = () => {
    const roomsInfo: WsRoom[] = rooms.map(roomMapper);

    return roomsInfo;
  };

  const sendCurrentRoomsList = () => {
    const roomsInfo = getRoomsInfo();

    for (const client of roomListSubscribers) {
      client.send('roomsList', roomsInfo);
    }
  };

  const getCurrentRoomsIds = () => rooms.map(({ id }) => id);

  const getRoomByClient = (client: WsClient) =>
    rooms.find((room) => room.playersInRoom.includes(client));
  const getRoomById = (id: string) => rooms.find((room) => room.id === id);

  const addRoom = (client: WsClient) => {
    const currentRoom = getRoomByClient(client);

    if (currentRoom) {
      const { update } = currentRoom.leave(client);
      update(false);
    }

    const currentRoomIds = getCurrentRoomsIds();

    let newId: string;
    do {
      newId = getRandomRoomId();
    } while (currentRoomIds.includes(newId));

    const newRoom = roomFactory(newId, client, playersCount);
    rooms.push(newRoom);

    sendCurrentRoomsList();
    return newId;
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

    const { update } = room.leave(client);

    update();
  };

  const sit = (client: WsClient, index: number) => {
    const room = getRoomByClient(client);

    const updateRequest = room?.sit(client, index);

    updateRequest?.update();
  };

  const kick = (client: WsClient, index: number) => {
    const room = getRoomByClient(client);

    const updateRequest = room?.kick(client, index);

    updateRequest?.update();
  };

  const subscribeRoomList = (client: WsClient) => {
    if (roomListSubscribers.includes(client)) return;

    roomListSubscribers.push(client);

    client.send('roomsList', getRoomsInfo());
  };

  const unsubscribeRoomList = (client: WsClient) => {
    const index = roomListSubscribers.findIndex((sc) => sc === client);
    if (index === -1) return;

    roomListSubscribers.splice(index, 1);
  };

  const ready = (client: WsClient) => {
    const room = getRoomByClient(client);
    const updateRequest = room?.ready(client);

    updateRequest?.update();
  };

  const unready = (client: WsClient) => {
    const room = getRoomByClient(client);
    const updateRequest = room?.unready(client);

    updateRequest?.update();
  };

  const end = (client: WsClient, winnerIndex: number) => {
    const room = getRoomByClient(client);
    const updateRequest = room?.end(winnerIndex);

    updateRequest?.update();
  };

  const onRoomStart = (callback: (room: Room) => void) => {
    onRoomStartEventHandlers.push(callback);
  };

  const getSubscriptionClientFromSocket = (socket: WebSocket) =>
    roomListSubscribers.find((client) => client.socket === socket);

  const getRoomClientFromSocket = (socket: WebSocket) => {
    let client: undefined | WsClient = undefined;

    rooms.find((room) => {
      client = room.playersInRoom.find((client) => client.socket === socket);
    });

    return client;
  };

  const manager: RoomManager = {
    addRoom,
    sit,
    kick,
    joinRoom,
    leaveRoom,
    subscribeRoomList,
    unsubscribeRoomList,
    ready,
    unready,
    end,
    onRoomStart,
    getRoomClientFromSocket,
    getSubscriptionClientFromSocket
  };

  return manager;
};
