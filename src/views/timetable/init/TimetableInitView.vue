<script setup lang="ts">
import Logo from '/icon.svg';
import { IrdomLayout } from '@/components';
import { onMounted, ref } from 'vue';
import GroupsList from './GroupsList.vue';

const query = ref('');
const input = ref<HTMLInputElement | null>(null);

onMounted(() => {
	if (input.value) {
		input.value.focus();
	}
});
</script>
<template>
	<IrdomLayout>
		<img :src="Logo" alt="Логотип физфака" class="logo" />
		<input type="text" v-model="query" class="input" placeholder="Введите номер группы" ref="input" />

		<Suspense>
			<GroupsList :query="query" />

			<template #fallback> Загрузка... </template>
		</Suspense>
	</IrdomLayout>
</template>
<style scoped>
.logo {
	width: min(80%, 256px);
	aspect-ratio: 1;
	align-self: center;
	margin-bottom: 20px;
	pointer-events: none;
}

.input {
	align-self: center;
	margin-bottom: 20px;
}
</style>
