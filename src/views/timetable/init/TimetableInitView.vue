<script setup lang="ts">
import Logo from '/icon.svg';
import { ref } from 'vue';
import AsyncGroupsList from './AsyncGroupsList.vue';
import { marketingApi } from '@/api/marketing';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { useProfileStore } from '@/store/profile';

const query = ref('');
const profileStore = useProfileStore();

const sendMarketing = (e: Event) => {
	const input = e.target as HTMLInputElement;

	if (profileStore.marketingId) {
		marketingApi.writeAction({
			action: 'timetable search group',
			user_id: profileStore.marketingId,
			additional_data: JSON.stringify({ query: input.value }),
		});
	}
};
</script>

<template>
	<IrdomLayout>
		<img :src="Logo" alt="Логотип физфака" class="align-self-center logo mb-20" />

		<h4 class="text-h4 align-self-center greeting">Добро пожаловать!</h4>
		<p class="message">Наше приложение позволит получить доступ к сервисам для студентов ФФ МГУ!</p>
		<p class="message">Для просмотра расписания выберите свою группу:</p>

		<v-responsive class="align-self-center" width="344">
			<v-text-field
				v-model="query"
				type="text"
				label="Номер группы"
				placeholder="Введите номер группы"
				inputmode="numeric"
				class="align-self-center input"
				max-width="344"
				@change.once="sendMarketing"
			/>
		</v-responsive>

		<Suspense>
			<AsyncGroupsList :query="query" />

			<template #fallback> Загрузка... </template>
		</Suspense>
	</IrdomLayout>
</template>
<style scoped>
.greeting,
.input {
	margin-bottom: 24px;
}

.logo {
	width: min(50%, 144px);
	aspect-ratio: 1;
	pointer-events: none;
	margin-bottom: 20px;
}

.message {
	margin-bottom: 20px;
}
</style>
