<script setup lang="ts">
import { GroupInfo, authGroupApi } from '@/api/auth';
import { onMounted, computed } from 'vue';
import GroupTreeNode from './GroupTreeNode.vue';
import { StoreGroup, useAuthStore } from '@/store/auth';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { useToolbar } from '@/store/toolbar';
import { useProfileStore } from '@/store/profile';
import { scopename } from '@/models/ScopeName';

const authStore = useAuthStore();
const toolbar = useToolbar();
const profileStore = useProfileStore();
const { hasTokenAccess } = profileStore;

toolbar.setup({
	title: 'Редактирование групп пользователей',
	backUrl: '/admin',
});

onMounted(async () => {
	if (authStore.groups.size === 0) {
		const {
			data: { items: groups },
		} = await authGroupApi.getGroups<GroupInfo.Children | GroupInfo.Scopes>([
			GroupInfo.Children,
			GroupInfo.Scopes,
		]);

		for (const group of groups) {
			authStore.setScopes(group.scopes);
			authStore.setGroup(group);
		}
	}
});

const createGroup = async (e: Event) => {
	if (hasTokenAccess(scopename.auth.group.create)) {
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		const name = formData.get('new-group-name')!.toString();

		if (profileStore.isUserLogged) {
			const { data } = await authGroupApi.createGroup({ name, parent_id: null, scopes: [] });
			authStore.setGroup(data);

			form.reset();
		}
	}
};

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
	<IrdomLayout>
		<v-expansion-panels>
			<GroupTreeNode v-for="root of roots" :key="root.id" :node="root" />
		</v-expansion-panels>
		<v-form class="d-flex new-group" @submit.prevent="createGroup">
			<v-text-field label="name" name="new-group-name" prepend-icon="md:add" required />
			<v-btn type="submit" icon="md:done" />
		</v-form>
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

.new-group {
	gap: 16px;
	margin: 16px 0;
}
</style>
