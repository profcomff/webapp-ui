import App from './App.vue';
import router from './router';

import './index.css';
import 'vuetify/styles';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import { registerSW } from 'virtual:pwa-register';
import { aliases, md } from 'vuetify/iconsets/md';
import { md3 } from 'vuetify/blueprints';

const PkffLightTheme = {
	dark: false,
	colors: {
		background: 'rgb(255, 255, 255)',
		surface: 'rgb(0, 1, 76)',
	},
};

const vuetify = createVuetify({
	icons: {
		defaultSet: 'md',
		aliases,
		sets: {
			md,
		},
	},
	defaults: {
		VChip: {
			style: 'border-radius: 999px !important;',
		},
		VContainer: {
			style: 'max-width: 900px;',
		},
	},
	blueprint: md3,
	theme: {
		defaultTheme: 'PkffLightTheme',
		themes: {
			PkffLightTheme,
		},
	},
});
const pinia = createPinia();

const updateSW = registerSW({
	onNeedRefresh() {
		const isUpdate = confirm('Доступна новая версия приложения! Обновить?');
		if (isUpdate) {
			updateSW();
		}
	},
});

createApp(App).use(router).use(pinia).use(vuetify).mount('#app');
