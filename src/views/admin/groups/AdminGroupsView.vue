<script setup lang="ts">
import { GroupInfo, authGroupApi } from '@/api/auth';
import { useAuthStore } from '@/store';
import { onMounted, computed } from 'vue';
import GroupTreeNode from './GroupTreeNode.vue';
import { IrdomLayout } from '@/components';
import { StoreGroup } from '@/store/auth';

const authStore = useAuthStore();

onMounted(async () => {
	if (authStore.groups.size === 0) {
		const {
			data: { items: groups },
		} = await authGroupApi.getGroups<GroupInfo.Children | GroupInfo.Scopes>([GroupInfo.Children, GroupInfo.Scopes]);

		for (const group of groups) {
			authStore.setScopes(group.scopes);
			authStore.setGroup(group);
		}
	}
});

const roots = computed(() => {
	const arr: StoreGroup[] = [];
	for (const group of authStore.groups.values()) {
		if (group.parent_id === null) {
			arr.push(group);
		}
	}
	return arr;
});
</script>

<template>
	<IrdomLayout title="Редактирование групп пользователей" backable back="/admin">
		<GroupTreeNode v-for="root of roots" :node="root" :key="root.id" />
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
