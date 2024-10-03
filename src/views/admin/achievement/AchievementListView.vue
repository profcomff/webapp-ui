<script setup lang="ts">
import { AchievementGet } from '@/models';
import { onMounted, ref } from 'vue';
import achievementRow from './AchievementRow.vue';
import AccessRestricted from '@/components/AccessRestricted.vue';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { scopename } from '@/models/ScopeName';
import { useToolbar } from '@/store/toolbar';

import apiClient from '@/api/';

const toolbar = useToolbar();

toolbar.setup({ title: 'Управление достижениями', backUrl: '/admin' });

const achievements = ref<AchievementGet[]>([]);
const newName = ref('');
const newDescription = ref('');
const newPic = ref<File[] | undefined>(undefined);
const created = ref<boolean | undefined>(undefined);

onMounted(async () => {
	const { data } = await apiClient.GET('/achievement/achievement');
	if (data) {
		achievements.value = data;
	}
});

async function createAchievement(
	new_name: string,
	new_description: string,
	new_pic: File[] | undefined
) {
	if (new_pic === undefined || new_pic.length !== 1) return;
	const new_pic_str = new_pic.toString();

	const promise = apiClient.POST('/achievement/achievement', {
		body: {
			name: new_name,
			description: new_description,
		},
	});
	promise.then(resp => {
		if (resp.data) {
			apiClient.PATCH('/achievement/achievement/{id}/picture', {
				params: { path: { id: resp.data?.id } },
				body: { picture_file: new_pic_str },
			});
		}
	});
	promise.then(
		async resp => {
			if (resp.data) {
				achievements.value.unshift(resp.data);
				created.value = true;
			}
		},
		() => (created.value = false)
	);
}
</script>

<template>
	<IrdomLayout>
		<AccessRestricted :scope="scopename.achievements.achievement.create">
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
								v-model="newPic"
								label="Изображение"
								aria-placeholder="Изображение в формате png 512 на 512 пикселей размером не более 200 кб"
								prepend-icon="md:image"
								accept="image/png"
								:rules="[
									(value: File[]) => {
										return (
											!value ||
											value.length == 1 ||
											value[0].size < 200000 ||
											'Размер изображения не должен превышать 200 KB!'
										);
									},
								]"
							/>
							<v-text-field v-model="newName" label="Названние" />
							<v-text-field v-model="newDescription" label="Описание достижения" />
							<v-card-actions>
								<v-btn
									:disabled="newName === '' || newDescription === ''"
									@click="createAchievement(newName, newDescription, newPic)"
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
							<th />
							<th>Изображение</th>
							<th>Название</th>
							<th>Описание достижения</th>
							<th />
							<th />
						</tr>
					</thead>
					<tbody>
						<achievementRow v-for="a in achievements" :key="a.id" :achievement="a" />
					</tbody>
				</v-table>
			</v-row>

			<template #fallback>
				<h2>Access restricted</h2>
			</template>
		</AccessRestricted>
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
