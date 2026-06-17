<script setup lang="ts">
import { computed, watch } from 'vue';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { useToolbar } from '@/store/toolbar';
import { useProfileStore } from '@/store/profile';
import { ZachetCard } from '@/modules/ZachetCard';

const toolbar = useToolbar();
const profileStore = useProfileStore();

toolbar.setup({
	title: 'Тест карты Zachёt',
});

const currentUserId = computed(() => profileStore.id ?? null);

watch(
	() => profileStore.id,
	userId => {
		logZachetCardDebugView('profileStore.id changed', { userId });
	},
	{ immediate: true }
);

function logZachetCardDebugView(message: string, payload?: unknown) {
	if (!import.meta.env.DEV) {
		return;
	}

	if (payload === undefined) {
		console.log('[ZachetCardDebugView]', message);
		return;
	}

	console.log('[ZachetCardDebugView]', message, payload);
}
</script>

<template>
	<IrdomLayout>
		<div class="zachet-card-debug">
			<h1 class="zachet-card-debug__title">Тест страницы карты Zachёt</h1>

			<div class="zachet-card-debug__meta">
				Текущий userId: <strong>{{ currentUserId ?? '—' }}</strong>
			</div>

			<div class="zachet-card-debug__content">
				<ZachetCard />
			</div>
		</div>
	</IrdomLayout>
</template>

<style scoped>
.zachet-card-debug {
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 24px;
}

.zachet-card-debug__title {
	margin: 0;
	font-size: 24px;
}

.zachet-card-debug__meta {
	font-size: 14px;
	opacity: 0.8;
}

.zachet-card-debug__content {
	width: 100%;
	max-width: 960px;
}
</style>
