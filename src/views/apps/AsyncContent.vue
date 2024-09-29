<script setup lang="ts">
import { ToastType } from '@/models';
import { useAppsStore } from '@/store/apps';
import { useProfileStore } from '@/store/profile';
import { useToastStore } from '@/store/toast';
import { RouterLink } from 'vue-router';

import apiClient from '@/api/';

const appsStore = useAppsStore();
const profileStore = useProfileStore();
const toastStore = useToastStore();

if (appsStore.categories.length == 0) {
	const { data } = await apiClient.GET('/services/category', {
		params: { query: { info: ['buttons'] } },
	});
	if (data) {
		useAppsStore().categories = data;
	}
}

const sendMarketing = (url: string) => {
	if (profileStore.marketingId) {
		apiClient.POST('/marketing/v1/action', {
			body: {
				action: 'route to',
				user_id: profileStore.marketingId,
				path_from: '/apps',
				path_to: url,
			},
		});
	}
};

const showRestrictedAccessWarning = () => {
	toastStore.push({
		title: 'Недостаточно прав',
		type: ToastType.Info,
		description: 'Приложение требует дополнительные права для работы, которых у вас нет',
	});
};
</script>

<template>
	<section
		v-for="{ name, type: sectionType, buttons, id } of appsStore.categories"
		:key="id"
		class="section"
	>
		<h2 class="h2">
			{{ name }}
		</h2>

		<div :class="{ grid3: sectionType === 'grid3', list: sectionType === 'list' }">
			<div
				v-for="{ icon, link, name: buttonName, type, id: buttonId, view } of (buttons ?? []).filter(
					button => button.view != 'hidden'
				)"
				:key="buttonId"
				class="app"
				:v-ripple="view !== 'blocked'"
				:class="{ disabled: view == 'blocked' }"
				:aria-disabled="view === 'blocked'"
				@click="if (view === 'blocked') showRestrictedAccessWarning();"
			>
				<img
					v-if="icon?.startsWith('http')"
					:src="icon"
					:alt="buttonName ?? 'ошибка'"
					:width="sectionType === 'grid3' ? 128 : 24"
					:height="sectionType === 'grid3' ? 128 : 24"
					class="icon"
				/>
				<v-icon
					v-else
					:icon="icon ?? 'mdi-square-outline'"
					class="material-icon"
					:size="sectionType === 'grid3' ? 40 : 24"
				/>

				<p v-if="view === 'blocked'" class="app-link">
					{{ buttonName }}
				</p>

				<a
					v-else-if="type === 'external' && link !== null"
					:href="link"
					class="app-link"
					target="_blank"
					@click="sendMarketing(link)"
				>
					{{ buttonName }}
				</a>

				<RouterLink v-else-if="type === 'internal'" :to="`/apps/${buttonId}`" class="app-link">
					{{ buttonName }}
				</RouterLink>

				<RouterLink v-else-if="type === 'inapp' && link !== null" :to="link" class="app-link">
					{{ buttonName }}
				</RouterLink>
			</div>
		</div>
	</section>
</template>

<style scoped>
.app {
	text-decoration: none;
	position: relative;
	border-radius: 16px;
	width: 100%;

	&:last-child {
		margin-bottom: 0;
	}

	&[aria-disabled='true'] {
		filter: grayscale(1);
		opacity: 0.6;
	}
}

.list .app {
	display: flex;
	align-items: center;
	padding: 12px 24px;
	gap: 0.8em;
	border-radius: 5px;
	margin-bottom: 10px;
	background-color: rgb(var(--v-theme-surface-variant));
	transition: ease 0.3s;
}

.grid3 {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 32px 2.5%;
	justify-items: center;
	align-self: center;

	& .icon {
		width: 100%;
		height: auto;
		aspect-ratio: 1;
		display: block;
		padding: 0 8px;
		pointer-events: none;
	}

	& .material-icon {
		margin-bottom: 8px;
	}

	& .app {
		max-width: 144px;
		background: white;
		padding: 8px min(8%, 8px);
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 14px;
		text-align: center;
		box-shadow: 0 0 20px rgb(0 0 0 / 10%);
		transition: all 0.3s ease;

		&:hover:not([aria-disabled='true']) {
			transform: translateY(-4px);
			box-shadow: 0 0 24px rgb(0 0 0 / 12%);
		}
	}
}

.list .app:hover:not([aria-disabled='true']) {
	filter: brightness(90%);
}

.h2 {
	margin-bottom: 16px;
	font-weight: normal;
}

.section {
	margin-bottom: 24px;

	&:last-child {
		margin-bottom: 0;
	}
}

.app-link {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	overflow-wrap: anywhere;
	-webkit-line-clamp: 3;
	overflow: hidden;

	&::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 1;
	}
}
</style>
