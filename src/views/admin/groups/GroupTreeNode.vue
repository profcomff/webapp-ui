<script setup lang="ts">
import { authGroupApi } from '@/api/auth';
import { scopename } from '@/models/ScopeName';
import { StoreGroup, useAuthStore } from '@/store/auth';
import { useProfileStore } from '@/store/profile';
import { ref } from 'vue';
import { VExpansionPanel } from 'vuetify/components';

const props = withDefaults(defineProps<{ node: StoreGroup | null; indentSize?: number }>(), {
	indentSize: 32,
});

const profileStore = useProfileStore();
const { hasTokenAccess } = profileStore;
const authStore = useAuthStore();
const panel = ref<VExpansionPanel | null>(null);

const createGroup = async (e: Event) => {
	if (props.node && hasTokenAccess(scopename.auth.group.create)) {
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		const name = formData.get('new-group-name')!.toString();
		const parentId = props.node.id;
		const group = authStore.groups.get(parentId);

		if (profileStore.isUserLogged && group) {
			const { data } = await authGroupApi.createGroup({ name, parent_id: group.id, scopes: [] });
			authStore.setGroup(data);

			form.reset();
		}
	}
};

const deleteGroup = async (groupId?: number) => {
	if (hasTokenAccess(scopename.auth.group.delete) && groupId) {
		await authGroupApi.deleteGroup(groupId);
		authStore.deleteGroup(groupId);
	}
};
</script>

<template>
	<v-expansion-panel v-if="node" ref="panel">
		<v-expansion-panel-title>
			<RouterLink :to="`/admin/group/${node.id}`" class="link">
				{{ node.name }}
			</RouterLink>

			<v-menu
				v-if="
					hasTokenAccess(scopename.auth.group.create) || hasTokenAccess(scopename.auth.group.delete)
				"
				icon="more_horiz"
			>
				<template #activator="{ props: menuProps }">
					<v-btn icon="md:more_horiz" v-bind="menuProps" variant="text" />
				</template>
				<v-list>
					<v-list-item v-if="hasTokenAccess(scopename.auth.group.create)">
						Добавить группу
					</v-list-item>
					<v-list-item
						v-if="node.parent_id && hasTokenAccess(scopename.auth.group.delete)"
						color="var(--v-theme-error)"
						@click="deleteGroup(node?.id)"
					>
						Удалить
					</v-list-item>
				</v-list>
			</v-menu>
		</v-expansion-panel-title>

		<v-expansion-panel-text>
			<v-expansion-panels class="list">
				<GroupTreeNode
					v-for="child of node.children.values()"
					:key="child.id"
					:node="child"
					:indent-size="indentSize"
				/>
			</v-expansion-panels>

			<v-form class="d-flex form" @submit.prevent="createGroup">
				<v-text-field label="name" name="new-group-name" prepend-icon="md:add" required />
				<v-btn type="submit" icon="md:done" />
			</v-form>
		</v-expansion-panel-text>
	</v-expansion-panel>
</template>

<style scoped>
.form {
	gap: 16px;
}

.list {
	margin-bottom: 12px;
}
</style>
