import { type Static, Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

const registerRequestSchema = Type.Object({
	email: Type.String({ format: 'email' }),
	password: Type.String({ minLength: 8, maxLength: 20 }),
	nickname: Type.String({ minLength: 3, maxLength: 20 })
});

export type RegisterRequest = Static<typeof registerRequestSchema>;

export const registerRequestCompiledSchema = TypeCompiler.Compile(registerRequestSchema);

export interface RegisterResponse {
	token: string;
}
