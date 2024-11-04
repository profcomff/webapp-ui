<!-- Страница, которую видит пользователь, если что-то пошло не так при аутентификации -->
<script setup lang="ts">
import { useRoute } from 'vue-router';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { useToolbar } from '@/store/toolbar';

const route = useRoute();
const toolbar = useToolbar();

toolbar.setup({
	title: 'Вход',
});
</script>

<template>
	<IrdomLayout>
		<p>Произошла ошибка при входе в аккаунт</p>
		<p>{{ route.query.text }}</p>
		<RouterLink :to="route.query.from == 'oauth' ? '/profile/edit-auth' : '/auth'" class="link"
			>Вернуться к методам входа</RouterLink
		>
	</IrdomLayout>
</template>

<style scoped>
.link {
	align-self: start;
}
</style>
