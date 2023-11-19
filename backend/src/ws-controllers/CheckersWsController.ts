import { GameType } from '@prisma/client';
import { messageFactory, rankingsClientTransformer, wsController } from '../helpers';
import { handleGames, handleRooms } from '../wsHandlers';
import { checkersControllerFactory } from '@shared/gameControllers';

export const CheckersWsController = wsController(
  '/checkers',
  rankingsClientTransformer(GameType.CHECKERS)
);
const message = messageFactory(CheckersWsController);

const roomsManager = handleRooms(message);

handleGames(message, roomsManager, GameType.CHECKERS, checkersControllerFactory);
