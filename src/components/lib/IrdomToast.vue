<script setup lang="ts">
import { Toast, ToastType } from '@/models';
import { MaterialIcon } from '.';
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
		<MaterialIcon :name="icon" class="icon" />
		<div class="description">
			<div class="header">
				<b class="title">{{ props.toast.title }}</b>
				<div>
					<button type="button" class="close" @click="$emit('close')">
						<MaterialIcon name="close" />
					</button>
				</div>
			</div>
			<p>{{ props.toast.description }}</p>
		</div>
	</div>
</template>

<style scoped>
.toast {
	display: flex;
	gap: 16px;
	box-shadow: 0 0 20px oklch(0 0 0deg / 10%);
	background: white;
	border-radius: 4px;
	padding: 14px 16px;
}

.title {
	font-size: 18px;
	display: block;
}

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 4px;
}

.close {
	display: flex;
}

.description {
	flex: 1;
}
</style>
