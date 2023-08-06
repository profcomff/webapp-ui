<script setup lang="ts">
import UAParser from 'ua-parser-js';

import { SessionInfo } from '@/api/auth';
import { MaterialIcon } from '@/components/lib';

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

const { data } = await AuthApi.getSessions([SessionInfo.Token]);
const sessions = ref<Map<string, typeof data extends Array<infer X> ? X : never>>(new Map());
data.forEach(session => {
	sessions.value.set(session.token, session);
});
const sortedSessions = computed(() =>
	Array.from(sessions.value.values()).sort((a, b) => +new Date(b.last_activity) - +new Date(a.last_activity)),
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

const deleteHandler = (token: string) => {
	sessions.value.delete(token);
};
</script>

<template>
	<div v-for="session of sortedSessions" :key="session.id" class="card">
		<div class="wrapper">
			<div class="">
				<img :src="getIcon(session.session_name)" alt="" width="64" height="64" />
			</div>
			<div class="text">
				<b>{{ formatDevice(session.session_name) }}</b>
				<p>{{ formatTime(session.last_activity) }}</p>
			</div>
		</div>

		<div>
			<button type="button" @click="deleteHandler(session.token)">
				<MaterialIcon name="delete" :size="32" />
			</button>
		</div>
	</div>
</template>

<style scoped>
.card {
	border-radius: 20px;
	padding: 20px;
	box-shadow: 0 0 20px oklch(0 0 0deg / 10%);
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
	background: oklch(100% 0 0deg);
}

.card b {
	font-size: 20px;
}

.card p {
	margin-top: 12px;
}

.wrapper {
	display: flex;
	gap: 32px;
	align-items: center;
}
</style>
