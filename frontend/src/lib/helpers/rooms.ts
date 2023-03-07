import type { WsClient, WsConnect } from '$lib/types/WsClient';

const roomsExtendedClient = async (wsClient: WsClient) => {
	const connect = () => {};

	return { connect };
};
