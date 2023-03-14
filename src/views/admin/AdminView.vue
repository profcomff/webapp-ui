<script setup lang="ts">
import { authProfileApi } from '@/api/auth';
import { Group } from '@/api/models';
import { IrdomLayout } from '@/components';
import { LocalStorage } from '@/models';
import { onMounted, ref } from 'vue';

const token = LocalStorage.getToken();

const groups = ref<Group[]>([]);

onMounted(async () => {
	if (token) {
		groups.value = await authProfileApi.getMe(token, { info: ['groups'] }).then(res => res.data.groups);
	}
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
