import { writable } from 'svelte/store';

const createSidebarStore = () => {
	const { set, subscribe, update } = writable(true);

	const toggle = () => {
		update((val) => !val);
	};

	return { set, subscribe, update, toggle };
};

export const sidebarStore = createSidebarStore();
