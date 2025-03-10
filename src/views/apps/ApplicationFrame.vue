<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToolbar } from '@/store/toolbar';
import { useProfileStore } from '@/store/profile';
import FullscreenLoader from '@/components/FullscreenLoader.vue';
import { AuthApi } from '@/api/controllers/auth/AuthApi';
import { ServiceData } from '@/models';
import { apiClient } from '@/api/';
import { msInHour } from '@/utils/time';
import { useAppsStore } from '@/store/apps';

const route = useRoute();
const toolbar = useToolbar();
const router = useRouter();
const profileStore = useProfileStore();
const appStore = useAppsStore();

router.replace({ query: undefined });

const props = defineProps({
	lecturer: { type: String, required: false, default: null },
	relativePath: { type: String, required: false, default: null },
});

const relPath = props.relativePath;
const lect_id = props.lecturer;

console.log('props: ', props.lecturer, props.relativePath);

enum AppState {
	WaitLoad = 1,
	Show = 2,
	Error = 3,
	WaitApprove = 4,
	Blocked = 5,
}
const appId = +route.params.id;
const url: Ref<URL | undefined> = ref();
const appState = ref(AppState.WaitLoad);
const scopes: Ref<string[]> = ref([]);

const scopeNamesToRequest: Ref<string[]> = ref([]);

toolbar.setup({
	backUrl: '/apps',
});

const composeUrl = async (url: URL, token: string | null, scopes: string[]) => {
	if (relPath) {
		url = new URL(relPath, url);
	}
	if (lect_id) {
		url = new URL(`?lecturer_id=${lect_id}`, url);
	}
	if (token !== null) {
		url.searchParams.set('token', token);
	}
	url.searchParams.set('scopes', scopes.join(','));
	if (!profileStore.id) {
		await AuthApi.getMe();
	}
	if (profileStore.id) {
		url.searchParams.set('user_id', profileStore.id.toString());
	}
	return url;
};

// function showApproveScopesScreen() {
// 	appState.value = AppState.WaitApprove;
// 	// immediately return a Promise
// 	// Раскомментить, если появятся сторонние приложения
// 	// return new Promise(resolve => {
// 	// 	watch(userScopeApproved, value => resolve(value));
// 	// });
// 	return true;
// }

const getToken = async () => {
	// Запрашиваем токен. Для этого:
	// 1. Получаем весь список скоупов для получения оттуда названий на русском
	const userInfo = (
		await apiClient.GET('/auth/me', { params: { query: { info: ['user_scopes'] } } })
	).data;
	if (!userInfo || !userInfo.user_scopes) {
		appState.value = AppState.Error;
		return;
	}

	const valuesToSearch = new Set(scopes.value);

	userInfo.user_scopes.forEach(item => {
		if (valuesToSearch.has(item.name)) {
			// TODO: Поменять name на comment, когда допилю ручку me (и, возможно, поменять /me на /scope)
			if (item.name !== undefined && item.name !== null) {
				scopeNamesToRequest.value.push(item.name);
			}
		}
	});

	// 2. Если нужен токен без скоупов, то пропускаем запрос на разрешение у пользователя
	if (scopes.value.length != 0) {
		// 2.1 Показываем пользователю список прав, которые приложение запрашивает, и кнопки "разрешить"/"запретить"
		const scopesApproved = true; // await showApproveScopesScreen();

		// 2.2 Если пользователь не разрешает – возваращаем undefined
		if (!scopesApproved) return undefined;
	}

	// 3. Если пользователь разрешает – запрашиваем токен на Auth api и возвращаем его
	const storageToken = appStore.checkAppToken(appId);
	if (storageToken) {
		return storageToken;
	} else {
		const expiresDate = new Date(Date.now() + msInHour);
		const { data } = await apiClient.POST('/auth/session', {
			body: {
				scopes: scopes.value.length == 0 ? [] : scopes.value,
				expires: expiresDate.toISOString(),
			},
		});
		if (!data) {
			appState.value = AppState.Error;
			return;
		}
		profileStore.id = data.user_id;
		appStore.addAppToken(appId, data.token ?? undefined, expiresDate.getTime());

		return data.token;
	}
};

const openApp = async (data: ServiceData) => {
	// Приложения открываем только Internal типа
	if (data.type !== 'internal') {
		appState.value = AppState.Error;
		return;
	}

	// Приложения открываем только по https
	if (data.link === undefined || !data.link?.startsWith('https://')) {
		appState.value = AppState.Error;
		return;
	}

	url.value = new URL(data.link);
	toolbar.title = data.name ?? 'Ошибка';

	scopes.value = data.scopes ? data.scopes : [];

	// Не хватает скоупов => Кнопка заблокирована => Показываем ошибку
	if (data.view == 'blocked') {
		appState.value = AppState.Blocked;
		return;
	}

	// Пользователь не авторизован => Кнопка разблокирована и не требует авторизации => Показываем приложение
	if (data.view == 'active' && !profileStore.id) {
		appState.value = AppState.Show;
		return;
	}

	// Приложение требует доступа к данным и есть возможность их получить
	const token = await getToken();
	if (token === undefined) {
		// Пользователь не дал доступ к данным
		router.push('/apps');
		return;
	}
	// Пользователь дал доступ – открываем приложение
	url.value = await composeUrl(url.value, token, scopes.value);
	appState.value = AppState.Show;
};

onMounted(async () => {
	if (profileStore.token && !profileStore.id) {
		await AuthApi.getMe(['session_scopes', 'user_scopes']);
	}

	const { data } = await apiClient.GET('/services/service/{button_id}', {
		params: { path: { button_id: appId } },
	});
	if (data) {
		openApp(data);
	} else {
		appState.value = AppState.Error;
	}
});
</script>

<template>
	<v-main>
		<iframe
			v-if="appState == AppState.Show && url"
			:src="url.toString()"
			frameborder="0"
			class="iframe"
			allow="camera"
		/>
		<FullscreenLoader v-else-if="appState == AppState.WaitLoad" />
		<!-- Раскомментить, если появятся приложения от сторонних разработчиков -->
		<!-- <div v-else-if="appState == AppState.WaitApprove" class="deligate-container">
			<h2>Приложение запрашивает права на доступ к вашему аккаунту</h2>
			<p>Для работы будут делегированы следующие права:</p>
			<ul>
				<li v-for="(scope, i) in scopeNamesToRequest" :key="i">{{ scope }}</li>
			</ul>
			<v-btn color="primary" @click="userScopeApproved = true">Разрешить</v-btn>
			<v-btn variant="plain" @click="userScopeApproved = false">Запретить</v-btn>
		</div> -->
		<div v-else-if="appState == AppState.Blocked" class="exception-container">
			<h2>У вас недостаточно прав для использования этого приложения</h2>
			<v-btn @click="router.push('/apps')">Вернуться к списку приложений</v-btn>
		</div>
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

.deligate-container {
	display: flex;
	flex-direction: column;
	flex: 1;
	place-content: space-around flex-start;
	max-width: 600px;
	width: 100%;
	height: 100%;
	margin: 32px auto;
	padding: 0 32px;

	& > * {
		margin: 8px 0;
	}

	& ul {
		list-style: none;
		display: flex;
		flex-flow: column nowrap;
		gap: 8px 2.5%;
		margin: 16px 0;
	}

	& ul li {
		display: block;
		align-items: center;
		width: 100%;
		padding: 16px;
		overflow: hidden;
		text-overflow: ellipsis;
		border-radius: 5px;
		background-color: rgb(var(--v-theme-surface-variant));
		white-space: nowrap;
	}
}
</style>
