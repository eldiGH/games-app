import type { Schema, ValidationError as YupValidationError } from 'yup';
import { ValidationError } from '../errors/index.js';
import type { Middleware } from '../types/index.js';

export const validationMiddlewareFactory =
	(schema: Schema): Middleware =>
	async (req, _res, next) => {
		try {
			await schema.validate(req.body, { abortEarly: false });
			next();
		} catch (e) {
			next(ValidationError(e as YupValidationError));
		}
	};
