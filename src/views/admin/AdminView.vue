<script setup lang="ts">
import { authProfileApi } from '@/api/auth';
import { Group } from '@/api/models';
import { IrdomLayout } from '@/components';
import { useProfileStore } from '@/store';
import { onMounted, ref } from 'vue';

const { token } = useProfileStore();

const groups = ref<Group[]>([]);

onMounted(async () => {
	if (token) {
		groups.value = await authProfileApi.getMe(token, { info: ['groups'] }).then(res => res.data.groups);
	}
});
</script>

<template>
	<IrdomLayout title="Админка">
		<RouterLink to="/admin/groups" class="link">Редактироване групп пользователей</RouterLink>
		<RouterLink to="/admin/scopes" class="link">Редактирование прав доступа</RouterLink>
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
