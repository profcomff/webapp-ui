<script setup lang="ts">
defineProps<{ modelValue?: string }>();
defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
	<input class="input" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
</template>

<style scoped>
.input {
	border: none;
	box-shadow: 0 1px 0 var(--color-primary-dark);
	padding: 16px;
	border-radius: 4px 4px 0 0;
	background: var(--color-primary-light);
	outline: none;
	font-size: 16px;
	display: block;
}

.input:focus-visible {
	box-shadow: 0 2px 0 var(--color-accent);
}
</style>
