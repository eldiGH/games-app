import type { TypeCheck, ValueError } from '@sinclair/typebox/compiler';
import { ValidationError } from '../errors/index.js';
import type { Middleware } from '../types/index.js';

export const validationMiddlewareFactory =
	(compiledSchema: TypeCheck<never>): Middleware =>
	(req, _res, next) => {
		const errors: ValueError[] = [];

		for (const error of compiledSchema.Errors(req.body)) {
			errors.push(error);
		}

		if (!errors.length) return next();

		next(ValidationError(errors));
	};
