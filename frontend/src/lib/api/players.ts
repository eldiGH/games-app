import type { GetCurrentPlayerResponse } from '@shared/schemas';
import { getClient } from './client';

const authClient = getClient('players');

export const fetchPlayerDataRequest = () => authClient.get<GetCurrentPlayerResponse>('me');
