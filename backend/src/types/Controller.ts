import type { Endpoint } from './Endpoint';

export interface Controller {
	path: string;
	endpoints: Endpoint[];
}
