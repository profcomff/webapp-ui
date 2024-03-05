<script setup lang="ts">
import AsyncContent from './AsyncContent.vue';
import { computed } from 'vue';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { useToolbar } from '@/store/toolbar';

const toolbar = useToolbar();

toolbar.setup({
	title: 'Сервисы',
});

const version = computed(() => import.meta.env.VITE_APP_VERSION);
</script>

<template>
	<IrdomLayout>
		<Suspense>
			<AsyncContent />

			<template #fallback> Загрузка... </template>
		</Suspense>
		<span v-if="version" class="version">Версия приложения: {{ version }}</span>
	</IrdomLayout>
</template>

<style scoped>
.version {
	opacity: 0.3;
	font-size: 12px;
}
</style>
