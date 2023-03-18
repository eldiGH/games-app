import type { PlayerWithRating, WsRoom } from '@shared/types';

export interface RoomPlayer extends PlayerWithRating {
  isReady: boolean;
}

export interface Room extends Omit<WsRoom, 'players'> {
  players: (RoomPlayer | null)[];
}
