<script setup lang="ts">
import { IrdomLayout } from '@/components';
import AsyncContent from './AsyncContent.vue';
</script>

<template>
	<IrdomLayout title="Активные сессии" backable back="/profile">
		<Suspense>
			<AsyncContent />
			<template #fallback> Загрузка... </template>
		</Suspense>
	</IrdomLayout>
</template>
