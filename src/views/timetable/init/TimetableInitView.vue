<script setup lang="ts">
import Logo from '/icon.svg';
import { IrdomLayout } from '@/components';
import { ref } from 'vue';
import AsyncGroupsList from './AsyncGroupsList.vue';
import { marketingApi } from '@/api/marketing';
import { useProfileStore } from '@/store';
import { IrdomInput } from '@/components/lib';

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
		<img :src="Logo" alt="Логотип физфака" class="logo" />

		<h2 class="h2">Добро пожаловать!</h2>
		<p class="message">Наше приложение позволит получить доступ к сервисам для студентов ФФ МГУ!</p>
		<p class="message">Для просмотра расписания выберите свою группу:</p>

		<IrdomInput
			type="text"
			class="input"
			v-model="query"
			placeholder="Введите номер группы"
			inputmode="numeric"
			@change.once="sendMarketing"
		/>

		<Suspense>
			<AsyncGroupsList :query="query" />

			<template #fallback> Загрузка... </template>
		</Suspense>
	</IrdomLayout>
</template>
<style scoped>
.logo {
	width: min(50%, 144px);
	aspect-ratio: 1;
	align-self: center;
	margin-bottom: 20px;
	pointer-events: none;
}

.message {
	line-height: 141%;
	margin-bottom: 20px;
}

.input {
	align-self: center;
	margin-bottom: 24px;
	width: 100%;
	max-width: 400px;
}

.h2 {
	margin-bottom: 24px;
	text-align: center;
}
</style>
