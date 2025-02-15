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
	location?: 'login' | 'auth-edit';
}
const props = withDefaults(defineProps<Props>(), {
	unlink: false,
	location: 'login', // Значение по умолчанию
});

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
	<v-btn
		type="button"
		:color="button.color"
		:variant="location === 'login' ? 'flat' : 'text'"
		:size="location === 'login' ? 'large' : 'default'"
		:class="location === 'login' ? 'oauth-button' : 'auth-edit-button'"
		@click="clickHandler"
	>
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
				<v-btn color="red" @click="cancelUnlink">Не отвязывать</v-btn>
				<v-btn @click="confirmUnlink">Отвязать</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<style scoped>
.oauth-button {
	min-width: 250px;
	width: 40%;
	border-radius: 4px !important;
	overflow: hidden;
}

.auth-edit-button {
	min-width: auto;
	width: auto;
	border-radius: 4px !important;
	overflow: hidden;
}
</style>
