<script setup lang="ts">
import { useProfileStore } from '@/store/profile';

const { hasTokenAccess } = useProfileStore();
withDefaults(defineProps<{ scope: string; noFallback?: boolean }>(), {
	noFallback: false
});
</script>

<template>
	<template v-if="hasTokenAccess(scope)">
		<slot />
	</template>

	<h2 v-else>
		<slot v-if="!noFallback" name="fallback">
			<h2>403 Forbidden</h2>
		</slot>
	</h2>
</template>
