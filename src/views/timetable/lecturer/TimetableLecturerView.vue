<script setup lang="ts">
import { IrdomLayout } from '@/components';
import AsyncContent from './AsyncContent.vue';

const back = history.state.back?.startsWith('/timetable/event') ? history.state.back : '/timetable';
</script>

<template>
	<IrdomLayout :back="back">
		<Suspense>
			<AsyncContent :id="+$route.params.id" />
		</Suspense>
	</IrdomLayout>
</template>

<style scoped></style>
