import { messageFactory, wsController } from '../helpers';

export const CheckersController = wsController('/checkers');
const message = messageFactory(CheckersController);

message('move', (data) => {
	console.log(data);
});
