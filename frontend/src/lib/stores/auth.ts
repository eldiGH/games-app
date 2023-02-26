import { loginRequest } from '$lib/api';
import type { ApiClientError } from '$lib/types';
import type { LoginRequest } from '@shared/schemas';
import { derived, writable } from 'svelte/store';
import { playerStore } from './player';

interface AuthStore {
	token: string | null;
}

const LOCAL_STORAGE_KEY = 'accessToken';

const createAuthStore = () => {
	const token = localStorage.getItem(LOCAL_STORAGE_KEY);

	const { subscribe, set } = writable<AuthStore>({ token });

	if (token) {
		playerStore.getPlayerData();
	}

	const logout = () => {
		set({ token: null });
		playerStore.set(undefined);
		localStorage.removeItem(LOCAL_STORAGE_KEY);
	};

	const login = async (payload: LoginRequest): Promise<ApiClientError | void> => {
		const { data, error } = await loginRequest(payload);

		if (error) return error;

		const { token, nickname } = data;
		localStorage.setItem(LOCAL_STORAGE_KEY, token);

		set({ token });
		playerStore.set({ nickname });
	};

	return { subscribe, logout, login };
};

export const authStore = createAuthStore();

export const isAuthed = derived(authStore, ($authStore) => !!$authStore.token);
