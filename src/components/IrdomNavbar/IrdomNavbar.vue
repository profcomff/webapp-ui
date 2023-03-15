<script setup lang="ts">
import { MaterialIcon } from '../lib';
import { NavbarItem } from './types';

defineProps<{
	items: NavbarItem[];
}>();
</script>
<template>
	<nav class="nav">
		<div class="container wrapper">
			<div
				v-for="{ icon, name, path } in items"
				:class="['nav-item', { active: $route.path.startsWith(path) }]"
				:key="name"
			>
				<MaterialIcon :name="icon" />
				<RouterLink :key="name" :to="path" class="navbar-link">
					{{ name }}
				</RouterLink>
			</div>
		</div>
	</nav>
</template>
<style scoped>
.nav {
	width: 100%;
	position: fixed;
	bottom: 0;
	height: var(--navbar-height);
	background: var(--color-primary-dark);
	color: white;
	z-index: 998;
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
	justify-content: start;
	text-decoration: none;
	color: inherit;
	border-bottom: 3px solid transparent;
	font-size: 14px;
	font-weight: normal;
	position: relative;
	padding-top: 8px;
}

.navbar-link::after {
	content: '';
	position: absolute;
	inset: 0;
	z-index: 999;
}

.active {
	color: var(--color-accent);
	border-bottom: 3px solid var(--color-accent);
}
</style>
