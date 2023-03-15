<script setup lang="ts">
import { IrdomLayout } from '@/components';
import { RouterLink } from 'vue-router';

console.log(history.state.back);
</script>

<template>
	<IrdomLayout title="403 Forbidden" backable>
		У вас нет доступа к этой странице
		<RouterLink to="/timetable" class="link">Вернуться на главную</RouterLink>
	</IrdomLayout>
</template>
