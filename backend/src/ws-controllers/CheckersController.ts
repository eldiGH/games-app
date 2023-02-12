import { messageFactory, wsController } from '../helpers';

export const CheckersController = wsController('/checkers');
const message = messageFactory(CheckersController);

message('test', (data, isBinary) => {
	console.log(data);
	console.log(isBinary);
});
