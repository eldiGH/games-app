import { RoomStatus } from '@shared/types';

export const getRoomStatusLabels = (status: RoomStatus): string => {
	switch (status) {
		case RoomStatus.Waiting:
			return 'Oczekuje';
		case RoomStatus.Full:
			return 'Pełny';
		case RoomStatus.Playing:
			return 'W trakcie';
	}
};
