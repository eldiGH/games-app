import { getLocaleFromNavigator, init, register } from 'svelte-i18n';

register('pl', () => import('@shared/locales/pl.json'));
register('en', () => import('@shared/locales/en.json'));

init({
	fallbackLocale: 'pl',
	initialLocale: getLocaleFromNavigator()
});
