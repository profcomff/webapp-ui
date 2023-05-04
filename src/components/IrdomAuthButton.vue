<script setup lang="ts">
import { AuthMethod, AuthOauth2BaseApi } from '@/api/auth';
import { IrdomButton } from '@/components/lib';

export interface AuthButton {
	name: string;
	api: AuthOauth2BaseApi;
	method: AuthMethod;
	icon?: string;
	color?: string;
}

defineProps<{
	button: AuthButton;
}>();

async function openAuthUrl(api: AuthOauth2BaseApi) {
	const url = await api.getAuthUrl();
	window.open(url, '_blank');
}
</script>

<template>
	<IrdomButton type="button" @click="openAuthUrl(button.api)" :style="{ background: button.color }" icon>
		<svg width="24" height="24" class="icon">
			<use :xlink:href="button.icon"></use>
		</svg>
		{{ button.name }}
	</IrdomButton>
</template>

<style scoped>
.icon {
	filter: grayscale(1);
	margin-right: 11px;
}
</style>
