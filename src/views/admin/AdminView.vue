<script setup lang="ts">
import { AccessAllowed, IrdomLayout } from '@/components';
import { scopename } from '@/models';
import { useProfileStore } from '@/store';

const profileStore = useProfileStore();
</script>

<template>
	<IrdomLayout title="Админка">
		<p class="id">Ваш id: {{ profileStore.id }}</p>
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
