import type { RoomStatus } from './enums';
import type { PlayerWithRating } from './PlayerWithRating';

export interface RoomInfo {
	id: string;
	time: number;
	status: RoomStatus;
	leader: string;
	players: (number | null)[];
	playersInRoom: PlayerWithRating[];
}
