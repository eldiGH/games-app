import { Router, type NextFunction } from 'express';
import { AuthController } from './controllers';
import { authMiddleware } from './middlewares/authMiddleware';
import { validationMiddlewareFactory } from './middlewares/validationMiddleware';
import type { Controller } from './types/Controller';
import type { EndpointCallback } from './types/Endpoint';
import type { Middleware } from './types/Middleware';
import type { Req } from './types/Req';
import type { Res } from './types/Res';

const controllers: Controller[] = [AuthController];

export const router = Router();

const catchErrors =
	(callback: EndpointCallback) => async (req: Req, res: Res, next: NextFunction) => {
		try {
			await callback(req, res);
		} catch (e) {
			next(e);
		}
	};

for (const controller of controllers) {
	const controllerRouter = Router();

	for (const endpoint of controller.endpoints) {
		const middlewares: Middleware[] = [];

		if (endpoint.auth) middlewares.push(authMiddleware);

		if (endpoint.validationSchema)
			middlewares.push(validationMiddlewareFactory(endpoint.validationSchema));

		controllerRouter[endpoint.method](
			endpoint.path,
			...middlewares,
			catchErrors(endpoint.callback)
		);
	}

	router.use(controller.path, controllerRouter);
}
