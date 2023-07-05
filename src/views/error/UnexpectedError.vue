<script setup lang="ts">
import ErrorLayout from './ErrorLayout.vue';
import UnexpectedError from '@/assets/unexpected_error.svg';
</script>

<template>
	<ErrorLayout title="Network Error" :image="UnexpectedError">
		<template #heading> Непредвиденная ошибка </template>
	</ErrorLayout>
</template>
