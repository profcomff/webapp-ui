<script setup lang="ts">
import ErrorLayout from './ErrorLayout.vue';
import NetworkError from '@/assets/network_error.svg';
</script>

<template>
	<ErrorLayout title="Network Error" :image="NetworkError">
		<template #heading> Эта страница недоступна без Интернета </template>
		<template #subheading> Пропало подключение к сети </template>
	</ErrorLayout>
</template>
