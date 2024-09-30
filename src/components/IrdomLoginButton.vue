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
}
const props = defineProps<Props>();

const authUrl = ref<string | null>(null);

onMounted(async () => {
	const { data } = await apiClient.GET(`/auth/${props.button.link}/auth_url`);
	if (data) {
		authUrl.value = data.url;
	}
});

async function clickHandler() {
	if (authUrl.value) {
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
