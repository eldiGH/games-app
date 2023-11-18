import type { Room, WsClientFactory } from '$lib/types';
import { RoomStatus, type WsRoom } from '@shared/types';
import { get, writable, type Readable } from 'svelte/store';

export interface RoomsWsConnect {
  join: (id: string) => Promise<void>;
  subscribeList: () => void;
  unsubscribeList: () => void;
  createRoom: () => Promise<string>;
  sit: (index: number) => Promise<void>;
  kick: (index: number) => Promise<void>;
  ready: () => Promise<void>;
  unready: () => Promise<void>;
  onRoomStart: (callback: () => void) => void;
  roomsList: Readable<Room[] | null>;
  room: Readable<Room | null>;
}

export interface RoomsWsWithWinner extends RoomsWsConnect {
  winnerIndex: number | null;
}

const roomMapper = (room: WsRoom): Room => {
  const { players, ...roomData } = room;

  const parsedPlayers = players.map((player) =>
    player ? { ...roomData.playersInRoom[player.index], isReady: player.isReady } : null
  );

  return { ...roomData, players: parsedPlayers };
};

export const roomsExtendedClient: WsClientFactory<RoomsWsConnect> = (wsClient) => {
  const connect = async () => {
    const client = await wsClient();
    const { send, addMessageListener, removeMessageListener, waitForMessage } = client;

    const onRoomStartListeners: (() => void)[] = [];

    const roomsList = writable<Room[] | null>(null);
    const room = writable<Room | null>(null);

    const refreshRoomsListCallback = (data: WsRoom[]) => {
      roomsList.set(data.map(roomMapper));
    };

    const refreshRoomCallback = (data: WsRoom) => {
      if (data.status === RoomStatus.Playing && get(room)?.status !== RoomStatus.Playing) {
        for (const callback of onRoomStartListeners) {
          callback();
        }
      }

      room.set(roomMapper(data));
    };

    const additionalMethods = {
      join: async (id: string) => {
        send('joinRoom', id);

        const roomData = await waitForMessage('roomData');
        room.set(roomMapper(roomData));

        addMessageListener('roomData', refreshRoomCallback);
      },

      subscribeList: () => {
        send('subscribeRoomsList', undefined);

        addMessageListener('roomsList', refreshRoomsListCallback);
      },

      unsubscribeList: () => {
        send('unsubscribeRoomList', undefined);

        removeMessageListener(refreshRoomsListCallback);
        roomsList.set(null);
      },

      createRoom: async () => {
        send('createRoom', undefined);

        return await waitForMessage('roomCreated');
      },

      sit: async (index: number) => {
        send('sit', index);

        await waitForMessage('roomData');
      },

      kick: async (index: number) => {
        send('kick', index);

        await waitForMessage('roomData');
      },

      ready: async () => {
        send('ready', undefined);

        await waitForMessage('roomData');
      },

      unready: async () => {
        send('unready', undefined);

        await waitForMessage('roomData');
      },

      onRoomStart: (callback: () => void) => {
        onRoomStartListeners.push(callback);
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
