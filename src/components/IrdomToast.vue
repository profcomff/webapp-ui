<script setup lang="ts">
import { Toast, ToastType } from '@/models';
import { computed } from 'vue';

const props = defineProps<{
	toast: Toast;
}>();

defineEmits<{
	close: [];
}>();

const icon = computed(() => {
	switch (props.toast.type) {
		case ToastType.Error:
			return 'error';
		case ToastType.Warn:
			return 'warning';
		default:
			return 'info';
	}
});
</script>

<template>
	<div class="toast">
		<v-icon :icon="icon" />
		<div class="description">
			<h6 class="title">{{ props.toast.title }}</h6>
			<p>{{ props.toast.description }}</p>
		</div>
		<v-btn
			type="button"
			class="close"
			icon="close"
			size="xs"
			variant="plain"
			@click="$emit('close')"
		/>
	</div>
</template>

<style scoped>
.toast {
	display: flex;
	gap: 16px;
	box-shadow: 0 0 20px rgb(0 0 0 / 10%);
	background: white;
	border-radius: 4px;
	padding: 14px 16px;
	align-items: center;
}

.title {
	font-size: 16px;
}
</style>
