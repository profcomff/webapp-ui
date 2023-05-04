<script setup lang="ts">
import { AuthMethod } from '@/api/auth';
import { useProfileStore } from '@/store';
import { onMounted, ref } from 'vue';

const telegram = ref<HTMLDivElement | null>(null);
const profileStore = useProfileStore();

onMounted(() => {
	if (!profileStore.authMethods?.includes(AuthMethod.Telegram) && telegram.value) {
		const script = document.createElement('script');
		script.async = false;
		script.src = 'https://telegram.org/js/telegram-widget.js?22';
		script.setAttribute('data-telegram-login', import.meta.env.VITE_AUTH_TELEGRAM_BOT);
		script.setAttribute('data-size', 'large');
		script.setAttribute('data-auth-url', 'https://app.test.profcomff.com/auth/oauth-authorized/telegram');
		telegram.value.appendChild(script);
	}
});
</script>

<template>
	<div ref="telegram"></div>
</template>
