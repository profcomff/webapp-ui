<script setup lang="ts">
import ErrorLayout from './ErrorLayout.vue';
import NotFound from '@/assets/not_found.svg';
</script>

<template>
	<ErrorLayout title="404 Not Found" :image="NotFound">
		<template #heading> Страница не найдена </template>
		<template #subheading> Поищите еще! </template>
	</ErrorLayout>
</template>
