import { defineStore } from 'pinia';
import { ref } from 'vue';
import { UserdataApi } from '@/api/controllers/UserdataApi';
import { mapUserdataToZachetCard } from './mapper';
import type { ZachetCardData, UserdataResponse } from './types';

export const useZachetCardStore = defineStore('zachetCard', () => {
	const cards = ref<Record<number, ZachetCardData>>({});
	const loadingByUserId = ref<Record<number, boolean>>({});
	const errorByUserId = ref<Record<number, string | null>>({});

	async function fetchCard(userId: number, force = false): Promise<ZachetCardData | null> {
		logZachetCardStore('fetchCard called', { userId, force });

		if (!force && cards.value[userId]) {
			logZachetCardStore('return cached card', {
				userId,
				card: cards.value[userId],
			});

			return cards.value[userId];
		}

		loadingByUserId.value[userId] = true;
		errorByUserId.value[userId] = null;

		try {
			const response = await UserdataApi.getUser(userId);
			const data = response?.data as UserdataResponse | undefined;

			logZachetCardStore('raw response data', data);

			const items = Array.isArray(data?.items) ? data.items : [];
			const mappedCard = mapUserdataToZachetCard(items);

			cards.value[userId] = mappedCard;

			logZachetCardStore('card saved to store', {
				userId,
				card: mappedCard,
			});

			return mappedCard;
		} catch (error) {
			errorByUserId.value[userId] = 'Не удалось загрузить данные карты';
			errorZachetCardStore('fetchCard error', error);

			return null;
		} finally {
			loadingByUserId.value[userId] = false;
			logZachetCardStore('fetchCard finished', {
				userId,
				loading: loadingByUserId.value[userId],
				error: errorByUserId.value[userId],
			});
		}
	}

	return {
		cards,
		loadingByUserId,
		errorByUserId,
		fetchCard,
	};
});

function logZachetCardStore(message: string, payload?: unknown) {
	if (!import.meta.env.DEV) {
		return;
	}

	if (payload === undefined) {
		console.log('[ZachetCard][store]', message);
		return;
	}

	console.log('[ZachetCard][store]', message, payload);
}

function errorZachetCardStore(message: string, payload?: unknown) {
	if (!import.meta.env.DEV) {
		return;
	}

	if (payload === undefined) {
		console.error('[ZachetCard][store]', message);
		return;
	}

	console.error('[ZachetCard][store]', message, payload);
}
