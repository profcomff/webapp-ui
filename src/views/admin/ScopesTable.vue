<script setup lang="ts">
import { MaterialIcon } from '@/components/lib';
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
	<table class="table">
		<thead class="row">
			<th>id</th>
			<th>name</th>
			<th>comment</th>
		</thead>
		<tr v-for="{ id, name, comment } of sorted" :key="id" class="row">
			<td>{{ id }}</td>
			<td>{{ name }}</td>
			<td>{{ comment }}</td>
			<td>
				<button type="button" @click="$emit('delete', id)">
					<MaterialIcon name="delete_forever" />
				</button>
			</td>
		</tr>
	</table>
</template>

<style scoped>
.row {
	padding: 4px 8px;
	display: grid;
	grid-template-columns: 20px 1fr 1fr auto;
	gap: 16px;

	&:nth-child(even) {
		background: oklch(0 0 0deg / 8%);
	}

	& th {
		text-align: start;
	}

	@media screen and (width <= 575px) {
		font-size: 12px;
	}
}

.table {
	margin-bottom: 8px;
}
</style>
