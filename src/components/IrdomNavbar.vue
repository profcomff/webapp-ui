<script setup lang="ts">
import { useRoute } from 'vue-router';
import { MaterialIcon } from './lib';

export interface NavbarItem {
	name: string;
	icon: string;
	path: string[];
}

const route = useRoute();

defineProps<{
	items: NavbarItem[];
}>();
</script>
<template>
	<nav class="nav">
		<div class="container wrapper">
			<div v-for="{ icon, name, path } in items" class="nav-item" :key="name">
				<span :class="['icon', { active: path.some(p => route.path.startsWith(p)) }]">
					<MaterialIcon :name="icon" :size="20" />
				</span>
				<RouterLink
					:key="name"
					:to="path[0]"
					:class="['navbar-link', { 'active-link': path.some(p => route.path.startsWith(p)) }]"
				>
					{{ name }}
				</RouterLink>
			</div>
		</div>
	</nav>
</template>
<style scoped>
.nav {
	height: var(--navbar-height);
	width: 100%;
	position: fixed;
	bottom: 0;
	background: var(--color-primary-dark);
	color: white;
	z-index: 998;
	padding: 12px 8px 16px;
}

.wrapper {
	display: flex;
	height: 100%;
}

.nav-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	text-decoration: none;
	color: inherit;
	font-size: 14px;
	font-weight: normal;
	position: relative;
}

.navbar-link {
	line-height: 16px;
	font-size: 12px;

	&::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 999;
	}
}

.active-link {
	font-weight: 500;
}

.icon {
	padding: 7px 26px;
	border-radius: 999px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 4px;
}

.active {
	background: oklch(66.98% 0.064 281.42 / 50%);
}
</style>
