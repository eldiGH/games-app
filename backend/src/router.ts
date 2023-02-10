import { Router } from 'express';
import { AuthController } from './controllers';
import type { Controller } from './types/Controller';

const controllers: Controller[] = [AuthController];

export const router = Router();

for (const controller of controllers) {
	const controllerRouter = Router();

	for (const endpoint of controller.endpoints) {
		controllerRouter[endpoint.method](endpoint.path, endpoint.callback);
	}

	router.use(controller.path, controllerRouter);
}
