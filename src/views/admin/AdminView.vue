<script setup lang="ts">
import { AccessAllowed, IrdomLayout } from '@/components';
import { scopename } from '@/models';
</script>

<template>
	<IrdomLayout title="Админка">
		<RouterLink to="/admin/groups" class="link">Группы пользователей</RouterLink>

		<AccessAllowed :scope="scopename.auth.scope.read" no-fallback>
			<RouterLink to="/admin/scopes" class="link"> Права доступа </RouterLink>
		</AccessAllowed>

		<AccessAllowed :scope="scopename.auth.user.read" no-fallback>
			<RouterLink to="/admin/users" class="link">Пользователи</RouterLink>
		</AccessAllowed>
	</IrdomLayout>
</template>
