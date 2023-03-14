<script setup lang="ts">
import { navbarApi } from '@/api/navbar';
import { MaterialIcon } from '@/components/lib';
import { useAppsStore } from '@/store';
import { RouterLink } from 'vue-router';

const appsStore = useAppsStore();

const categories =
	appsStore.categories ??
	(await navbarApi.getApps().then(({ data }) => {
		appsStore.categories = data;
		return data;
	}));
</script>

<template>
	<section v-for="{ name, type, items } of categories" class="section" :key="name">
		<h2 class="h2">
			{{ name }}
		</h2>

		<div :class="{ grid3: type === 'grid3', list: type === 'list' }">
			<div v-for="{ icon, path, text } of items" class="app" :key="text">
				<img
					v-if="typeof icon === 'object'"
					:src="icon.src"
					:alt="text"
					width="400"
					height="400"
					class="icon"
				/>
				<MaterialIcon v-else-if="typeof icon === 'string'" :name="icon" class="icon" />
				<a v-if="path.startsWith('http')" :href="path" class="app-link">{{ text }}</a>
				<RouterLink v-else :to="path" class="app-link">{{ text }}</RouterLink>
			</div>
		</div>
	</section>
</template>

<style scoped>
.grid3 {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 16px;
	justify-items: center;
}

.grid3 .icon {
	padding: 12px;
	width: 100%;
	max-width: 128px;
	height: auto;
	aspect-ratio: 1;
	border: 1px solid gray;
	border-radius: 25%;
	box-shadow: 1px 1px #d3d3d3;
	margin-bottom: 8px;
	display: block;
}

.app {
	text-decoration: none;
	position: relative;
	font-weight: bold;
}

.grid3 .app {
	max-width: 128px;
	display: block;
	font-size: 14px;
	line-height: 90%;
	text-align: center;
	overflow-wrap: anywhere;
}

.list .app {
	display: flex;
	align-items: center;
	padding: 12px 24px;
	gap: 0.8em;
	background-color: #f2f2f2;
	border-radius: 5px;
	margin-bottom: 10px;
}

.app:last-child() {
	margin-bottom: 0;
}

.h2 {
	margin-bottom: 16px;
	font-weight: normal;
}

.section {
	margin-bottom: 24px;
}

.section:last-child {
	margin-bottom: 0;
}

.app-link::after {
	content: '';
	position: absolute;
	inset: 0;
	z-index: 1;
}
</style>
