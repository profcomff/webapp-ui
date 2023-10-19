<script setup lang="ts">
import { AuthMethod, AuthOauth2BaseApi } from '@/api/auth';
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
		location.reload(); // TODO: придумать нормальное решение
	} else if (authUrl.value) {
		window.open(authUrl.value, '_blank');
	}
};
</script>

<template>
	<v-btn type="button" :color="button.color" @click="clickHandler">
		<svg width="24" height="24" class="icon">
			<use :xlink:href="button.icon"></use>
		</svg>
		{{ button.name }}
	</v-btn>
</template>

<style scoped>
.icon {
	margin-right: 11px;
}
</style>
