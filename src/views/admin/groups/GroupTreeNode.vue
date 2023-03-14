<script setup lang="ts">
import { authGroupApi } from '@/api/auth';
import { useAuthStore, useProfileStore } from '@/store';
import { IrdomPopover, MaterialIcon } from '@/components/lib';
import { AuthGroup } from '@/store/auth';
import { ref, nextTick } from 'vue';
import { scopename } from '@/models';

const props = withDefaults(defineProps<{ node: AuthGroup | null; indentSize?: number }>(), {
	indentSize: 32,
});

const { isUserLogged, hasTokenAccess } = useProfileStore();
const authStore = useAuthStore();

const createGroup = async (e: Event) => {
	if (props.node && hasTokenAccess(scopename.auth.group.create)) {
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		const name = formData.get('new-group-name')!.toString();
		const parentId = props.node.id;
		const group = authStore.groups.get(parentId);

		if (isUserLogged() && group) {
			const { data } = await authGroupApi.createGroup({ name, parent_id: group.id, scopes: [] });
			authStore.setGroup(data);

			form.reset();
			if (details.value) {
				details.value.open = true;
			}
		}
	}
};

const deleteGroup = async (groupId?: number) => {
	if (hasTokenAccess(scopename.auth.group.delete) && groupId) {
		await authGroupApi.deleteGroup(groupId);
		authStore.deleteGroup(groupId);
	}
};

const open = ref(false);
const showForm = ref(false);
const details = ref<HTMLDetailsElement | null>(null);
const input = ref<HTMLInputElement | null>(null);

const showFormHandler = () => {
	if (details.value) {
		details.value.open = true;
	}
	showForm.value = true;

	nextTick(() => {
		if (input.value) {
			input.value.focus();
		}
	});
};

const toggleHandler = () => {
	open.value = !open.value;
	if (showForm.value) {
		showForm.value = open.value;
	}
};
</script>

<template>
	<details
		v-if="node"
		:style="{ marginLeft: `${node.parent_id ? indentSize : 0}px` }"
		class="node"
		:open="node.parent_id === null ? true : false"
		@toggle="toggleHandler"
		ref="details"
	>
		<summary :class="['summary', { nomarker: node.children.size === 0 }]">
			<RouterLink :to="`/admin/group/${node.id}`" class="link">
				{{ node.name }}
			</RouterLink>

			<IrdomPopover
				style="font-size: 12px"
				v-id="hasTokenAccess(scopename.auth.group.create) || hasTokenAccess(scopename.auth.group.delete)"
			>
				<template #expander>
					<MaterialIcon name="more_horiz" />
				</template>

				<ul>
					<li>
						<button
							type="button"
							v-if="hasTokenAccess(scopename.auth.group.create)"
							@click="showFormHandler"
							class="menu-button"
						>
							Добавить группу
						</button>
					</li>
					<li v-if="node.parent_id && hasTokenAccess(scopename.auth.group.delete)">
						<button type="button" @click="deleteGroup(node?.id)" class="menu-button delete">Удалить</button>
					</li>
				</ul>
			</IrdomPopover>
		</summary>

		<template v-if="open">
			<GroupTreeNode
				v-for="child of node.children.values()"
				:node="child"
				:indent-size="indentSize"
				:key="child.id"
			/>
		</template>
		<form class="form" @submit.prevent="createGroup" v-if="showForm">
			<MaterialIcon name="add" />

			<label for="new-group-name">
				name
				<input type="text" id="new-group-name" name="new-group-name" required ref="input" />
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
	display: flex;
	align-items: center;
	gap: 16px;
}

.node .node {
	border-left: 1px solid gray;
}

.menu-button {
	padding: 8px 16px;
	width: 100%;
	font-size: 16px;
	text-align: start;
}

.delete {
	color: red;
}

.nomarker::marker {
	content: '';
}
</style>
