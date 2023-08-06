<script setup lang="ts">
import { IrdomPopover, MaterialIcon } from '@/components/lib';
import { nextTick, ref } from 'vue';
import { useAuthStore, useProfileStore } from '@/store';
import { StoreGroup } from '@/store/auth';
import { authGroupApi } from '@/api/auth';
import { scopename } from '@/models';

const props = withDefaults(defineProps<{ node: StoreGroup | null; indentSize?: number }>(), {
	indentSize: 32,
});

const profileStore = useProfileStore();
const { hasTokenAccess } = profileStore;
const authStore = useAuthStore();

const createGroup = async (e: Event) => {
	if (props.node && hasTokenAccess(scopename.auth.group.create)) {
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const name = formData.get('new-group-name')!.toString();
		const parentId = props.node.id;
		const group = authStore.groups.get(parentId);

		if (profileStore.isUserLogged && group) {
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
		ref="details"
		:style="{ marginLeft: `${node.parent_id ? indentSize : 0}px` }"
		class="node"
		:open="node.parent_id === null ? true : false"
		@toggle="toggleHandler"
	>
		<summary :class="['summary', { nomarker: node.children.size === 0 }]">
			<div class="summary-wrapper">
				<RouterLink :to="`/admin/group/${node.id}`" class="link">
					{{ node.name }}
				</RouterLink>

				<IrdomPopover
					v-id="hasTokenAccess(scopename.auth.group.create) || hasTokenAccess(scopename.auth.group.delete)"
					style="font-size: 12px"
				>
					<template #expander>
						<MaterialIcon name="more_horiz" />
					</template>

					<ul>
						<li>
							<button
								v-if="hasTokenAccess(scopename.auth.group.create)"
								type="button"
								class="menu-button"
								@click="showFormHandler"
							>
								Добавить группу
							</button>
						</li>
						<li v-if="node.parent_id && hasTokenAccess(scopename.auth.group.delete)">
							<button type="button" class="menu-button delete" @click="deleteGroup(node?.id)">
								Удалить
							</button>
						</li>
					</ul>
				</IrdomPopover>
			</div>
		</summary>

		<template v-if="open">
			<GroupTreeNode
				v-for="child of node.children.values()"
				:key="child.id"
				:node="child"
				:indent-size="indentSize"
			/>
		</template>
		<form v-if="showForm" class="form" @submit.prevent="createGroup">
			<MaterialIcon name="add" />

			<label for="new-group-name">
				name
				<input id="new-group-name" ref="input" type="text" name="new-group-name" required />
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
	gap: 16px;
}

.summary-wrapper {
	display: inline-flex;
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
