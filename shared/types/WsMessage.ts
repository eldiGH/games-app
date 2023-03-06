import type { Coordinates } from './Coordinates';
import type { RoomInfo } from './RoomInfo';

export enum WsMessageType {
	Move = 'move',
	SubscribeRoomList = 'subscribeRoomsList',
	CreateRoom = 'createRoom',
	RoomsList = 'roomsList'
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

export type WsCreateRoom = GetWsMessage<WsMessageType.CreateRoom, undefined>;

export type WsRoomsList = GetWsMessage<WsMessageType.RoomsList, RoomInfo[]>;

export type WsMessage<Type extends WsMessageType | null> = Type extends WsMessageType.Move
	? WsMove
	: Type extends WsMessageType.SubscribeRoomList
	? WsSubscribeRoomList
	: Type extends WsMessageType.CreateRoom
	? WsCreateRoom
	: Type extends WsMessageType.RoomsList
	? WsRoomsList
	: GetWsMessage<never, undefined>;
