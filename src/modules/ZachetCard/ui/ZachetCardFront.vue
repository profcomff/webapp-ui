<script setup lang="ts">
import type { ZachetCardData } from '../controller/types';

defineProps<{
	card: ZachetCardData;
}>();

const emit = defineEmits<{
	copyUnionCardNumber: [];
}>();

function handleCopyClick(event: MouseEvent) {
	emit('copyUnionCardNumber');

	const target = event.currentTarget as HTMLElement | null;
	target?.blur();
}
</script>

<template>
	<div class="zachet-card-front">
		<div class="zachet-card-front__header">
			<div class="zachet-card-front__title">ПРОФСОЮЗНЫЙ БИЛЕТ</div>

			<v-btn variant="flat" class="zachet-card-front__copy-btn" @click="handleCopyClick">
				<template #prepend>
					<v-icon icon="content_copy" />
				</template>

				№{{ card.unionCardNumber }}
			</v-btn>
		</div>

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
	justify-content: space-between;
	overflow: hidden;
	min-height: var(--zachet-card-face-min-height-mobile);
	border-radius: 16px;
	background: var(--zachet-card-red);
	color: rgb(var(--v-theme-on-primary));
	box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
}

.zachet-card-front__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	padding: 12px 16px;
	border-bottom: 2px solid rgba(255, 255, 255, 0.85);
}

.zachet-card-front__title {
	font-size: 16px;
	font-weight: 500;
	line-height: 1.1;
	text-transform: uppercase;
}

.zachet-card-front__copy-btn {
	min-width: 0;
	background: rgb(var(--v-theme-on-primary)) !important;
	color: var(--zachet-card-red) !important;
	border-radius: 8px;
	font-size: 14px;
	font-weight: 700;
	text-transform: none;
	box-shadow: none !important;
}

:deep(.zachet-card-front__copy-btn .v-btn__overlay),
:deep(.zachet-card-front__copy-btn .v-btn__underlay) {
	display: none;
}

.zachet-card-front__content {
	display: grid;
	grid-template-columns: 84px 1fr;
	gap: 16px;
	padding: 10px 16px 14px;
	border-bottom: 2px solid rgba(255, 255, 255, 0.85);
}

.zachet-card-front__photo {
	width: 74px;
	height: 118px;
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
	font-size: 12px;
	font-weight: 500;
}

.zachet-card-front__info {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.zachet-card-front__field {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.zachet-card-front__label {
	font-size: 11px;
	font-weight: 700;
	line-height: 1.1;
	text-transform: uppercase;
}

.zachet-card-front__value {
	font-size: 12px;
	font-weight: 700;
	line-height: 1.2;
	text-transform: uppercase;
	word-break: break-word;
}

.zachet-card-front__value_name {
	font-size: 13px;
}

.zachet-card-front__status {
	font-size: 12px;
	font-weight: 700;
	line-height: 1.2;
	text-transform: uppercase;
	word-break: break-word;
}

.zachet-card-front__footer {
	padding: 10px 16px 12px;
	font-size: 10px;
	font-weight: 700;
	line-height: 1.2;
	text-align: center;
	text-transform: uppercase;
}

@media (min-width: 768px) {
	.zachet-card-front {
		min-height: var(--zachet-card-face-min-height-desktop);
	}

	.zachet-card-front__header {
		padding: 18px 24px;
	}

	.zachet-card-front__title {
		font-size: 20px;
	}

	.zachet-card-front__content {
		grid-template-columns: 112px 1fr;
		gap: 20px;
		padding: 14px 24px 18px;
	}

	.zachet-card-front__photo {
		width: 92px;
		height: 136px;
	}

	.zachet-card-front__value {
		font-size: 16px;
	}

	.zachet-card-front__value_name {
		font-size: 18px;
	}

	.zachet-card-front__label {
		font-size: 13px;
	}

	.zachet-card-front__status {
		font-size: 15px;
	}

	.zachet-card-front__footer {
		padding: 12px 24px 14px;
		font-size: 12px;
	}
}
</style>
