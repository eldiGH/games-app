import type { HttpMethods } from './HttpMethod';
import type { TypeCheck } from '@sinclair/typebox/compiler';
import type { TSchema } from '@sinclair/typebox';
import type { Req } from './Req';
import type { Res } from './Res';
import type { Player } from '@prisma/client';

export interface EndpointConfig<Schema extends TSchema = never> {
	name: string;
	path: string;
	method: HttpMethods;
	validationSchema?: TypeCheck<Schema>;
}

export interface AuthEndpointConfig<Schema extends TSchema = never, Auth extends boolean = boolean>
	extends EndpointConfig<Schema> {
	auth: Auth;
}

export type EndpointCallback<ReqBody = never, Auth extends boolean = boolean> = (
	req: Req<ReqBody>,
	res: Res<Auth extends true ? Player : Record<string, unknown>>
) => Promise<void>;

export interface Endpoint extends AuthEndpointConfig {
	callback: EndpointCallback;
}
