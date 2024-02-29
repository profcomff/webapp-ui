<script setup lang="ts">
import { achievementApi, AchievementGet } from '@/api/achievement';
import { onMounted, ref, Ref } from 'vue';
import achievementRow from './AchievementRow.vue';
import AccessAllowed from '@/components/AccessAllowed.vue';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { scopename } from '@/models/ScopeName';

const achiements: Ref<AchievementGet[]> = ref([]);

const new_name: Ref<string> = ref('');
const new_description: Ref<string> = ref('');
const new_pic: Ref<File[] | undefined> = ref(undefined);

const created: Ref<boolean | undefined> = ref(undefined);

onMounted(async () => {
	achiements.value = (await achievementApi.getAll()).data;
});

const createAchievement = async (
	new_name: string,
	new_description: string,
	new_pic: File[] | undefined
) => {
	if (new_pic === undefined || new_pic.length !== 1) return;

	achievementApi.create(new_name, new_description, new_pic[0]).then(
		async resp => {
			achiements.value.unshift(resp.data);
			created.value = true;
		},
		() => (created.value = false)
	);
};

const back = history.state.back?.startsWith('/admin') ? history.state.back : '/admin';
</script>

<template>
	<IrdomLayout title="Управление достижениями" backable :back="back">
		<AccessAllowed :scope="scopename.achievements.achievement.create">
			<v-row class="row" align-content="stretch">
				<v-card
					title="Создание новой ачивки"
					class="constructor v-col-12"
					prepend-icon="md:emoji_events"
				>
					<template #text>
						<p>Для создания ачивки нужно:</p>
						<ul class="rules">
							<li>придумать название</li>
							<li>описать правила выдачи</li>
							<li>
								подготовить прозрачное png изображение размером 512 на 512 пикселей не более 200 кб
							</li>
						</ul>

						<v-form v-if="created === undefined">
							<v-file-input
								v-model="new_pic"
								label="Изображение"
								aria-placeholder="Изображение в формате png 512 на 512 пикселей размером не более 200 кб"
								prepend-icon="md:image"
								accept="image/png"
								:rules="[
									value => {
										return (
											!value ||
											value.length == 1 ||
											value[0].size < 200000 ||
											'Размер изображения не должен превышать 200 KB!'
										);
									}
								]"
							></v-file-input>
							<v-text-field v-model="new_name" label="Названние"></v-text-field>
							<v-text-field v-model="new_description" label="Описание достижения"></v-text-field>
							<v-card-actions>
								<v-btn
									:disabled="new_name === '' || new_description === ''"
									@click="createAchievement(new_name, new_description, new_pic)"
								>
									Сохранить
								</v-btn>
							</v-card-actions>
						</v-form>

						<div v-if="created === true">
							<p>Ачивка создана! Ищи её в списке ниже</p>
							<v-btn @click="created = undefined">Создать ещё одну</v-btn>
						</div>
						<div v-if="created === false">
							<p>Произошла ошибка</p>
							<v-btn @click="created = undefined">Попробовать еще раз</v-btn>
						</div>
					</template>
				</v-card>
			</v-row>

			<v-row class="row">
				<v-table fixed-header class="table v-col-12">
					<thead>
						<tr>
							<th></th>
							<th>Изображение</th>
							<th>Название</th>
							<th>Описание достижения</th>
							<th></th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						<achievementRow v-for="a in achiements" :key="a.id" :achievement="a" />
					</tbody>
				</v-table>
			</v-row>
		</AccessAllowed>
	</IrdomLayout>
</template>

<style scoped>
.row {
	margin: 16px 0;
}

.constructor {
	padding: 16px;
}

.rules {
	margin-left: 16pt;
	margin-bottom: 32px;
}
</style>
