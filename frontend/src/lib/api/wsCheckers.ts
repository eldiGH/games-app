import { roomsExtendedClient } from '$lib/helpers';
import type { WsClientFactory } from '$lib/types';
import { wsControllerFactory } from './wsClient';

export interface WsCheckersClientMethods {
  move: () => void;
}

roomsExtendedClient(wsControllerFactory('checkers'));

export const wsCheckersClientFactory: WsClientFactory<WsCheckersClientMethods> = (wsClient) => {
  const connect = async () => {
    const client = await wsClient();

    const move = () => {
      ///
    };

    return { ...client, move };
  };

  return connect;
};

export const wsCheckersClient = wsCheckersClientFactory(
  roomsExtendedClient(wsControllerFactory('checkers'))
);

export type WsCheckersClient = Awaited<ReturnType<typeof wsCheckersClient>>;
