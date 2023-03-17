import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './index.css';
import './variables.css';
import 'animate.css';
import { createPinia } from 'pinia';
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
	onNeedRefresh() {
		const isUpdate = confirm('Доступна новая версия приложения! Обновить?');
		if (isUpdate) {
			updateSW();
		}
	},
});

createApp(App).use(router).use(createPinia()).mount('#app');
