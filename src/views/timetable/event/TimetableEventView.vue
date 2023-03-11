<script setup lang="ts">
import { IrdomLayout } from '@/components';
import AsyncContent from './AsyncContent.vue';
</script>

<template>
	<IrdomLayout backable>
		<Suspense>
			<AsyncContent :id="+$route.params.id" />

			<template #fallback> Загрузка... </template>
		</Suspense>
	</IrdomLayout>
</template>

<style scoped></style>
