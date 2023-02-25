import { loginRequestSchema, registerRequestSchema } from '@shared/schemas';
import { HttpStatus } from '@shared/types';
import { controller, endpointFactory } from '../helpers';
import { AuthService } from '../services';

export const AuthController = controller('/auth');
const endpoint = endpointFactory(AuthController);

endpoint(
	{
		name: 'register',
		path: '/register',
		method: 'post',
		validationSchema: registerRequestSchema
	},
	async (req, res) => {
		await AuthService.register(req.body);

		res.status(HttpStatus.CREATED).send();
	}
);

endpoint(
	{
		name: 'login',
		path: '/login',
		method: 'post',
		validationSchema: loginRequestSchema
	},
	async (req, res) => {
		const token = await AuthService.login(req.body);

		res.send({ token });
	}
);
