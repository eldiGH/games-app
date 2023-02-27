import { writable } from 'svelte/store';

export type NotificationType = 'success' | 'error';

export interface Notification {
	type: NotificationType;
	message: string;
}

const createNotificationStore = () => {
	const { subscribe, set } = writable<Notification | null>(null);

	const pushSuccess = (message: string) => {
		set({ message, type: 'success' });
	};

	const pushError = (message: string) => {
		set({ message, type: 'error' });
	};

	return { subscribe, pushSuccess, pushError };
};

export const notificationStore = createNotificationStore();
