import { Router, type NextFunction } from 'express';
import { AuthController, PlayersController } from './controllers/index';
import { authMiddleware, validationMiddlewareFactory } from './middlewares/index';
import type { Controller, EndpointCallback, Middleware, Req, Res } from './types/index';

const controllers: Controller[] = [AuthController, PlayersController];

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
