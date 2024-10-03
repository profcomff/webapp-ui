import App from './App.vue';
import router from './router';

import './index.css';
import 'vuetify/styles';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { registerSW } from 'virtual:pwa-register';
import { vuetify } from './vuetify';
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
