<script setup lang="ts">
import { useProfileStore } from '@/store/profile';

defineProps<{ scope: string }>();

const { hasTokenAccess } = useProfileStore();
</script>

<template>
	<slot v-if="hasTokenAccess(scope)" />

	<slot v-else name="fallback">
		<h2>403 Forbidden</h2>
	</slot>
</template>
