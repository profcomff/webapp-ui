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

interface Props {
	button: AuthButton;
	unlink?: boolean;
}
const props = withDefaults(defineProps<Props>(), { unlink: false });

const authUrl = ref<string | null>(null);

onMounted(async () => {
	authUrl.value = await props.button.api.getAuthUrl();
});

async function clickHandler() {
	if (props.unlink) {
		await props.button.api.unregister();
		location.reload(); // TODO: придумать нормальное решение
	} else if (authUrl.value) {
		window.open(authUrl.value, '_self');
	}
}
</script>

<template>
	<v-btn type="button" :color="button.color" @click="clickHandler">
		<template #prepend>
			<svg width="24" height="24" class="icon">
				<use :xlink:href="button.icon" />
			</svg>
		</template>

		{{ button.name }}
	</v-btn>
</template>
