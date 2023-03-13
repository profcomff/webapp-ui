<script setup lang="ts">
import { IrdomLayout } from '@/components';
import AsyncContent from './AsyncContent.vue';
</script>

<template>
	<IrdomLayout>
		<Suspense>
			<AsyncContent :id="+$route.params.id" />
		</Suspense>
	</IrdomLayout>
</template>

<style scoped></style>
