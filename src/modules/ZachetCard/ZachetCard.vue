<script setup lang="ts">
import { ref, watch } from 'vue';
import { useZachetCardController } from './controller/useZachetCardController';
import ZachetCardFront from './ui/ZachetCardFront.vue';
import ZachetCardBack from './ui/ZachetCardBack.vue';

const props = defineProps<{
	userId?: number;
}>();

const { card, loading, error, reload } = useZachetCardController(props);
const isFrontSide = ref(true);

async function copyUnionCardNumber() {
	if (!card.value?.unionCardNumber || card.value.unionCardNumber === '—') {
		logZachetCardComponent('copy skipped because union card number is empty');
		return;
	}

	try {
		await navigator.clipboard.writeText(card.value.unionCardNumber);
		logZachetCardComponent('union card number copied', {
			unionCardNumber: card.value.unionCardNumber,
		});
	} catch (error) {
		errorZachetCardComponent('failed to copy union card number', error);
	}
}

function toggleCardSide() {
	isFrontSide.value = !isFrontSide.value;

	logZachetCardComponent('card side toggled', {
		isFrontSide: isFrontSide.value,
	});
}

watch(
	() => ({
		loading: loading.value,
		error: error.value,
		card: card.value,
		isFrontSide: isFrontSide.value,
	}),
	state => {
		logZachetCardComponent('state changed', state);
	},
	{ immediate: true, deep: true }
);

function logZachetCardComponent(message: string, payload?: unknown) {
	if (!import.meta.env.DEV) {
		return;
	}

	if (payload === undefined) {
		console.log('[ZachetCard][component]', message);
		return;
	}

	console.log('[ZachetCard][component]', message, payload);
}

function errorZachetCardComponent(message: string, payload?: unknown) {
	if (!import.meta.env.DEV) {
		return;
	}

	if (payload === undefined) {
		console.error('[ZachetCard][component]', message);
		return;
	}

	console.error('[ZachetCard][component]', message, payload);
}
</script>

<template>
	<div class="zachet-card-module">
		<div v-if="loading" class="zachet-card-module__state">Загрузка карты...</div>

		<div v-else-if="error" class="zachet-card-module__state zachet-card-module__state_error">
			<div>{{ error }}</div>
			<v-btn color="primary" @click="reload">Повторить</v-btn>
		</div>

		<div v-else-if="card" class="zachet-card-module__content">
			<ZachetCardFront
				v-if="isFrontSide"
				:card="card"
				@copy-union-card-number="copyUnionCardNumber"
			/>

			<ZachetCardBack v-else :card="card" @copy-union-card-number="copyUnionCardNumber" />

			<v-btn
				block
				size="x-large"
				color="primary"
				class="zachet-card-module__flip-btn"
				@click="toggleCardSide"
			>
				ПЕРЕВЕРНУТЬ
			</v-btn>
		</div>

		<div v-else class="zachet-card-module__state">Нет данных для отображения карты</div>
	</div>
</template>

<style scoped>
.zachet-card-module {
	--zachet-card-red: #c2291b;
	--zachet-card-face-min-height-mobile: 340px;
	--zachet-card-face-min-height-desktop: 376px;

	width: 100%;
}

.zachet-card-module__content {
	display: flex;
	flex-direction: column;
	gap: 16px;
	align-items: center;
}

.zachet-card-module__content > * {
	width: 100%;
	max-width: 560px;
}

.zachet-card-module__state {
	display: flex;
	flex-direction: column;
	gap: 12px;
	align-items: center;
	justify-content: center;
	min-height: 220px;
	padding: 16px;
	border-radius: 20px;
	background: rgb(var(--v-theme-surface));
	color: rgba(var(--v-theme-on-surface));
}

.zachet-card-module__state_error {
	background: #fff1f0;
	color: #b42318;
}

.zachet-card-module__flip-btn {
	font-weight: 700;
	letter-spacing: 0.5px;
}

@media (max-width: 768px) {
	.zachet-card-module__content > * {
		max-width: 100%;
	}
}
</style>
