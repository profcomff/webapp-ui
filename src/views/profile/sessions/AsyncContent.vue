<script setup lang="ts">
import UAParser from 'ua-parser-js';

import { SessionInfo, Session } from '@/models';

import apiClient from '@/api/';

import Apple from '@/assets/logo/Apple.svg';
import Desktop from '@/assets/logo/Desktop.svg';
import Chrome from '@/assets/logo/Chrome.svg';
import Firefox from '@/assets/logo/Firefox.svg';
import Safari from '@/assets/logo/Safari.svg';
import Android from '@/assets/logo/Android.svg';
import Mobile from '@/assets/logo/Mobile.svg';
import Tablet from '@/assets/logo/Tablet.svg';
import Ipad from '@/assets/logo/Ipad.svg';
import Iphone from '@/assets/logo/Iphone.svg';
import Yandex from '@/assets/logo/Yandex.svg';
import { AuthApi } from '@/api';
import { computed, ref } from 'vue';
import { useProfileStore } from '@/store/profile';

const profileStore = useProfileStore();

const data = await AuthApi.getSessions([SessionInfo.Token]);
const sessions = ref<Map<string | null | undefined, Session[] extends Array<infer X> ? X : never>>(
	new Map()
);

if (data) {
	data.forEach(session => {
		sessions.value.set(session.token, session);
	});
}

const sortedSessions = computed(() =>
	Array.from(sessions.value.values()).sort(
		(a, b) => +new Date(b.last_activity) - +new Date(a.last_activity)
	)
);

const formatTime = (date: string) => {
	const d = new Date(date);
	d.setMinutes(d.getMinutes() - new Date().getTimezoneOffset());
	return d.toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
		hour: 'numeric',
		minute: 'numeric',
	});
};

const formatDevice = (name: string) => {
	const ua = new UAParser(name);
	return `${ua.getOS().name} • ${ua.getBrowser().name} ${ua
		.getBrowser()
		.version?.slice(0, ua.getBrowser().version?.indexOf('.'))}`;
};

const getIcon = (name: string) => {
	const ua = new UAParser(name);
	const browser = ua.getBrowser().name?.toLowerCase();
	const os = ua.getOS().name?.toLowerCase();
	const type = ua.getDevice().type?.toLowerCase();

	if (os?.toLowerCase().includes('ios')) {
		if (type === 'tablet') return Ipad;
		if (type === 'mobile') return Iphone;
		return Apple;
	}
	if (os?.includes('mac')) {
		return Safari;
	}
	if (type === 'mobile') {
		if (os?.includes('android')) return Android;
		return Mobile;
	}
	if (type === 'tablet') {
		return Tablet;
	}
	if (browser?.includes('firefox')) return Firefox;
	if (browser?.includes('chrome')) return Chrome;
	if (browser?.includes('yandex')) return Yandex;
	return Desktop;
};

const deleteHandler = async (token: string) => {
	sessions.value.delete(token);
	await apiClient.DELETE('/auth/session/{token}', { params: { path: { token } } });
};
</script>

<template>
	<v-card
		v-for="{ id, session_name, last_activity, token } of sortedSessions"
		:key="id"
		class="card"
	>
		<div v-if="session_name" class="d-flex">
			<div>
				<v-img :src="getIcon(session_name)" alt="" width="64" height="64" />
			</div>
			<div>
				<v-card-title>
					{{ formatDevice(session_name) }}
				</v-card-title>
				<v-card-subtitle>
					{{ formatTime(last_activity) }}
				</v-card-subtitle>
			</div>
		</div>

		<v-card-actions v-if="token">
			<v-btn
				:disabled="profileStore.token?.endsWith(token)"
				:text="profileStore.token?.endsWith(token) ? 'Текущая сессия' : 'Завершить сессию'"
				@click="deleteHandler(token)"
			/>
		</v-card-actions>
	</v-card>
</template>
<style scoped>
.card {
	margin-bottom: 20px;

	&:last-child {
		margin-bottom: 0;
	}
}

.d-flex {
	padding: 0.5rem;
}
</style>
