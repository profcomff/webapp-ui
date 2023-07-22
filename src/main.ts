import App from './App.vue';
import router from './router';

import './variables.css';
import './index.css';
import 'vuetify/styles';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import { registerSW } from 'virtual:pwa-register';
import { aliases, md } from 'vuetify/iconsets/md';
import { md3 } from 'vuetify/blueprints';

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
		defaultTheme: 'customTheme',
		themes: {
			customTheme: {
				colors: {
					primary: '#1a237e',
					secondary: '#1a237e',
				},
			},
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
