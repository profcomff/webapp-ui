<script setup lang="ts">
import AsyncContent from './AsyncContent.vue';
import { useRoute } from 'vue-router';
import IrdomLayout from '@/components/IrdomLayout.vue';

const route = useRoute();
const back =
	history.state.back && /\/timetable\/\d{2}-\d{2}-\d{4}/.test(history.state.back)
		? history.state.back
		: '/timetable';
</script>

<template>
	<IrdomLayout backable :back="back" share title="Событие">
		<Suspense>
			<AsyncContent :id="+route.params.id" />

			<template #fallback> Загрузка... </template>
		</Suspense>
	</IrdomLayout>
</template>
