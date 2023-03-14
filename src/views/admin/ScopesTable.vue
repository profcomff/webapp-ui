<script setup lang="ts">
import { Scope } from '@/api/models';
import { MaterialIcon } from '@/components/lib';
import { computed } from 'vue';

const props = defineProps<{
	scopes: Iterable<Scope>;
	deleteIcon: string;
}>();

defineEmits<{
	(e: 'delete', scopeId: number): void;
}>();

const sorted = computed(() => [...props.scopes].sort((a, b) => (a.name > b.name ? 1 : -1)));
</script>

<template>
	<table class="table">
		<thead class="row">
			<th>id</th>
			<th>name</th>
			<th>comment</th>
		</thead>
		<tr v-for="{ id, name, comment } of sorted" class="row" :key="id">
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
}
.row:nth-child(even) {
	background: rgba(0, 0, 0, 8%);
}
.row th {
	text-align: start;
}
.table {
	margin-bottom: 8px;
}

@media screen and (max-width: 575px) {
	.row {
		font-size: 12px;
	}
}
</style>
