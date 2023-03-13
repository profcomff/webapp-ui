<script setup lang="ts">
import { authGroupApi } from '@/api/auth';
import { useAuthStore } from '@/store';
import { onMounted } from 'vue';
import GroupTreeNode from './GroupTreeNode.vue';
import { convertGroupArrayToTree } from '@/utils/groupsTree';
import { IrdomLayout } from '@/components';

const authStore = useAuthStore();

onMounted(async () => {
	if (!authStore.groupsTree) {
		const {
			data: { items: groups },
		} = await authGroupApi.getGroups({ info: ['child', 'scopes'] });

		for (const group of groups) {
			const { data } = await authGroupApi.getGroup(group.id, { info: ['child', 'scopes'] });
			authStore.addGroup({
				...data,
				children: data.child.map(c => c.id),
				scopes: data.scopes.map(s => s.id),
			});
		}
		authStore.groupsTree = convertGroupArrayToTree(Array.from(authStore.groups.values()));
	}
});
</script>

<template>
	<IrdomLayout title="Редактирование групп пользователей" back="/admin">
		<GroupTreeNode :node="authStore.groupsTree" />
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
