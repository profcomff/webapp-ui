<!-- Страница со списком основных методов входа -->
<script setup lang="ts">
import { IrdomAuthButton, IrdomLayout } from '@/components';
import { authButtons } from '@/constants';
</script>

<template>
	<IrdomLayout title="Вход">
		<h2 class="title">Войти через</h2>
		<IrdomAuthButton
			v-for="i in 3"
			:key="authButtons[i - 1].name"
			type="button"
			:button="authButtons[i - 1]"
			class="button"
		/>
		<RouterLink to="/auth/all" class="link">Все способы входа</RouterLink>
	</IrdomLayout>
</template>

<style scoped>
.button {
	margin-bottom: 16px;
	width: min(512px, 100%);
}

.title {
	margin-bottom: 20px;
}

.link {
	align-self: start;
}
</style>
