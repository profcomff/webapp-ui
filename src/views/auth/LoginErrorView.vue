<!-- Страница, которую видит пользователь, если что-то пошло не так при аутентификации -->
<script setup lang="ts">
import { IrdomLayout } from '@/components';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
	<IrdomLayout title="Вход" backable back="/auth">
		<p>Произошла ошибка при входе в аккаунт</p>
		<p>{{ route.query.text }}</p>
		<RouterLink to="/auth" class="link">Вернуться к методам входа</RouterLink>
	</IrdomLayout>
</template>

<style scoped>
.link {
	align-self: start;
}
</style>
