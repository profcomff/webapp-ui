<script setup lang="ts">
import IrdomLayout from '@/components/IrdomLayout.vue';
import { useToolbar } from '@/store/toolbar';

const props = defineProps<{ title: string; image: string }>();

const toolbar = useToolbar();

toolbar.setup({
	title: props.title,
	backable: true,
});
</script>

<template>
	<IrdomLayout>
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
	color: oklch(62.34% 0 0deg);
	font-size: 24px;
}
</style>
