import { db } from '../db';
import { PlayerNotFound } from '../errors';

const findPlayerById = async (id: number) => {
  const player = await db.player.findFirst({ where: { id } });

  if (!player) throw PlayerNotFound();

  return player;
};

export const PlayersService = { findPlayerById };
