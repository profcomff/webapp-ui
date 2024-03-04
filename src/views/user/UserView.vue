<script setup lang="ts">
import { AuthApi } from '@/api';
import { useAuthStore } from '@/store/auth';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import IrdomLayout from '@/components/IrdomLayout.vue';

const route = useRoute();
const authStore = useAuthStore();

const userId = computed(() => +route.params.id);

onMounted(() => {
	AuthApi.getUser(userId.value);
});
</script>

<template>
	<IrdomLayout title="Пользователь" backable>
		{{ JSON.stringify(authStore.users.get(userId)) }}
	</IrdomLayout>
</template>
