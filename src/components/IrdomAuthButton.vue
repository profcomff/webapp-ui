<script setup lang="ts">
import { AuthMethod, AuthOauth2BaseApi } from '@/api/auth';
import { IrdomButton } from '@/components/lib';
import { onMounted, ref } from 'vue';

export interface AuthButton {
	name: string;
	api: AuthOauth2BaseApi;
	method: AuthMethod;
	icon?: string;
	color?: string;
}

const props = withDefaults(
	defineProps<{
		button: AuthButton;
		unlink?: boolean;
	}>(),
	{ unlink: false },
);

const authUrl = ref<string | null>(null);

onMounted(async () => {
	authUrl.value = await props.button.api.getAuthUrl();
});

const clickHandler = async () => {
	if (props.unlink) {
		await props.button.api.unregister();
		location.reload();
	} else if (authUrl.value) {
		window.open(authUrl.value, '_blank');
	}
};
</script>

<template>
	<IrdomButton type="button" @click="clickHandler" :style="{ background: button.color }" icon>
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
