import { loginRequestCompiledSchema, registerRequestCompiledSchema } from '@shared/schemas';
import { controller, endpointFactory } from '../helpers/controllers';
import { AuthService } from '../services/AuthService';
import { HttpStatus } from '../types/enums/HttpStatus';

export const AuthController = controller('/auth');
const endpoint = endpointFactory(AuthController);

endpoint(
	{
		name: 'register',
		path: '/register',
		method: 'post',
		validationSchema: registerRequestCompiledSchema
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
		validationSchema: loginRequestCompiledSchema
	},
	async (req, res) => {
		const token = await AuthService.login(req.body);

		res.send({ token });
	}
);
