import type { RoomStatus } from './enums';
import type { PlayerWithRating } from './PlayerWithRating';

export interface WsRoom {
  id: string;
  time: number;
  status: RoomStatus;
  leader: string;
  players: ({ index: number; isReady: boolean } | null)[];
  playersInRoom: PlayerWithRating[];
}
