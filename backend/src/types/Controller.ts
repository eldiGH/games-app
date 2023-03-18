import type { Player } from '@prisma/client';
import type { HttpMethods } from './HttpMethod';
import type { Req } from './Req';
import type { Res } from './Res';
import type { Schema } from 'yup';

export interface Controller {
  path: string;
  endpoints: Endpoint[];
}

export interface EndpointConfig<MySchema extends Schema = never> {
  name: string;
  path: string;
  method: HttpMethods;
  validationSchema?: MySchema;
}

export interface AuthEndpointConfig<MySchema extends Schema = never, Auth extends boolean = boolean>
  extends EndpointConfig<MySchema> {
  auth: Auth;
}

export type EndpointCallback<ReqBody = never, Auth extends boolean = boolean> = (
  req: Req<ReqBody>,
  res: Res<Auth extends true ? { player: Player } : Record<string, unknown>>
) => Promise<void>;

export interface Endpoint extends AuthEndpointConfig {
  callback: EndpointCallback;
}
