import { sveltekit } from '@sveltejs/kit/vite';

const plugin = await sveltekit();

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [plugin],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
};

export default config;
