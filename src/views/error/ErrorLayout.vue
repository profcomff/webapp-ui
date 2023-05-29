<script setup lang="ts">
import { IrdomLayout } from '@/components';

defineProps<{ title: string; image: string }>();
</script>

<template>
	<IrdomLayout :title="title" backable class="page">
		<img :src="image" aria-hidden="true" />
		<div>
			<h2>
				<slot name="heading" />
			</h2>
			<p><slot name="subheading" /></p>
		</div>

		<slot />
	</IrdomLayout>
</template>

<style>
.page {
	align-items: center;
}

.page img {
	width: 100%;
	max-width: 512px;
	pointer-events: none;
	margin-bottom: 20px;
}

.page h2 {
	font-size: 44px;
	margin-bottom: 20px;
}

.page p {
	color: oklch(62.34% 0 0);
	font-size: 24px;
}
</style>
