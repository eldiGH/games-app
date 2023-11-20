import { GameType } from '@prisma/client';
import { messageFactory, rankingsClientTransformer, wsController } from '../helpers';
import { handleGames, handleRooms } from '../wsHandlers';
import { chessControllerFactory } from '@shared/gameControllers';

export const ChessWsController = wsController('/chess', rankingsClientTransformer(GameType.CHESS));
const message = messageFactory(ChessWsController);

const roomsManager = handleRooms(message);

handleGames(message, roomsManager, GameType.CHESS, chessControllerFactory);
