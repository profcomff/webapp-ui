<script setup lang="ts">
import { AccessAllowed, IrdomLayout } from '@/components';
import { scopename } from '@/models';
</script>

<template>
	<IrdomLayout title="Админка">
		<RouterLink to="/admin/groups" class="link">Редактироване групп пользователей</RouterLink>

		<AccessAllowed :scope="scopename.auth.scope.read" no-fallback>
			<RouterLink to="/admin/scopes" class="link"> Редактирование прав доступа </RouterLink>
		</AccessAllowed>
	</IrdomLayout>
</template>
