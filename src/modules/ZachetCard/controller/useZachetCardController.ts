import { computed, onMounted, watch } from 'vue';
import { useProfileStore } from '@/store/profile';
import { useZachetCardStore } from './store';

interface UseZachetCardControllerProps {
	userId?: number;
}

export function useZachetCardController(props: UseZachetCardControllerProps) {
	const profileStore = useProfileStore();
	const zachetCardStore = useZachetCardStore();

	const resolvedUserId = computed(() => props.userId ?? profileStore.id ?? null);

	const card = computed(() => {
		const userId = resolvedUserId.value;

		if (!userId) return null;

		return zachetCardStore.cards[userId] ?? null;
	});

	const loading = computed(() => {
		const userId = resolvedUserId.value;

		if (!userId) return false;

		return Boolean(zachetCardStore.loadingByUserId[userId]);
	});

	const error = computed(() => {
		const userId = resolvedUserId.value;

		if (!userId) return 'Не найден id пользователя';

		return zachetCardStore.errorByUserId[userId] ?? null;
	});

	async function load(force = false) {
		const userId = resolvedUserId.value;

		logZachetCardController('load called', {
			userId,
			force,
		});

		if (!userId) {
			logZachetCardController('load skipped because userId is empty');
			return;
		}

		await zachetCardStore.fetchCard(userId, force);
	}

	async function reload() {
		logZachetCardController('reload called');
		await load(true);
	}

	onMounted(() => {
		logZachetCardController('controller mounted', {
			resolvedUserId: resolvedUserId.value,
		});

		void load();
	});

	watch(
		resolvedUserId,
		(nextUserId, prevUserId) => {
			logZachetCardController('resolvedUserId changed', {
				prevUserId,
				nextUserId,
			});

			if (nextUserId && nextUserId !== prevUserId) {
				void load();
			}
		},
		{ immediate: false }
	);

	return {
		card,
		loading,
		error,
		reload,
	};
}

function logZachetCardController(message: string, payload?: unknown) {
	if (!import.meta.env.DEV) {
		return;
	}

	if (payload === undefined) {
		console.log('[ZachetCard][controller]', message);
		return;
	}

	console.log('[ZachetCard][controller]', message, payload);
}
