import { fetchPlayerDataRequest } from '$lib/api';
import { derived, writable } from 'svelte/store';

export interface PlayerStore {
	nickname: string;
}

const createPlayerStore = () => {
	const { set, subscribe } = writable<PlayerStore | undefined | null>(undefined);

	const getPlayerData = async () => {
		set(null);
		const { data, error } = await fetchPlayerDataRequest();

		if (error) {
			set(undefined);
			return;
		}

		set(data);
	};

	return { set, subscribe, getPlayerData };
};

export const playerStore = createPlayerStore();

export const isPlayerDataLoading = derived(playerStore, ($playerStore) => $playerStore === null);
