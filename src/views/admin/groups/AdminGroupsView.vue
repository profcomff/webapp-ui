<script setup lang="ts">
import { authGroupApi } from '@/api/auth';
import { useAuthStore } from '@/store';
import { onMounted, computed } from 'vue';
import GroupTreeNode from './GroupTreeNode.vue';
import { IrdomLayout } from '@/components';

const authStore = useAuthStore();

onMounted(async () => {
	if (authStore.groups.size === 0) {
		const {
			data: { items: groups },
		} = await authGroupApi.getGroups({ info: ['child', 'scopes'] });

		for (const group of groups) {
			const { data } = await authGroupApi.getGroup<'child' | 'scopes'>(group.id, { info: ['child', 'scopes'] });
			authStore.setScopes(data.scopes);
			authStore.setGroup(data);
		}
	}
});

const root = computed(() => {
	for (const group of authStore.groups.values()) {
		if (group.parent_id === null) {
			return group;
		}
	}
	return null;
});
</script>

<template>
	<IrdomLayout title="Редактирование групп пользователей" back="/admin">
		<GroupTreeNode :node="root" />
	</IrdomLayout>
</template>

<style scoped>
.form {
	display: flex;
	gap: 16px;
	margin-left: 16px;
	align-items: center;
}

.form input {
	padding: 2px 8px;
}

.group-section {
	margin-bottom: 20px;
}

.group-section:last-child {
	margin-bottom: 0;
}

.group-section-title {
	margin-bottom: 4px;
	display: inline;
}
</style>
