<script setup lang="ts">
import { AuthApi } from '@/api';
import { IrdomLayout } from '@/components';
import { useAuthStore } from '@/store';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const authStore = useAuthStore();

const userId = computed(() => +route.params.id);

onMounted(() => {
	AuthApi.getUser(userId);
});
</script>

<template>
	<IrdomLayout title="Пользователь">
		{{ JSON.stringify(authStore.users.get(userId)) }}
	</IrdomLayout>
</template>
