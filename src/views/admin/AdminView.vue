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
		<div class="info">
			<p>Ваш id: {{ profileStore.id }}</p>
			<button type="button" @click="copyToken">
				Скопировать токен <MaterialIcon name="content_copy" :size="14" />
			</button>
		</div>
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
.info {
	opacity: 0.7;
	display: flex;
	column-gap: 8px;
	align-items: center;

	& > button {
		transition: 0.3s ease;
		padding: 2px 4px;
		border-radius: 999px;

		&:hover {
			background: oklch(0% 0 0 / 20%);
		}
	}
}
</style>
