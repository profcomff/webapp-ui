<template>
	<div
		v-for="button in buttons"
		:key="button.id"
		class="w-100 my-2 py-2 d-flex align-center justify-start"
		@click="console.log(button.id)"
	>
		<v-icon class="mx-2" :icon="button.icon ?? ''" color="black" />
		<div class="text-black">{{ button.name }}</div>
	</div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { ServiceData } from '@/models';

defineProps({
	buttons: { type: Array as PropType<ServiceData[]>, required: true },
});
</script>
