<script setup lang="ts">
import { authProfileApi, authUserGroupApi } from '@/api/auth';
import { AuthGroup } from '@/api/models';
import { IrdomLayout } from '@/components';
import { LocalStorage } from '@/models';
import { computed, onMounted, ref } from 'vue';
import { authScopeApi } from '@/api/auth/AuthScopeApi';
import { useAuthStore } from '@/store';

const allowedGroups = ['admin', 'root'];

const token = LocalStorage.getToken();

const groups = ref<AuthGroup[]>([]);

const authStore = useAuthStore();

onMounted(async () => {
	if (token) {
		groups.value = await authProfileApi.getMe(token, { info: ['groups'] }).then(res => res.data.groups);
	}
});

const hasAccess = computed(() => {
	const names = groups.value.map(group => group.name);
	for (const name of names) {
		if (allowedGroups.includes(name)) {
			return true;
		}
	}
	return false;
});
</script>

<template>
	<IrdomLayout title="Админка">
		<RouterLink to="/admin/groups">Редактироване групп пользователей</RouterLink>
		<RouterLink to="/admin/scopes">Редактирование прав доступа</RouterLink>
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
</style>
