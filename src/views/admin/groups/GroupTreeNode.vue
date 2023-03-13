<script setup lang="ts">
import { GroupTreeNode as TreeNode } from '@/utils/groupsTree';
import { LocalStorage } from '@/models';
import { authGroupApi } from '@/api/auth';
import { useAuthStore } from '@/store';
import { MaterialIcon } from '@/components/lib';

const props = withDefaults(defineProps<{ node: TreeNode | null; indentSize?: number }>(), {
	indentSize: 32,
});

const token = LocalStorage.getToken();
const authStore = useAuthStore();

const createGroup = async (e: Event) => {
	if (props.node) {
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		const name = formData.get('new-group-name')!.toString();
		const parentId = props.node.id;
		const group = authStore.groups.get(parentId);

		if (group && token) {
			const { data } = await authGroupApi.createGroup({ name, parent_id: group.id, scopes: [] }, token);
			authStore.addGroup({ ...data, scopes: [], children: [] });
		}
	}
};

const deleteGroup = async ({ id, name, parent_id }: { id: number; name: string; parent_id: number | null }) => {
	if (token && parent_id) {
		await authGroupApi.deleteGroup(id, token);
		authStore.removeGroup({ id, name, parent_id });
	}
};
</script>

<template>
	<details v-if="node" :style="{ marginLeft: `${node.parent_id ? indentSize : 0}px` }" class="node" :open="true">
		<summary class="summary">
			<RouterLink :to="`/admin/group/${node.id}`" class="link">
				{{ node.name }}
			</RouterLink>
			<button
				type="button"
				@click="deleteGroup({ id: node!.id, name: node!.name, parent_id: node!.parent_id })"
				v-if="node.parent_id"
			>
				<MaterialIcon name="delete_forever" />
			</button>
		</summary>

		<GroupTreeNode v-for="child of node.children" :node="child" :indent-size="indentSize" />

		<form class="form" @submit.prevent="createGroup">
			<MaterialIcon name="add" />

			<label for="new-group-name">
				name
				<input type="text" id="new-group-name" name="new-group-name" required />
			</label>

			<button type="submit">
				<MaterialIcon name="done" />
			</button>
		</form>
	</details>
</template>

<style scoped>
.form {
	display: flex;
	gap: 16px;
	align-items: center;
	flex-wrap: wrap;
	margin-left: 21px;
}

.form input {
	padding: 2px 8px;
}

.form label {
	display: flex;
	gap: 4px;
}

.summary {
	padding: 8px 16px;
}

:is(.node .node):last-of-type {
	padding-bottom: 20px;
}

.node .node {
	border-left: 1px solid gray;
}

.link {
	color: blue;
}
</style>
