import type { WsClient, WsConnect } from '$lib/types/WsClient';
import type { WsMessage, WsMessageType } from '@shared/types';
import { get } from 'svelte/store';
import urljoin from 'url-join';
import config from '../../config.json';

const getStores = async () => {
	const { authStore } = await import('$lib/stores');

	return { authStore };
};

export const getWsClient = (controller: string): WsClient => {
	const apiPath = `${config.USE_WSS ? 'wss://' : 'ws://'}${config.API_URL}`;
	const url = urljoin(apiPath, controller);

	const connect = async () => {
		const { authStore } = await getStores();

		const token = get(authStore).token;

		if (!token) throw new Error('no token');

		const accessToken = `Bearer ${token}`;

		const socket = new WebSocket(`${url}?accessToken=${accessToken}`);

		socket.onmessage = (event) => {
			console.log(event);
		};

		const send = <T extends WsMessageType>(type: T, data: WsMessage<T>['data']) => {
			const payload = JSON.stringify({ type, data });

			socket.send(payload);
		};

		return { send, socket };
	};

	return { connect };
};
