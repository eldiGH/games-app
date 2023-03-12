import type { Coordinates } from './Coordinates';
import type { RoomInfo } from './RoomInfo';

export enum WsMessageType {
	Move = 'move',
	SubscribeRoomList = 'subscribeRoomsList',
	UnsubscribeRoomList = 'unsubscribeRoomList',
	CreateRoom = 'createRoom',
	RoomCreated = 'roomCreated',
	RoomsList = 'roomsList',
	JoinRoom = 'joinRoom',
	RoomData = 'roomData',
	Sit = 'sit'
}

export type GetWsMessage<Type extends WsMessageType, Data> = {
	type: Type;
	data: Data;
};

export type WsMove = GetWsMessage<
	WsMessageType.Move,
	{
		from: Coordinates;
		to: Coordinates;
	}
>;

export type WsSubscribeRoomList = GetWsMessage<WsMessageType.SubscribeRoomList, undefined>;
export type WsUnsubscribeRoomList = GetWsMessage<WsMessageType.UnsubscribeRoomList, undefined>;

export type WsCreateRoom = GetWsMessage<WsMessageType.CreateRoom, undefined>;
export type WsRoomCreated = GetWsMessage<WsMessageType.RoomCreated, string>;

export type WsRoomsList = GetWsMessage<WsMessageType.RoomsList, RoomInfo[]>;

export type WsJoinRoom = GetWsMessage<WsMessageType.JoinRoom, string>;
export type WsRoomData = GetWsMessage<WsMessageType.RoomData, RoomInfo>;

export type WsSit = GetWsMessage<WsMessageType.Sit, number>;

export type WsAnyMessage =
	| WsMove
	| WsSubscribeRoomList
	| WsUnsubscribeRoomList
	| WsCreateRoom
	| WsRoomCreated
	| WsRoomsList
	| WsJoinRoom
	| WsRoomData
	| WsSit;

export type WsMessage<Type extends WsMessageType | null> = Type extends WsMessageType.Move
	? WsMove
	: Type extends WsMessageType.SubscribeRoomList
	? WsSubscribeRoomList
	: Type extends WsMessageType.UnsubscribeRoomList
	? WsUnsubscribeRoomList
	: Type extends WsMessageType.CreateRoom
	? WsCreateRoom
	: Type extends WsMessageType.RoomCreated
	? WsRoomCreated
	: Type extends WsMessageType.RoomsList
	? WsRoomsList
	: Type extends WsMessageType.JoinRoom
	? WsJoinRoom
	: Type extends WsMessageType.RoomData
	? WsRoomData
	: Type extends WsMessageType.Sit
	? WsSit
	: GetWsMessage<never, undefined>;
