import '$lib/i18n';
import { waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';

export const prerender = false;
export const ssr = false;

export const load: LayoutLoad = async () => {
	await waitLocale();
};
