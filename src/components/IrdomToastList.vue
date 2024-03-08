<script setup lang="ts">
import { useToastStore } from '@/store/toast';
import IrdomToast from './IrdomToast.vue';

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
	bottom: 72px;
	left: 50%;
	transform: translateX(-50%);
	z-index: 999;
	display: flex;
	flex-direction: column;
	gap: 16px;
}
</style>
