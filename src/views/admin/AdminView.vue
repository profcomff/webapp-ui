<script setup lang="ts">
import { MeInfo, authProfileApi } from '@/api/auth';
import { IrdomLayout, AnonymousMessage } from '@/components';
import { useProfileStore } from '@/store';
import { onMounted } from 'vue';

const profileStore = useProfileStore();

onMounted(async () => {
	if (profileStore.token && !profileStore.userScopes) {
		const { data } = await authProfileApi.getMe<MeInfo.UserScopes>({ info: [MeInfo.UserScopes] });
	}
});
</script>

<template>
	<IrdomLayout title="Админка">
		<template v-if="profileStore.token">
			<RouterLink to="/admin/groups" class="link">Редактироване групп пользователей</RouterLink>
			<RouterLink to="/admin/scopes" class="link">Редактирование прав доступа</RouterLink>
		</template>
		<AnonymousMessage v-else />
	</IrdomLayout>
</template>

<style scoped>
.section-title {
	margin-bottom: 20px;
	display: inline;
}

.section {
	margin-bottom: 40px;
}

.section:last-child {
	margin-bottom: 0;
}
.link {
	margin-bottom: 8px;
}

.link:last-child {
	margin-bottom: 0;
}
</style>
