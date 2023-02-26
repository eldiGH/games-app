<script lang="ts">
	import Kitchen from '@smui/snackbar/kitchen';
	import Snackbar, { Label } from '@smui/snackbar';
	import './Notification.module.scss';
	import { notificationStore, type Notification } from '$lib/stores';

	let kitchen: Kitchen;

	const pushNotification = ({ type, message }: Notification) => {
		kitchen?.push({
			props: { class: `snackbar--${type}` },
			label: message,
			dismissButton: true
		});
	};

	$: {
		if ($notificationStore) pushNotification($notificationStore);
	}
</script>

<Kitchen bind:this={kitchen} dismiss$class="material-icons" />
<Snackbar class="snackbar--success">
	<Label>That thing you tried to do actually worked, if you can believe it!</Label>
</Snackbar>
