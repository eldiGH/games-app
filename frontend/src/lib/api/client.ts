import type { ApiClientResponse, HttpMethod } from '$lib/types';
import { HttpStatus } from '@shared/types';
import { get } from 'svelte/store';
import urlJoin from 'url-join';
import config from '../../config.json';

const getStores = async () => {
  const { authStore, notificationStore, globalError } = await import('$lib/stores');

  return { authStore, notificationStore, globalError };
};

const dateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+?Z/;

const dateParser = (obj: Record<string | number | symbol, unknown>) => {
  for (const key in obj) {
    const value = obj[key];

    switch (typeof value) {
      case 'string':
        if (dateRegex.test(value)) {
          obj[key] = new Date(value);
        }
        break;
      case 'object':
        if (value !== null) dateParser(value as Record<string | number | symbol, unknown>);
        break;
    }
  }
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

    const { authStore, notificationStore, globalError } = await getStores();
    const { token } = get(authStore);

    if (token) headers.Authorization = `Bearer ${token}`;

    const apiPath = `${config.USE_HTTPS ? 'https://' : 'http://'}${config.API_URL}`;
    try {
      const res = await fetch(urlJoin(apiPath, controller, url), {
        method,
        body: finalBody,
        headers
      });

      let data;

      if (parseInt(res.headers.get('Content-Length') ?? '0') === 0) data = {};
      else {
        data = await res.json();
        dateParser(data);
      }

      if (res.status === HttpStatus.UNAUTHORIZED) {
        authStore.logout();
      }
      if (res.status >= 500) throw new Error('Received status 500');
      else if (res.status >= 400)
        return { data: undefined, error: { status: res.status, payload: data } };

      return { data, error: undefined };
    } catch (e) {
      notificationStore.pushError('Wystąpił błąd, spróbuj ponownie później');

      globalError.set(true);

      throw e;
    }
  };

  return {
    get: <T>(url: string) => myFetch<T>(url, 'GET'),
    post: <T>(url: string, reqBody: Record<string, unknown>) => myFetch<T>(url, 'POST', reqBody),
    delete: <T>(url: string) => myFetch<T>(url, 'DELETE')
  };
};
