<script setup lang="ts">
import { AuthApi } from '@/api';
import { onMounted } from 'vue';
import UsersTable from '../UsersTable.vue';
import AccessRestricted from '@/components/AccessRestricted.vue';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { scopename } from '@/models/ScopeName';
import { useAuthStore } from '@/store/auth';

onMounted(() => {
	AuthApi.getUsers();
});

const authStore = useAuthStore();

const back = history.state.back?.startsWith('/admin') ? history.state.back : '/admin';
</script>

<template>
	<IrdomLayout title="Пользователи" backable :back="back">
		<AccessRestricted :scope="scopename.auth.user.read">
			<UsersTable :users="authStore.users.values()" delete-icon="delete_forever" />
		</AccessRestricted>
	</IrdomLayout>
</template>
