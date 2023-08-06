<script setup lang="ts">
import AsyncContent from './AsyncContent.vue';
import { IrdomLayout } from '@/components';
</script>

<template>
	<IrdomLayout title="Активные сессии" backable back="/profile">
		<Suspense>
			<AsyncContent />
			<template #fallback> Загрузка... </template>
		</Suspense>
	</IrdomLayout>
</template>
