<script setup lang="ts">
import AccessRestricted from '@/components/AccessRestricted.vue';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { scopename } from '@/models/ScopeName';
import { useProfileStore } from '@/store/profile';

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
			<v-btn type="button" append-icon="md:content_copy" @click="copyToken"
				>Скопировать токен</v-btn
			>
		</div>
		<RouterLink to="/admin/groups" class="link">Группы пользователей</RouterLink>

		<AccessRestricted :scope="scopename.auth.scope.read" no-fallback>
			<RouterLink to="/admin/scopes" class="link"> Права доступа </RouterLink>
		</AccessRestricted>

		<AccessRestricted :scope="scopename.auth.user.read" no-fallback>
			<RouterLink to="/admin/users" class="link">Пользователи</RouterLink>
		</AccessRestricted>

		<AccessRestricted :scope="scopename.achievements.achievement.create" no-fallback>
			<RouterLink to="/admin/achievement" class="link">Достижения</RouterLink>
		</AccessRestricted>
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
