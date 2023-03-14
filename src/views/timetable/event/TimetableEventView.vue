<script setup lang="ts">
import { IrdomLayout } from '@/components';
import AsyncContent from './AsyncContent.vue';

const back =
	history.state.back && /\/timetable\/\d{2}-\d{2}-\d{4}/.test(history.state.back) ? history.state.back : '/timetable';
</script>

<template>
	<IrdomLayout :back="back" share>
		<Suspense>
			<AsyncContent :id="+$route.params.id" />

			<template #fallback> Загрузка... </template>
		</Suspense>
	</IrdomLayout>
</template>

<style scoped></style>
