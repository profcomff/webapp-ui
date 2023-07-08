<script setup lang="ts">
import { useToastStore } from '@/store';
import { IrdomToast } from './lib';

const toastStore = useToastStore();
</script>

<template>
	<div class="toast-list">
		<IrdomToast
			v-for="[id, toast] of toastStore.list.entries()"
			:key="id"
			:toast="toast"
			@close="toastStore.remove(id)"
		/>
	</div>
</template>

<style scoped>
.toast-list {
	position: fixed;
	left: 0;
	right: 0;
	bottom: var(--navbar-height);
	z-index: 10;
	width: min(100%, 344px);
	margin: 0 auto;
	padding-bottom: 16px;
	display: flex;
	flex-direction: column;
	gap: 16px;
}
</style>
