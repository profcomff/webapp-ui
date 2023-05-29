<script setup lang="ts">
import ErrorLayout from './ErrorLayout.vue';
import Forbidden from '@/assets/forbidden.svg';
</script>

<template>
	<ErrorLayout title="403 Forbidden" :image="Forbidden">
		<template #heading> О нет… </template>
		<template #subheading> Доступ к этой странице запрещен </template>
	</ErrorLayout>
</template>
