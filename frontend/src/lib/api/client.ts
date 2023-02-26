import type { ApiClientResponse, HttpMethod } from '$lib/types';
import { HttpStatus } from '@shared/types';
import { get } from 'svelte/store';
import urlJoin from 'url-join';
import config from '../../config.json';
import { pushNotification } from '$lib/components/Notification/Notification.svelte';

const getAuthStore = async () => {
	const { authStore, notificationStore } = await import('$lib/stores');

	return { authStore, notificationStore };
};

export const getClient = (controller: string) => {
	const myFetch = async <T>(
		url: string,
		method: HttpMethod,
		reqBody?: Record<string, unknown>
	): Promise<ApiClientResponse<T>> => {
		const finalBody = reqBody ? JSON.stringify(reqBody) : undefined;

		const headers: Record<string, string> = {
			'Content-Type': 'application/json'
		};

		const { authStore, notificationStore } = await getAuthStore();
		const { token } = get(authStore);

		if (token) headers.Authorization = `Bearer ${token}`;

		try {
			const res = await fetch(urlJoin(config.API_URL, controller, url), {
				method,
				body: finalBody,
				headers
			});

			const data = await res.json();

			if (res.status === HttpStatus.UNAUTHORIZED) {
				authStore.logout();
			}
			if (res.status >= 400)
				return { data: undefined, error: { status: res.status, payload: data } };

			return { data, error: undefined };
		} catch (e) {
			notificationStore.push({});

			throw e;
		}
	};

	return {
		get: <T>(url: string) => myFetch<T>(url, 'GET'),
		post: <T>(url: string, reqBody: Record<string, unknown>) => myFetch<T>(url, 'POST', reqBody),
		delete: <T>(url: string) => myFetch<T>(url, 'DELETE')
	};
};
