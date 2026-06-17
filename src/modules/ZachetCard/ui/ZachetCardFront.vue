<script setup lang="ts">
import type { ZachetCardData } from '../controller/types';

defineProps<{
	card: ZachetCardData;
}>();
</script>

<template>
	<div class="zachet-card-front">
		<div class="zachet-card-front__content">
			<div class="zachet-card-front__photo">
				<img
					v-if="card.photoUrl"
					:src="card.photoUrl"
					alt="Фото пользователя"
					class="zachet-card-front__photo-image"
				/>
				<div v-else class="zachet-card-front__photo-placeholder">Нет фото</div>
			</div>

			<div class="zachet-card-front__info">
				<div class="zachet-card-front__value zachet-card-front__value_name">
					<div>{{ card.fullNameRu }}</div>
					<div>{{ card.fullNameEn }}</div>
				</div>

				<div class="zachet-card-front__field">
					<div class="zachet-card-front__label">ДАТА РОЖДЕНИЯ/DATE OF BIRTH</div>
					<div class="zachet-card-front__value">
						{{ card.birthDate }}
					</div>
				</div>

				<div class="zachet-card-front__field">
					<div class="zachet-card-front__label">ФАКУЛЬТЕТ/DEPARTMENT</div>
					<div class="zachet-card-front__value">
						<div>{{ card.facultyRu }}</div>
						<div>{{ card.facultyEn }}</div>
					</div>
				</div>

				<div class="zachet-card-front__status">{{ card.statusRu }}/{{ card.statusEn }}</div>
			</div>
		</div>

		<div class="zachet-card-front__footer">LOMONOSOV MOSCOW STATE UNIVERSITY ID CARD</div>
	</div>
</template>

<style scoped>
.zachet-card-front {
	display: flex;
	flex-direction: column;
	flex: 1;
	min-height: 0;
}

.zachet-card-front__content {
	display: grid;
	grid-template-columns: 84px 1fr;
	gap: 16px;
	padding: 18px 18px 16px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.85);
	flex: 1;
	align-items: center;
}

.zachet-card-front__photo {
	width: 79px;
	height: 110px;
	background: rgba(255, 255, 255, 0.08);
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
}

.zachet-card-front__photo-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.zachet-card-front__photo-placeholder {
	padding: 8px;
	text-align: center;
	font-size: 10px;
	font-weight: 500;
	line-height: 1.2;
	color: #ffffff;
}

.zachet-card-front__info {
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 10px;
	min-width: 0;
}

.zachet-card-front__field {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.zachet-card-front__label,
.zachet-card-front__value,
.zachet-card-front__value_name,
.zachet-card-front__status {
	font-size: 10.03px;
	font-weight: 700;
	line-height: 1;
	letter-spacing: 0;
	text-transform: uppercase;
	color: #ffffff;
	word-break: break-word;
}

.zachet-card-front__footer {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	padding: 10px 18px 12px;
	font-size: 11.46px;
	font-weight: 500;
	line-height: 21.49px;
	letter-spacing: 0;
	text-align: center;
	text-transform: uppercase;
	color: #ffffff;
}
</style>
