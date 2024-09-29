<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { AuthMethodLink, AuthMethodName } from '@/models';

import apiClient from '@/api/';

export interface AuthButton {
	name: string;
	link: AuthMethodLink;
	method: AuthMethodName;
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
	const { data } = await apiClient.GET(`/auth/${props.button.link}/auth_url`);
	if (data) {
		authUrl.value = data.url;
	}
});

async function clickHandler() {
	console.log('кликнул', props.button.link, props.unlink);
	if (props.unlink) {
		await apiClient.DELETE(`/auth/${props.button.link}`);
		console.log('deleted', props.button.link);
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
