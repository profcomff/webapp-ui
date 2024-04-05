<script setup lang="ts">
import { useToolbar } from '@/store/toolbar';
import AsyncContent from './AsyncContent.vue';
import IrdomLayout from '@/components/IrdomLayout.vue';
import FullscreenLoader from '@/components/FullscreenLoader.vue';

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
			<template #fallback> <FullscreenLoader /> </template>
		</Suspense>
	</IrdomLayout>
</template>
