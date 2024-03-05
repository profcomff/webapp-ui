<script setup lang="ts">
import AsyncContent from './AsyncContent.vue';
import IrdomLayout from '@/components/IrdomLayout.vue';
</script>

<template>
	<IrdomLayout title="Активные сессии" backable back-url="/profile">
		<Suspense>
			<AsyncContent />
			<template #fallback> Загрузка... </template>
		</Suspense>
	</IrdomLayout>
</template>
