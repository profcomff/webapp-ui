<script setup lang="ts">
import { IrdomLayout } from '@/components';
import AsyncContent from './AsyncContent.vue';
import { computed, ref, onMounted } from 'vue';
import TheUpdates from '@/components/TheUpdates.vue';

const version = computed(() => import.meta.env.VITE_APP_VERSION);

const modalIsOpen = ref(false);

const closeModal = () => {
	modalIsOpen.value = !modalIsOpen.value;
};

onMounted(() => {
	setTimeout(closeModal, 500);
});
</script>

<template>
	<IrdomLayout title="Сервисы">
		<Suspense>
			<AsyncContent />

			<template #fallback> Загрузка... </template>
		</Suspense>
		<span v-if="version" class="version">Версия приложения: {{ version }}</span>
	</IrdomLayout>

	<TheUpdates @close="closeModal" :open="modalIsOpen" />
</template>

<style scoped>
.version {
	opacity: 0.3;
	font-size: 12px;
}
</style>
