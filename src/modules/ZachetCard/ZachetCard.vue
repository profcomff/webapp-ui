<script setup lang="ts">
import { watch } from 'vue';
import { useZachetCardController } from './controller/useZachetCardController';

const props = defineProps<{
	userId?: number;
}>();

const { card, loading, error, reload } = useZachetCardController(props);

watch(
	() => ({
		loading: loading.value,
		error: error.value,
		card: card.value,
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
</script>

<template>
	<div class="zachet-card-module">
		<div v-if="loading" class="zachet-card-module__state">Загрузка карты...</div>

		<div v-else-if="error" class="zachet-card-module__state zachet-card-module__state_error">
			<div>{{ error }}</div>
			<button type="button" class="zachet-card-module__retry" @click="reload">Повторить</button>
		</div>

		<div v-else-if="card" class="zachet-card">
			<div class="zachet-card__header">
				<div class="zachet-card__title">ПРОФСОЮЗНЫЙ БИЛЕТ</div>
				<div class="zachet-card__number">№ {{ card.unionCardNumber }}</div>
			</div>

			<div class="zachet-card__content">
				<div class="zachet-card__photo">
					<img
						v-if="card.photoUrl"
						:src="card.photoUrl"
						alt="Фото пользователя"
						class="zachet-card__photo-image"
					/>
					<div v-else class="zachet-card__photo-placeholder">Нет фото</div>
				</div>

				<div class="zachet-card__info">
					<div class="zachet-card__name">
						<div>{{ card.fullNameRu }} /</div>
						<div>{{ card.fullNameEn }}</div>
					</div>

					<div class="zachet-card__field">
						<div class="zachet-card__label">ДАТА РОЖДЕНИЯ / DATE OF BIRTH</div>
						<div class="zachet-card__value">{{ card.birthDate }}</div>
					</div>

					<div class="zachet-card__field">
						<div class="zachet-card__label">ФАКУЛЬТЕТ / DEPARTMENT</div>
						<div class="zachet-card__value">
							<div>{{ card.facultyRu }}</div>
							<div>{{ card.facultyEn }}</div>
						</div>
					</div>

					<div class="zachet-card__status">{{ card.statusRu }} / {{ card.statusEn }}</div>
				</div>
			</div>

			<div class="zachet-card__footer">LOMONOSOV MOSCOW STATE UNIVERSITY ID CARD</div>
		</div>

		<div v-else class="zachet-card-module__state">Нет данных для отображения карты</div>
	</div>
</template>

<style scoped>
.zachet-card-module {
	width: 100%;
}

.zachet-card-module__state {
	display: flex;
	flex-direction: column;
	gap: 12px;
	align-items: center;
	justify-content: center;
	min-height: 220px;
	border-radius: 20px;
	background: #f5f5f5;
	color: #222;
	padding: 16px;
}

.zachet-card-module__state_error {
	background: #fff1f0;
	color: #b42318;
}

.zachet-card-module__retry {
	padding: 8px 14px;
	border: none;
	border-radius: 10px;
	background: #d80000;
	color: #fff;
	cursor: pointer;
}

.zachet-card {
	display: flex;
	flex-direction: column;
	overflow: hidden;
	border-radius: 22px;
	background: #d80000;
	color: #fff;
	max-width: 900px;
	width: 100%;
	box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
}

.zachet-card__header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 18px 28px;
	border-bottom: 4px solid #ffffff;
	font-weight: 700;
	gap: 12px;
}

.zachet-card__title {
	font-size: 28px;
	line-height: 1.1;
	text-transform: uppercase;
}

.zachet-card__number {
	font-size: 24px;
	line-height: 1.1;
	text-transform: uppercase;
	white-space: nowrap;
}

.zachet-card__content {
	display: grid;
	grid-template-columns: 150px 1fr;
	gap: 28px;
	padding: 18px 28px 20px;
	border-bottom: 4px solid #ffffff;
	align-items: start;
}

.zachet-card__photo {
	width: 150px;
	height: 180px;
	background: rgba(255, 255, 255, 0.14);
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
}

.zachet-card__photo-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.zachet-card__photo-placeholder {
	padding: 12px;
	text-align: center;
	font-size: 14px;
}

.zachet-card__info {
	display: flex;
	flex-direction: column;
	gap: 18px;
}

.zachet-card__name {
	font-size: 24px;
	font-weight: 700;
	line-height: 1.15;
	text-transform: uppercase;
	word-break: break-word;
}

.zachet-card__field {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.zachet-card__label {
	font-size: 18px;
	font-weight: 700;
	line-height: 1.1;
	text-transform: uppercase;
}

.zachet-card__value {
	font-size: 18px;
	font-weight: 600;
	line-height: 1.25;
	word-break: break-word;
}

.zachet-card__status {
	font-size: 22px;
	font-weight: 700;
	line-height: 1.2;
	text-transform: uppercase;
	word-break: break-word;
}

.zachet-card__footer {
	padding: 18px 28px;
	font-size: 18px;
	font-weight: 700;
	line-height: 1.2;
	text-transform: uppercase;
}

@media (max-width: 768px) {
	.zachet-card__header {
		flex-direction: column;
		align-items: flex-start;
	}

	.zachet-card__content {
		grid-template-columns: 1fr;
	}

	.zachet-card__photo {
		width: 120px;
		height: 145px;
	}

	.zachet-card__title {
		font-size: 22px;
	}

	.zachet-card__number {
		font-size: 20px;
	}

	.zachet-card__name {
		font-size: 20px;
	}

	.zachet-card__label,
	.zachet-card__value,
	.zachet-card__footer {
		font-size: 16px;
	}

	.zachet-card__status {
		font-size: 18px;
	}
}
</style>
