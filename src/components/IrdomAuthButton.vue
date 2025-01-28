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

const dialogVisible = ref(false);

onMounted(async () => {
	const { data } = await apiClient.GET(`/auth/${props.button.link}/auth_url`);
	if (data) {
		authUrl.value = data.url;
	}
});

async function clickHandler() {
	if (props.unlink) {
		dialogVisible.value = true;
	} else if (authUrl.value) {
		window.open(authUrl.value, '_self');
	}
}

async function confirmUnlink() {
	await apiClient.DELETE(`/auth/${props.button.link}`);
	location.reload(); // TODO: придумать нормальное решение
}

function cancelUnlink() {
	dialogVisible.value = false;
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

	<!-- Модальное окно для подтверждения отвязки -->
	<v-dialog v-model="dialogVisible" max-width="400">
		<v-card>
			<v-card-title class="headline">Вы точно хотите отвязать аккаунт?</v-card-title>
			<v-card-actions>
				<v-spacer />
				<v-btn @click="cancelUnlink">Не отвязывать</v-btn>
				<v-btn color="red" @click="confirmUnlink">Отвязать</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
