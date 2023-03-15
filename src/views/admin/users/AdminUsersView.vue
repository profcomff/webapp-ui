<script setup lang="ts">
import { AuthApi } from '@/api';
import { AccessAllowed, IrdomLayout } from '@/components';
import { scopename } from '@/models';
import { onMounted } from 'vue';
import UsersTable from '../UsersTable.vue';
import { useAuthStore } from '@/store';

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

<style scoped></style>
