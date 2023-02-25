import { loginRequest } from '$lib/api';
import type { ApiClientError } from '$lib/types';
import type { LoginRequest } from '@shared/schemas';
import { derived, writable } from 'svelte/store';

interface AuthStore {
	token: string | null;
}

const LOCAL_STORAGE_KEY = 'accessToken';

const createAuthStore = () => {
	const token = localStorage.getItem(LOCAL_STORAGE_KEY);

	const { subscribe, set } = writable<AuthStore>({ token });

	const logout = () => {
		set({ token: null });
		localStorage.removeItem(LOCAL_STORAGE_KEY);
	};

	const login = async (payload: LoginRequest): Promise<ApiClientError | void> => {
		const { data, error } = await loginRequest(payload);

		if (error) return error;

		localStorage.setItem(LOCAL_STORAGE_KEY, data.token);

		set({ token });
	};

	return { subscribe, logout, login };
};

export const authStore = createAuthStore();

export const isAuthed = derived(authStore, ($authStore) => !!$authStore.token);
