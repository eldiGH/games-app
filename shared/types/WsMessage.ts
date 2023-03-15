import type { Coordinates } from './Coordinates';
import type { RoomInfo } from './RoomInfo';

export type GetWsMessage<Type extends string, Data> = {
  type: Type;
  data: Data;
};

// Room Handling
export type WsSubscribeRoomList = GetWsMessage<'subscribeRoomsList', undefined>;
export type WsUnsubscribeRoomList = GetWsMessage<'unsubscribeRoomList', undefined>;

export type WsCreateRoom = GetWsMessage<'createRoom', undefined>;
export type WsRoomCreated = GetWsMessage<'roomCreated', string>;

export type WsRoomsList = GetWsMessage<'roomsList', RoomInfo[]>;

export type WsJoinRoom = GetWsMessage<'joinRoom', string>;
export type WsRoomData = GetWsMessage<'roomData', RoomInfo>;

export type WsSit = GetWsMessage<'sit', number>;
export type WsKick = GetWsMessage<'kick', number>;

export type WsReady = GetWsMessage<'ready', undefined>;
export type WsUnready = GetWsMessage<'unready', undefined>;

// Game Handling
export type WsMove = GetWsMessage<'move', Coordinates>;

export type WsGameStarted = GetWsMessage<'gameStarted', number>;

// Messages to client
export type AnyWsMessagesToClient =
  | WsMove
  | WsRoomCreated
  | WsRoomsList
  | WsRoomData
  | WsGameStarted;

export type WsMessagesToClientType = AnyWsMessagesToClient['type'];
export type WsMessageToClient<Type extends WsMessagesToClientType> = Extract<
  AnyWsMessagesToClient,
  { type: Type }
>;

// Messages to server
export type AnyWsMessagesToServer =
  | WsSubscribeRoomList
  | WsUnsubscribeRoomList
  | WsJoinRoom
  | WsCreateRoom
  | WsSit
  | WsKick
  | WsReady
  | WsUnready;

export type WsMessagesToServerType = AnyWsMessagesToServer['type'];
export type WsMessageToServer<Type extends WsMessagesToServerType> = Extract<
  AnyWsMessagesToServer,
  { type: Type }
>;
