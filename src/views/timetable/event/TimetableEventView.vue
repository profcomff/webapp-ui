<script setup lang="ts">
import AsyncContent from './AsyncContent.vue';
import { useRoute } from 'vue-router';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { useToolbar } from '@/store/toolbar';

const route = useRoute();
const toolbar = useToolbar();

toolbar.setup({
	title: 'Событие',
	backUrl: '/timetable',
	share: true,
});
</script>

<template>
	<IrdomLayout>
		<Suspense>
			<AsyncContent :id="+route.params.id" />

			<template #fallback> Загрузка... </template>
		</Suspense>
	</IrdomLayout>
</template>
