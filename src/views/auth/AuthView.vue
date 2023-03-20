<script setup lang="ts">
import { IrdomLayout, IrdomAuthButton } from '@/components';
import { authButtons } from '@/constants';
</script>

<template>
	<IrdomLayout title="Вход">
		<IrdomAuthButton
			type="button"
			v-for="i in 3"
			:button="authButtons[i]"
			:key="authButtons[i].name"
			class="button"
		/>
		<RouterLink to="/profile/auth/all" class="link">Все способы входа</RouterLink>
	</IrdomLayout>
</template>

<style scoped>
.button {
	margin-bottom: 16px;
}

.link {
	align-self: start;
}
</style>
