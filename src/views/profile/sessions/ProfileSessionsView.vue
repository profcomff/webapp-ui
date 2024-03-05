<script setup lang="ts">
import { useToolbar } from '@/store/toolbar';
import AsyncContent from './AsyncContent.vue';
import IrdomLayout from '@/components/IrdomLayout.vue';

const toolbar = useToolbar();

toolbar.setup({
	title: 'Активные сессии',
	backUrl: '/profile',
});
</script>

<template>
	<IrdomLayout>
		<Suspense>
			<AsyncContent />
			<template #fallback> Загрузка... </template>
		</Suspense>
	</IrdomLayout>
</template>
