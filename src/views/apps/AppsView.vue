<script setup lang="ts">
import { IrdomLayout, TheUpdates } from '@/components';
import AsyncContent from './AsyncContent.vue';
import { computed, ref, onMounted } from 'vue';
const version = computed(() => import.meta.env.VITE_APP_VERSION);

const modalIsOpen = ref(false);

const isOpenModal = () => {
	modalIsOpen.value = !modalIsOpen.value;
};

onMounted(() => {
	setTimeout(isOpenModal, 500);
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

	<TheUpdates @close="isOpenModal" :open="modalIsOpen" />
</template>

<style scoped>
.version {
	opacity: 0.3;
	font-size: 12px;
}
</style>
