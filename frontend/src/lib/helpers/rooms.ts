import type { WsClientFactory } from '$lib/types';
import type { RoomInfo } from '@shared/types';
import { writable, type Readable } from 'svelte/store';

interface RoomsWsConnect {
  join: (id: string) => Promise<void>;
  subscribeList: () => void;
  unsubscribeList: () => void;
  createRoom: () => Promise<string>;
  sit: (index: number) => Promise<void>;
  kick: (index: number) => Promise<void>;
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
        send('joinRoom', id);

        const roomData = await waitForMessage('roomData');
        room.set(roomData);

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

        await waitForMessage('roomCreated');
      },

      kick: async (index: number) => {
        send('kick', index);

        await waitForMessage('roomData');
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
