import type { ApiClientResponse, HttpMethod } from '$lib/types';
import urlJoin from 'url-join';
import config from '../../config.json';

let authToken: string | null;

const subscribeToken = async () => {
	const { authStore } = await import('$lib/stores');

	authStore.subscribe(({ token }) => {
		if (token) authToken = `Bearer ${token}`;
		else authToken = null;
	});
};

export const getClient = (controller: string) => {
	const myFetch = async <T>(
		url: string,
		method: HttpMethod,
		reqBody?: Record<string, unknown>
	): Promise<ApiClientResponse<T>> => {
		const finalBody = reqBody ? JSON.stringify(reqBody) : undefined;

		const res = await fetch(urlJoin(config.API_URL, controller, url), {
			method,
			body: finalBody,
			headers: {
				'Content-Type': 'application/json',
				...(authToken ? { Authorization: authToken } : undefined)
			}
		});

		const data = await res.json();

		if (res.status >= 400) return { data: undefined, error: { status: res.status, payload: data } };

		return { data, error: undefined };
	};

	return {
		get: <T>(url: string) => myFetch<T>(url, 'GET'),
		post: <T>(url: string, reqBody: Record<string, unknown>) => myFetch<T>(url, 'POST', reqBody),
		delete: <T>(url: string) => myFetch<T>(url, 'DELETE')
	};
};

subscribeToken();
