<script setup lang="ts">
import { useProfileStore } from '@/store';

const { hasTokenAccess } = useProfileStore();
withDefaults(defineProps<{ scope: string; noFallback: boolean }>(), {
	noFallback: false,
});
</script>

<template>
	<template v-if="hasTokenAccess(scope)">
		<slot />
	</template>

	<h2 v-else>
		<slot name="fallback" v-if="!noFallback">
			<h2>403 Forbidden</h2>
		</slot>
	</h2>
</template>
