<template>
	<v-row v-for="row in rows + 1" :key="row" class="w-100 px-0 mx-0" justify="space-around">
		<v-col
			v-for="button in buttons.slice((row - 1) * 3, row * 3)"
			:key="button.id"
			class="app-button px-0 ma-0"
			cols="4"
			@click="console.log(button.id)"
		>
			<v-sheet class="bg-white">
				<v-img
					v-if="button.icon?.startsWith('https')"
					:src="button.icon ?? ''"
					:width="100"
					height="auto"
				/>
				<v-icon v-else class="mx-1" :icon="button.icon ?? ''" :size="90" />
				<p class="text-center text-caption">{{ button.name }}</p>
			</v-sheet>
		</v-col>
		<v-col
			v-for="_ in (((buttons.length % 3) * 2) % 3) * Number(row == rows)"
			:key="_"
			class="app-button"
			cols="4"
		/>
	</v-row>
</template>

<script setup lang="ts">
import { ref, PropType } from 'vue';
import { ServiceData } from '@/models';

const props = defineProps({
	buttons: { type: Array as PropType<ServiceData[]>, required: true },
});

const rows = ref(Math.ceil(props.buttons.length / 3));
</script>

<style lang="css">
.app-button {
	justify-items: center;
	max-width: 144px;
	padding: 8px min(8px, 8%);
}
</style>
