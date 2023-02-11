import { type Static, Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

const loginRequestSchema = Type.Object({
	email: Type.String({ format: 'email' }),
	password: Type.String()
});

export type LoginRequest = Static<typeof loginRequestSchema>;

export const loginRequestCompiledSchema = TypeCompiler.Compile(loginRequestSchema);

export interface LoginResponse {
	token: string;
}
