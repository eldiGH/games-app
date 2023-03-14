import { messageFactory, wsController } from '../helpers';
import { handleRooms } from '../wsHandlers';

export const CheckersController = wsController('/checkers');
const message = messageFactory(CheckersController);

handleRooms(message);
