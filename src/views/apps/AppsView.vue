<script setup lang="ts">
import AsyncContent from './AsyncContent.vue';
import { computed } from 'vue';
import IrdomLayout from '@/components/IrdomLayout.vue';

const version = computed(() => import.meta.env.VITE_APP_VERSION);
</script>

<template>
	<IrdomLayout title="Сервисы">
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
