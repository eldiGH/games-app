import type { Static, TSchema } from '@sinclair/typebox';
import type { Controller } from '../types/Controller';
import type {
	AuthEndpointConfig,
	Endpoint,
	EndpointCallback,
	EndpointConfig
} from '../types/Endpoint';

export const controller = (path: string): Controller => ({ path, endpoints: [] });

export const endpointFactory = (controller: Controller) => {
	return <Schema extends TSchema, Auth extends boolean = false>(
		endpointOptions: EndpointConfig<Schema> | AuthEndpointConfig<Schema, Auth>,
		callback: EndpointCallback<Static<Schema>, Auth>
	): Endpoint => {
		const endpoint = { auth: false, ...endpointOptions, callback } as Endpoint;

		controller.endpoints.push(endpoint);

		return endpoint;
	};
};
