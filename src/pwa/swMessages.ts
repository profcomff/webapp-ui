import type { Pinia } from 'pinia';
import { useToastStore } from '@/store/toast';

const timetableCacheInvalidType = 'timetable-cache-invalid';

export const setupSwMessages = (pinia: Pinia) => {
	if (!('serviceWorker' in navigator)) {
		return;
	}

	const toastStore = useToastStore(pinia);
	navigator.serviceWorker.addEventListener('message', event => {
		if (event.data?.type !== timetableCacheInvalidType) {
			return;
		}
		toastStore.push({ title: 'Обновите страницу, данные могли устареть' });
	});
};
