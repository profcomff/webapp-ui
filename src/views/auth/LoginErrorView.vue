<script setup lang="ts">
import { IrdomLayout } from '@/components';
</script>

<template>
	<IrdomLayout title="Вход" backable back="/profile/auth">
		<p>Произошла ошибка при входе в аккаунт</p>
		<p>{{ ($route.query.text as string) ?? undefined }}</p>
		<RouterLink to="/profile/auth" class="link">Вернуться к методам входа</RouterLink>
	</IrdomLayout>
</template>

<style scoped>
.link {
	align-self: start;
}
</style>
