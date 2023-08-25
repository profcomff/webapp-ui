<script setup lang="ts">
import { AccessAllowed, IrdomLayout } from '@/components';
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
			<v-btn type="button" append-icon="md:content_copy" @click="copyToken">Скопировать токен</v-btn>
		</div>
		<RouterLink to="/admin/groups" class="link">Группы пользователей</RouterLink>

		<AccessAllowed :scope="scopename.auth.scope.read" no-fallback>
			<RouterLink to="/admin/scopes" class="link"> Права доступа </RouterLink>
		</AccessAllowed>

		<AccessAllowed :scope="scopename.auth.user.read" no-fallback>
			<RouterLink to="/admin/users" class="link">Пользователи</RouterLink>
		</AccessAllowed>

		<AccessAllowed :scope="scopename.achievements.achievement.create" no-fallback>
			<RouterLink to="/admin/achievement" class="link">Достижения</RouterLink>
		</AccessAllowed>
	</IrdomLayout>
</template>

<style>
.info {
	opacity: 0.7;
	display: flex;
	column-gap: 8px;
	align-items: center;
}
</style>
