<script setup lang="ts">
withDefaults(
	defineProps<{
		elevated: boolean;
	}>(),
	{ elevated: false },
);
</script>

<template>
	<button type="button" :class="{ outlined: !elevated, elevated, button: true }">
		<slot />
	</button>
</template>

<style scoped>
.button {
	--background: transparent;

	background: var(--background);
	border-radius: 8px;
	padding: 6px 16px;
	font-size: 14px;
	font-weight: 500;

	&:not(:disabled) {
		&:hover {
			background: color-mix(in oklab, var(--color-primary-dark) 5%, var(--background));
		}

		&:active {
			background: color-mix(in oklab, var(--color-primary-dark) 9%, var(--background));
		}
	}

	&:disabled {
		opacity: 0.4;
	}
}

.outlined {
	border: 1px solid color-mix(in oklab, transparent 50%, var(--color-primary-dark));

	&:disabled {
		border: 1px solid color-mix(in oklab, transparent 20%, var(--color-primary-light));
	}
}

.elevated {
	&:not(:disabled) {
		--background: color-mix(in oklab, transparent 83.5%, var(--color-primary));

		box-shadow: 1px 2px oklab(0% 0 0 / 30%), 1px 3px 1px oklch(0% 0 0 / 15%);
	}

	--background: color-mix(in oklab, transparent 83.5%, var(--color-primary-dark));
}
</style>
