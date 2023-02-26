import { writable } from 'svelte/store';

export interface Notification {
	type: 'success';
	message: string;
}

const createNotificationStore = () => {
	const { subscribe, set } = writable<Notification | null>(null);

	const push = (notification: Notification) => {
		set(notification);
	};

	return { subscribe, push };
};

export const notificationStore = createNotificationStore();
