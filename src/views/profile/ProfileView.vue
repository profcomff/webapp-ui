<script setup lang="ts">
import { IrdomLayout, ToolbarMenuItem, IrdomAuthButton, TelegramButton } from '@/components';
import { useProfileStore } from '@/store';
import { onMounted, computed, ref, capitalize } from 'vue';
import Placeholder from '@/assets/profile_image_placeholder.webp';
import { AuthApi } from '@/api';
import { AuthMethod, MySessionInfo } from '@/api/auth';
import { authButtons } from '@/constants';
import { useRouter } from 'vue-router';
import { UserdataApi } from '@/api/controllers/UserdataApi';
import { Userdata } from '@/api/models';
import { stringify } from 'querystring';

const profileStore = useProfileStore();
const router = useRouter();
let userdataCategory: Record<string, Record<string, string>[]> = {};
const userdata = ref<Userdata>({ items: [] });
const userdataPriority: Array<string> = ['Личная информация', 'Учёба', 'Контакты'];
const userInfoPriority: Array<string> = ['Фамилия', 'Имя', 'Отчество'];
let sortedUserdataCategories: string[];
const userdataLoading = ref(false);
let username = '';
const toolbarMenu: ToolbarMenuItem[] = [
	{
		name: 'Выход',
		onClick: async () => {
			await AuthApi.logout();
			router.push('/auth');
		},
	},
	{
		name: 'Сессии',
		onClick: () => router.push('/profile/sessions'),
	},
];

onMounted(async () => {
	if (history.state.token) {
		profileStore.updateToken(history.state.token);
		delete history.state.token;
	}

	userdataLoading.value = true;
	const { data: me } = await AuthApi.getMe([
		MySessionInfo.AuthMethods,
		MySessionInfo.Groups,
		MySessionInfo.IndirectGroups,
		MySessionInfo.SessionScopes,
		MySessionInfo.UserScopes,
	]);

	const { data } = await UserdataApi.getUser(me.id);
	userdata.value = data;
	userdataLoading.value = false;

	userdata.value.items.forEach(item => {
		if (!userdataCategory[item['category']]) {
			userdataCategory[item['category']] = [];
		}
		userdataCategory[item['category']].push({ param: item['param'], value: item['value'] });
	});
	const beginValue: Record<string, Record<string, string>[]> = {};
	sortedUserdataCategories = Object.keys(userdataCategory).sort((a, b) => {
		return userdataPriority.indexOf(a) > userdataPriority.indexOf(b) ? 1 : -1;
	});
	userdataCategory = sortedUserdataCategories.reduce((obj, key: string): Record<string, Record<string, string>[]> => {
		obj[key] = userdataCategory[key];
		return obj;
	}, beginValue);
	userdataCategory['Личная информация'].sort((a, b) => {
		return userInfoPriority.indexOf(a.param) > userInfoPriority.indexOf(b.param) ? 1 : -1;
	});
	let count = 0;
	userdataCategory['Личная информация'].forEach(item => {
		if (item.param === 'Имя' || item.param === 'Фамилия' || item.param === 'Отчество') {
			username += item.value + ' ';
			++count;
		}
	});
	userdataCategory['Личная информация'].splice(0, count);
});

const canLinked = computed(() =>
	authButtons.filter(({ method }) => !profileStore.authMethods?.includes(method) && method !== AuthMethod.Telegram),
);
const canUnlinked = computed(() => authButtons.filter(({ method }) => profileStore.authMethods?.includes(method)));
</script>

<template>
	<IrdomLayout :toolbar-menu="toolbarMenu" title="Профиль" class="personal">
		<img :src="Placeholder" alt="Аватар" width="400 " height="400" class="avatar" />
		<section class="user-info">
			<h1>
				{{ username }}
			</h1>
		</section>
		<div v-if="userdataLoading">Загрузка...</div>
		<div v-else class="userdata">
			<div v-for="category in Object.keys(userdataCategory)" :key="category">
				<section v-if="userdataCategory[category].length !== 0" class="section">
					<h2>
						{{ category }}
					</h2>
					<div v-for="info in userdataCategory[category]" :key="info.id" class="userdata-param">
						<div>
							{{ info.param }}
						</div>
						<h3>
							{{ info.value }}
						</h3>
					</div>
				</section>
			</div>
		</div>

		<section class="section" v-if="profileStore.authMethods?.length !== 8">
			<h2>Привязать аккаунт</h2>
			<div class="buttons">
				<IrdomAuthButton v-for="button of canLinked" :key="button.method" :button="button" />
				<TelegramButton v-if="!profileStore.authMethods?.includes(AuthMethod.Telegram)" />
			</div>
		</section>

		<section v-if="profileStore.authMethods && profileStore.authMethods.length > 1" class="section">
			<h2>Отвязать аккаунт</h2>
			<div class="buttons">
				<IrdomAuthButton v-for="button of canUnlinked" :key="button.method" :button="button" unlink />
			</div>
		</section>
	</IrdomLayout>
</template>

<style scoped>
.li {
	list-style-position: inside;

	&::marker {
		content: '- ';
	}
}

.ul {
	margin-bottom: 20px;

	&:last-child {
		margin-bottom: 0;
	}
}

.avatar {
	align-self: center;
	margin-bottom: 16px;
	aspect-ratio: 1;
	height: auto;
	width: 100%;
	max-width: 256px;
	border-radius: 999px;
	object-fit: cover;
}

.buttons {
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
}

.section {
	margin-bottom: 40px;

	& h2 {
		margin-bottom: 20px;
	}
}

.userdata {
	margin-left: 100px;
}

.userdata-category {
	margin-bottom: 3%;
}

.userdata-param {
	margin-bottom: 10px;
	margin-top: 10px;
}

.user-info {
	display: inline-block;
	align-self: center;
	margin-bottom: 4%;
}

.personal {
	height: 50%;
}
</style>
