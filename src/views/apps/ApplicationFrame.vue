<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToolbar } from '@/store/toolbar';
import { servicesApi } from '@/api/services/ServicesApi';
import { ButtonType } from '@/api/models';
import FullscreenLoader from '@/components/FullscreenLoader.vue';

const route = useRoute();
const toolbar = useToolbar();
const router = useRouter();

enum AppState {
	Wait = 1,
	Show = 2,
	Error = 3,
}
const url = ref();
const appState = ref(AppState.Wait);

toolbar.setup({
	backUrl: '/apps',
});

onMounted(async () => {
	const appId = +route.params.id;
	servicesApi
		.getService(appId)
		.then(async response => {
			console.log(response);

			if (
				response.status == 200 &&
				response.data.type == ButtonType.Internal &&
				response.data.link
			) {
				appState.value = AppState.Show;
				url.value = response.data.link;
				toolbar.title = response.data.name;
			} else {
				appState.value = AppState.Error;
			}
		})
		.catch(() => {
			appState.value = AppState.Error;
		});
});
</script>

<template>
	<v-main>
		<iframe
			v-if="appState == AppState.Show"
			:src="url"
			frameborder="0"
			class="iframe"
			allow="camera"
		/>
		<FullscreenLoader v-else-if="appState == AppState.Wait" />
		<div v-else class="exception-container">
			<h2>Не удалось загрузить приложение</h2>
			<v-btn @click="router.push('/apps')">Вернуться к списку приложений</v-btn>
		</div>
	</v-main>
</template>

<style scoped>
v-main,
.iframe {
	flex: 1;
	width: 100%;
	height: 100%;
}

.exception-container {
	display: flex;
	flex-direction: column;
	flex: 1;
	place-content: space-around center;
	width: 100%;
	height: 100%;
}

.exception-container > * {
	margin: 16px auto;
}
</style>
