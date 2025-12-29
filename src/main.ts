import App from './App.vue';
import router from './router';

import './index.css';
import 'vuetify/styles';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { registerSW } from 'virtual:pwa-register';
import { vuetify } from './vuetify';
import { useToastStore } from '@/store/toast';
const pinia = createPinia();

const updateSW = registerSW({
	onNeedRefresh() {
		const isUpdate = confirm('Доступна новая версия приложения! Обновить?');
		if (isUpdate) {
			updateSW();
		}
	},
});

if ('serviceWorker' in navigator) {
	const toastStore = useToastStore(pinia);
	navigator.serviceWorker.addEventListener('message', (event) => {
		if (event.data?.type !== 'timetable-cache-invalid') {
			return;
		}
		toastStore.push({ title: 'Обновите страницу, данные могли устареть' });
	});
}

createApp(App).use(router).use(pinia).use(vuetify).mount('#app');
