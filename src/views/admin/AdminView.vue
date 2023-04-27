<script setup lang="ts">
import { AccessAllowed, IrdomLayout } from '@/components';
import { MaterialIcon } from '@/components/lib';
import { scopename } from '@/models';
import { useProfileStore } from '@/store';

const profileStore = useProfileStore();

const copyToken = () => {
	if (profileStore.token) {
		navigator.clipboard.writeText(profileStore.token).catch(err => {
			console.error(err);
		});
	}
};
</script>

<template>
	<IrdomLayout title="Админка">
		<p class="id">Ваш id: {{ profileStore.id }}</p>
		<button type="button" @click="copyToken">Скопировать токен <MaterialIcon name="content_copy" /></button>
		<RouterLink to="/admin/groups" class="link">Группы пользователей</RouterLink>

		<AccessAllowed :scope="scopename.auth.scope.read" no-fallback>
			<RouterLink to="/admin/scopes" class="link"> Права доступа </RouterLink>
		</AccessAllowed>

		<AccessAllowed :scope="scopename.auth.user.read" no-fallback>
			<RouterLink to="/admin/users" class="link">Пользователи</RouterLink>
		</AccessAllowed>
	</IrdomLayout>
</template>

<style>
.id {
	opacity: 0.7;
}
</style>
