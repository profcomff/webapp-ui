<script setup lang="ts">
import { AuthApi } from '@/api';
import { onMounted } from 'vue';
import UsersTable from '../UsersTable.vue';
import AccessRestricted from '@/components/AccessRestricted.vue';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { scopename } from '@/models/ScopeName';
import { useAuthStore } from '@/store/auth';
import { useToolbar } from '@/store/toolbar';

const toolbar = useToolbar();

toolbar.setup({
	title: 'Пользователи',
	backUrl: '/admin',
});

onMounted(() => {
	AuthApi.getUsers();
});

const authStore = useAuthStore();
</script>

<template>
	<IrdomLayout>
		<AccessRestricted :scope="scopename.auth.user.read">
			<UsersTable :users="authStore.users.values()" delete-icon="delete_forever" />
		</AccessRestricted>
	</IrdomLayout>
</template>
