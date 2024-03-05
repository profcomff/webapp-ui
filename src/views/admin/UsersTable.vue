<script setup lang="ts">
import { User } from '@/api/models';
import { computed } from 'vue';

const props = defineProps<{
	users: Iterable<User>;
	deleteIcon: string;
}>();

defineEmits<{ delete: [scopeId: number] }>();

const sorted = computed(() => [...props.users].sort((a, b) => a.id - b.id));
</script>

<template>
	<v-table>
		<thead>
			<tr>
				<th>id</th>
				<th>email</th>
				<th />
			</tr>
		</thead>
		<tbody>
			<tr v-for="{ id, email } of sorted" :key="id" class="row">
				<td>
					<RouterLink :to="`/profile/${id}`" class="link">{{ id }}</RouterLink>
				</td>
				<td>{{ email }}</td>
				<td>
					<v-btn
						type="button"
						icon="md:delete_forever"
						variant="text"
						@click="$emit('delete', id)"
					/>
				</td>
			</tr>
		</tbody>
	</v-table>
</template>

<style scoped>
.row {
	&:nth-child(even) {
		background: oklch(0% 0 0deg / 8%);
	}

	@media screen and (width <= 575px) {
		font-size: 12px;
	}
}
</style>
