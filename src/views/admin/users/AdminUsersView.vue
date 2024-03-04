<script setup lang="ts">
import { AuthApi } from '@/api';
import { onMounted } from 'vue';
import UsersTable from '../UsersTable.vue';
import AccessAllowed from '@/components/AccessAllowed.vue';
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
		<AccessAllowed :scope="scopename.auth.user.read">
			<UsersTable :users="authStore.users.values()" delete-icon="delete_forever" />
		</AccessAllowed>
	</IrdomLayout>
</template>
