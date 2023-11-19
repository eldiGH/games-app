import type { WebSocket } from 'ws';
import { roomsManagerFactory, type RoomManager, type WsMessageHandler } from '../helpers';
import type { WsRankingsClient } from '../types';

export const handleRooms = (
  message: WsMessageHandler<WsRankingsClient>,
  playersCount = 2
): RoomManager => {
  const roomsManager = roomsManagerFactory(playersCount);

  function unsubscribeCleanup(this: WebSocket) {
    const client = roomsManager.getSubscriptionClientFromSocket(this);
    if (!client) return;

    roomsManager.unsubscribeRoomList(client);
  }

  function leaveRoomCleanup(this: WebSocket) {
    const client = roomsManager.getRoomClientFromSocket(this);
    if (!client) return;

    roomsManager.leaveRoom(client);
  }

  message('subscribeRoomsList', (client) => {
    roomsManager.subscribeRoomList(client);

    client.addSocketEventListenerOnce('close', unsubscribeCleanup);
  });

  message('unsubscribeRoomList', (client) => {
    roomsManager.unsubscribeRoomList(client);
  });

  message('createRoom', (client) => {
    const newId = roomsManager.addRoom(client);

    client.send('roomCreated', newId);

    client.addSocketEventListenerOnce('close', leaveRoomCleanup);
  });

  message('joinRoom', (client, id) => {
    roomsManager.joinRoom(client, id);

    client.addSocketEventListenerOnce('close', leaveRoomCleanup);
  });

  message('sit', (client, index) => {
    roomsManager.sit(client, index);
  });

  message('kick', (client, index) => {
    roomsManager.kick(client, index);
  });

  message('ready', (client) => {
    roomsManager.ready(client);
  });

  message('unready', (client) => {
    roomsManager.unready(client);
  });

  return roomsManager;
};
