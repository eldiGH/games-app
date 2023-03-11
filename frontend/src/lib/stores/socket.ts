import type { WsConnectedBase } from '$lib/types';
import { writable } from 'svelte/store';

export const getWsClientStore = <T extends WsConnectedBase<unknown>>() => {
	const { subscribe, set } = writable<T | null>(null);

	const setClient = (client: T) => {
		set(client);
	};

	const clearClient = () => {
		set(null);
	};

	return { subscribe, setClient, clearClient };
};
