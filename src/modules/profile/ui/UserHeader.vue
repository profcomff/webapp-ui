<script setup lang="ts">
defineProps<{
	userName: string;
	photoUrl: string;
}>();
</script>

<template>
	<div class="d-flex flex-row align-center ga-8">
		<v-avatar size="120" class="flex-shrink-0">
			<v-img :src="photoUrl" :alt="userName" cover />
		</v-avatar>
		<h2>
			{{ userName }}
		</h2>
	</div>
</template>
