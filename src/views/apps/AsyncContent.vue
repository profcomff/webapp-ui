<script setup lang="ts">
import { ServicesApi } from '@/api';
import { marketingApi } from '@/api/marketing';
import { ButtonType } from '@/api/models';
import { CategoryInfo } from '@/api/services';
import MaterialIcon from '@/components/MaterialIcon.vue';
import { useAppsStore } from '@/store/apps';
import { useProfileStore } from '@/store/profile';
import { RouterLink } from 'vue-router';

const appsStore = useAppsStore();
const profileStore = useProfileStore();

if (!appsStore.categories) {
	await ServicesApi.getCategories([CategoryInfo.Buttons]);
}

const sendMarketing = (url: string) => {
	if (profileStore.marketingId) {
		marketingApi.writeAction({
			action: 'route to',
			user_id: profileStore.marketingId,
			path_from: '/apps',
			path_to: url
		});
	}
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
				v-for="{ icon, link, name: buttonName, type, id: buttonId } of buttons"
				:key="buttonId"
				v-ripple
				class="app"
				:aria-disabled="type === ButtonType.Disabled"
			>
				<img
					v-if="icon.startsWith('http')"
					:src="icon"
					:alt="buttonName"
					width="400"
					height="400"
					class="icon"
				/>
				<MaterialIcon
					v-else
					:icon="icon"
					class="material-icon"
					:size="sectionType === 'grid3' ? 40 : 24"
				/>

				<a
					v-if="type === ButtonType.External"
					:href="link"
					class="app-link"
					target="_blank"
					@click="sendMarketing(link)"
				>
					{{ buttonName }}
				</a>

				<RouterLink
					v-else-if="type === ButtonType.Internal"
					:to="`/apps/browser/?title=${buttonName}#${link}`"
					class="app-link"
				>
					{{ buttonName }}
				</RouterLink>

				<RouterLink v-else-if="type === ButtonType.Inapp" :to="link" class="app-link">
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
		pointer-events: none;
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
		box-shadow: 0 0 20px oklch(0% 0 0deg / 10%);
		transition: all 0.3s ease;

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 0 24px oklch(0% 0 0deg / 12%);
		}
	}
}

.list .app:hover {
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
