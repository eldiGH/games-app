import { GameType } from '@prisma/client';
import { messageFactory, wsController } from '../helpers';
import { handleGames, handleRooms } from '../wsHandlers';
import { checkersControllerFactory } from '@shared/gameControllers';

export const CheckersWsController = wsController('/checkers');
const message = messageFactory(CheckersWsController);

const roomsManager = handleRooms(message);

handleGames(message, roomsManager, GameType.CHECKERS, checkersControllerFactory);
