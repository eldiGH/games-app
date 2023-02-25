import { writable, type Writable } from 'svelte/store';

export type FormReturn<Values, Schema> = {
	values: Writable<Values>;
	errors: Writable<Partial<Values>>;
	validate: Schema extends TSchema ? () => void : undefined;
	handleSubmit: (onSubmit: (data: Values) => void) => () => void;
};

export const form = <
	Schema extends TSchema,
	T extends Schema extends TSchema ? Static<Schema> : Record<string, unknown>
>(
	initialValues: T,
	schema?: TypeCheck<Schema>
): FormReturn<T, Schema> => {
	const values = writable(initialValues);
	const errors = writable({});

	const validate = (schema ? () => {} : undefined) as Schema extends TSchema
		? () => void
		: undefined;

	const handleSubmit = (onSubmit: (data: T) => void) => () => {};

	return { values, errors, handleSubmit, validate };
};

form({ email: '', password: '' });
