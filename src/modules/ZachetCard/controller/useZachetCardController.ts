import { computed, onMounted, ref, watch } from 'vue';
import { useProfileStore } from '@/store/profile';
import { AuthApi } from '@/api';
import { useZachetCardStore } from './store';

interface UseZachetCardControllerProps {
	userId?: number;
}

export function useZachetCardController(props: UseZachetCardControllerProps) {
	const profileStore = useProfileStore();
	const zachetCardStore = useZachetCardStore();

	const resolvedUserId = ref<number | null>(props.userId ?? profileStore.id ?? null);

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

	async function ensureUserId(): Promise<number | null> {
		if (props.userId) {
			logZachetCardController('using userId from props', { userId: props.userId });
			resolvedUserId.value = props.userId;
			return props.userId;
		}

		if (profileStore.id) {
			logZachetCardController('using userId from profileStore', { userId: profileStore.id });
			resolvedUserId.value = profileStore.id;
			return profileStore.id;
		}

		try {
			logZachetCardController('profileStore.id is empty, requesting AuthApi.getMe');

			const { data: me } = await AuthApi.getMe([
				'auth_methods',
				'groups',
				'indirect_groups',
				'session_scopes',
				'user_scopes',
			]);

			if (!me?.id) {
				logZachetCardController('AuthApi.getMe returned empty id', { me });
				return null;
			}

			profileStore.id = me.id;
			resolvedUserId.value = me.id;

			logZachetCardController('userId resolved from AuthApi.getMe', { userId: me.id });

			return me.id;
		} catch (error) {
			errorZachetCardController('failed to resolve userId via AuthApi.getMe', error);
			return null;
		}
	}

	async function load(force = false) {
		logZachetCardController('load called', {
			userIdFromProps: props.userId,
			userIdFromStore: profileStore.id,
			resolvedUserId: resolvedUserId.value,
			force,
		});

		const userId = await ensureUserId();

		if (!userId) {
			logZachetCardController('load skipped because userId is empty after ensureUserId');
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
			userIdFromProps: props.userId,
			userIdFromStore: profileStore.id,
			resolvedUserId: resolvedUserId.value,
		});

		void load();
	});

	watch(
		() => props.userId,
		nextUserId => {
			if (nextUserId) {
				logZachetCardController('props.userId changed', { nextUserId });
				resolvedUserId.value = nextUserId;
				void load();
			}
		}
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

function errorZachetCardController(message: string, payload?: unknown) {
	if (!import.meta.env.DEV) {
		return;
	}

	if (payload === undefined) {
		console.error('[ZachetCard][controller]', message);
		return;
	}

	console.error('[ZachetCard][controller]', message, payload);
}
