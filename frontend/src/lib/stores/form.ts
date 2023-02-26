import { loginRequestSchema } from '@shared/schemas';
import { get, writable, type Writable } from 'svelte/store';
import { ValidationError, type InferType, type Schema } from 'yup';

export type FormReturn<Values, MySchema> = {
	values: Writable<Values>;
	errors: Writable<Partial<Values>>;
	validate: MySchema extends Schema ? () => Promise<void> : undefined;
	submitHandler: (onSubmit: (data: Values) => void) => () => void;
};

export const form = <
	T extends MySchema extends Schema ? InferType<MySchema> : Record<string, unknown>,
	MySchema extends Schema | undefined = undefined
>(
	initialValues: T,
	schema?: MySchema
): FormReturn<T, MySchema> => {
	const values = writable(initialValues);
	const errors = writable({});

	const validate = (
		schema
			? async () => {
					try {
						return await schema.validate(get(values));
					} catch (e) {
						if (!(e instanceof ValidationError)) throw e;

						console.log(e);
					}
			  }
			: undefined
	) as MySchema extends Schema ? () => Promise<void> : undefined;

	const submitHandler = (onSubmit: (data: T) => void) => () => {
		if (validate) validate();

		if (Object.keys(get(errors)).length === 0) onSubmit(get(values));
	};

	return { values, errors, submitHandler, validate };
};

const { validate } = form({ email: '', password: '' }, loginRequestSchema);
