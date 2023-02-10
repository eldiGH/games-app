import { AuthService } from '../services/AuthService';
import type { Controller } from '../types/Controller';
import type { Endpoint } from '../types/Endpoint';
import { HttpStatus } from '../types/enums/HttpStatus';

const register: Endpoint = {
	path: '/register',
	method: 'post',
	callback: async (req, res) => {
		await AuthService.register(req.body);

		res.sendStatus(HttpStatus.CREATED);
	}
};

const login: Endpoint = {
	path: '/login',
	method: 'post',
	callback: async (req, res) => {
		const token = await AuthService.login(req.body);

		res.send({ token });
	}
};

export const AuthController: Controller = { path: '/auth', endpoints: [register, login] };
