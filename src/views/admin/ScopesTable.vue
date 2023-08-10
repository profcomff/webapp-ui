<script setup lang="ts">
import { Scope } from '@/api/models';
import { computed } from 'vue';

const props = defineProps<{
	scopes: Iterable<Scope>;
	deleteIcon: string;
}>();

defineEmits<{ delete: [scopeId: number] }>();

const sorted = computed(() => [...props.scopes].sort((a, b) => (a.name > b.name ? 1 : -1)));
</script>

<template>
	<v-table class="table">
		<thead>
			<tr>
				<th>id</th>
				<th>name</th>
				<th>comment</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="{ id, name, comment } of sorted" :key="id" class="row">
				<td>{{ id }}</td>
				<td>{{ name }}</td>
				<td>{{ comment }}</td>
				<td>
					<v-btn type="button" @click="$emit('delete', id)" icon="md:delete_forever" variant="text" />
				</td>
			</tr>
		</tbody>
	</v-table>
</template>

<style scoped>
.row {
	&:nth-child(even) {
		background: oklch(0 0 0deg / 8%);
	}

	@media screen and (width <= 575px) {
		font-size: 12px;
	}
}
</style>
