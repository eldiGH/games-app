import type { Friendship, Player } from '@prisma/client';

export type PlayerWithFriends = Player & { friendships: (Friendship & { friend: Player })[] };
