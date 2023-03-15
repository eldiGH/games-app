import { roomsManagerFactory, type RoomManager, type WsMessageHandler } from '../helpers';

export const handleRooms = (message: WsMessageHandler, playersCount = 2): RoomManager => {
  const roomsManager = roomsManagerFactory(playersCount);

  message('subscribeRoomsList', (client) => {
    roomsManager.subscribeRoomList(client);

    client.onClose(() => {
      roomsManager.unsubscribeRoomList(client);
    });
  });

  message('unsubscribeRoomList', (client) => {
    roomsManager.unsubscribeRoomList(client);
  });

  message('createRoom', (client) => {
    const newId = roomsManager.addRoom(client);

    client.send('roomCreated', newId);

    client.onClose(() => {
      roomsManager.leaveRoom(client);
    });
  });

  message('joinRoom', (client, id) => {
    roomsManager.joinRoom(client, id);

    client.onClose(() => {
      roomsManager.leaveRoom(client);
    });
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
