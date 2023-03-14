<script setup lang="ts">
import { MeInfo, authProfileApi } from '@/api/auth';
import { useProfileStore } from '@/store';

const { token } = useProfileStore();

const { data } = token
	? await authProfileApi.getMe<MeInfo.Groups | MeInfo.IndirectGroups | MeInfo.TokenScopes | MeInfo.UserScopes>({
			info: [MeInfo.Groups, MeInfo.IndirectGroups, MeInfo.UserScopes, MeInfo.TokenScopes],
	  })
	: { data: 'error' };
</script>

<template>
	{{ JSON.stringify(data) }}
</template>

<style scoped></style>
