<script setup lang="ts">
import { IrdomLayout } from '@/components';
</script>

<template>
	<IrdomLayout title="404 Not Found" backable>
		Такой страницы не существует
		<RouterLink to="/timetable" class="link">Вернуться на главную</RouterLink>
	</IrdomLayout>
</template>
