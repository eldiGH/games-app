import type { PlayerWithFriends } from '@shared/types';
import { db } from '../db';
import { PlayerNotFound } from '../errors';

const findPlayerById = async (id: number) => {
  const player = await db.player.findFirst({ where: { id } });

  if (!player) throw PlayerNotFound();

  return player;
};

const getPlayerWithFriends = async (id: number): Promise<PlayerWithFriends> => {
  const player = await db.player.findFirst({
    where: { id },
    include: { friendships: { include: { friend: true } } }
  });

  if (!player) throw PlayerNotFound();

  return player;
};

export const PlayersService = { findPlayerById, getPlayerWithFriends };
