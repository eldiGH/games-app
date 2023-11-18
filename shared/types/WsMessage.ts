import type { Coordinates } from './Coordinates';
import type { MoveData } from './MoveData';
import type { WsRoom } from './WsRoom';
import type { ShipDto } from './ships';

export type GetWsMessage<Type extends string, Data> = {
  type: Type;
  data: Data;
};

// Room Handling

export type WsSubscribeRoomList = GetWsMessage<'subscribeRoomsList', undefined>;
export type WsUnsubscribeRoomList = GetWsMessage<'unsubscribeRoomList', undefined>;

export type WsCreateRoom = GetWsMessage<'createRoom', undefined>;
export type WsRoomCreated = GetWsMessage<'roomCreated', string>;

export type WsRoomsList = GetWsMessage<'roomsList', WsRoom[]>;

export type WsJoinRoom = GetWsMessage<'joinRoom', string>;
export type WsRoomData = GetWsMessage<'roomData', WsRoom>;

export type WsSit = GetWsMessage<'sit', number>;
export type WsKick = GetWsMessage<'kick', number>;

export type WsReady = GetWsMessage<'ready', undefined>;
export type WsUnready = GetWsMessage<'unready', undefined>;

// Game Messages

export type WsMove = GetWsMessage<'move', MoveData>;
export type WsStart = GetWsMessage<'start', undefined>;

// Ship Messages

export type WsShipLayout = GetWsMessage<'shipLayout', ShipDto[]>;
export type WsShoot = GetWsMessage<'shoot', Coordinates>;

// Messages to client

export type AnyWsMessagesToClient =
  | WsRoomCreated
  | WsRoomsList
  | WsRoomData
  | WsMove
  | WsShoot
  | WsStart;

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
  | WsUnready
  | WsMove
  | WsShipLayout
  | WsShoot;

export type WsMessagesToServerType = AnyWsMessagesToServer['type'];
export type WsMessageToServer<Type extends WsMessagesToServerType> = Extract<
  AnyWsMessagesToServer,
  { type: Type }
>;
