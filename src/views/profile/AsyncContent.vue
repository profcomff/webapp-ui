<script setup lang="ts">
import { authProfileApi } from '@/api/auth';
import { useProfileStore } from '@/store';

const { token } = useProfileStore();

const { data } = token
	? await authProfileApi.getMe(token, { info: ['groups', 'indirect_groups', 'user_scopes'] })
	: { data: 'error' };
</script>

<template>
	{{ JSON.stringify(data) }}
</template>

<style scoped></style>
