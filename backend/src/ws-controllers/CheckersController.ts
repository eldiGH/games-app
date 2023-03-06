import { handleRooms, messageFactory, wsController } from '../helpers';

export const CheckersController = wsController('/checkers');
const message = messageFactory(CheckersController);

handleRooms(message);
