<script setup lang="ts">
export interface NavbarItem {
	name: string;
	icon: string;
	path: string[];
}

defineProps<{
	items: NavbarItem[];
}>();
</script>

<template>
	<v-bottom-navigation class="bg-indigo-darken-4" grow>
		<v-btn v-for="{ icon, name, path } in items" :key="name" @click="$router.push(path[0])">
			<v-icon :icon="`md:${icon}`" />
			{{ name }}
		</v-btn>
	</v-bottom-navigation>
</template>
