<script setup lang="ts">
import { achievementApi, AchievementGet } from '@/api/achievement';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import AccessRestricted from '@/components/AccessRestricted.vue';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { scopename } from '@/models/ScopeName';
import { useToolbar } from '@/store/toolbar';

const route = useRoute();
const toolbar = useToolbar();

toolbar.setup({
	title: 'Управление достижениями',
	backUrl: '/admin',
});

const achievemetId = computed(() => Number(route.params.id));
const achievement = ref<AchievementGet | undefined>(undefined);
const giveTo = ref<number | undefined>();

onMounted(async () => {
	achievement.value = (await achievementApi.getRecievers(achievemetId.value)).data;
});

const revoke = (user_id: number) => {
	achievementApi
		.revoke(user_id, achievemetId.value)
		.then(
			async () => (achievement.value = (await achievementApi.getRecievers(achievemetId.value)).data)
		);
};
const give = (user_id: number | undefined) => {
	if (user_id === undefined) return;
	achievementApi
		.give(user_id, achievemetId.value)
		.then(async () => achievement.value?.recievers?.unshift({ user_id }));
};
</script>

<template>
	<IrdomLayout>
		<AccessRestricted :scope="scopename.achievements.achievement.create">
			<v-row class="row" align-content="stretch">
				<v-card>
					<img :src="achievementApi.getPictureUrl(achievement?.picture)" width="100" height="100" />
					<div>
						<h2>{{ achievement?.name }}</h2>
						<p>{{ achievement?.description }}</p>
					</div>
				</v-card>
			</v-row>

			<v-row class="row" align="center">
				<v-text-field v-model="giveTo" label="ID пользователя" variant="underlined" />
				<v-btn @click="give(giveTo)">Выдать</v-btn>
			</v-row>

			<v-row class="row">
				<v-table fixed-header class="table v-col-12">
					<thead>
						<tr>
							<th>id</th>
							<th>Пользователь</th>
							<th />
						</tr>
					</thead>
					<tbody>
						<tr v-for="{ user_id } in achievement?.recievers" :key="user_id">
							<td>{{ user_id }}</td>
							<td />
							<td>
								<v-btn type="button" icon="md:delete" variant="text" @click="revoke(user_id)" />
							</td>
						</tr>
					</tbody>
				</v-table>
			</v-row>
		</AccessRestricted>
	</IrdomLayout>
</template>

<style scoped>
.row {
	margin: 16px 0;
	width: 100%;
}

.constructor {
	padding: 16px;
}

.rules {
	margin-left: 16pt;
	margin-bottom: 32px;
}
</style>
