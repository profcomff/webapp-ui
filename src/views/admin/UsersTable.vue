<script setup lang="ts">
import { User } from '@/api/models';
import { MaterialIcon } from '@/components/lib';
import { computed } from 'vue';

const props = defineProps<{
	users: Iterable<User>;
	deleteIcon: string;
}>();

defineEmits<{
	(e: 'delete', scopeId: number): void;
}>();

const sorted = computed(() => [...props.users].sort((a, b) => a.id - b.id));
</script>

<template>
	<table class="table">
		<thead class="row">
			<th>id</th>
			<th>email</th>
		</thead>
		<tr v-for="{ id, email } of sorted" class="row" :key="id">
			<td>
				<RouterLink :to="`/profile/${id}`" class="link">{{ id }}</RouterLink>
			</td>
			<td>{{ email }}</td>
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
	grid-template-columns: 20px 1fr auto;
	gap: 16px;
}

.row:nth-child(even) {
	background: oklch(0 0 0 / 8%);
}

.row th {
	text-align: start;
}

@media screen and (width <= 575px) {
	.row {
		font-size: 12px;
	}
}
</style>
