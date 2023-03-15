<script setup lang="ts">
import { MaterialIcon } from '@/components/lib';
import AsyncContent from './AsyncContent.vue';
import { IrdomLayout } from '@/components';

const back = history.state.back?.startsWith('/timetable/event') ? history.state.back : '/timetable';
</script>

<template>
	<IrdomLayout backable :back="back" share title="Аудитория">
		<Suspense>
			<AsyncContent :id="+$route.params.id" />

			<template #fallback> Загрузка... </template>
		</Suspense>

		<h3 class="h3">Карта этажа</h3>

		<RouterLink to="/apps/browser#https://cdn.profcomff.com/app/map/" class="map">
			<span class="text">
				Посмотреть на карте
				<MaterialIcon name="open_in_new" />
			</span>
		</RouterLink>
	</IrdomLayout>
</template>

<style scoped>
.icon {
	font-size: 30px;
}

.h3 {
	margin-bottom: 10px;
}

.map {
	width: min(100%, 400px);
	height: auto;
	aspect-ratio: 16 / 10;
	background: no-repeat center/80% url('../../../assets/map_background.webp');
	position: relative;
	border-radius: 16px;
	overflow: hidden;
	font-size: 24px;
	color: white;
	display: flex;
	justify-content: center;
	align-items: center;
	text-decoration: none;
}

.text {
	z-index: 2;
}

.map::after {
	content: '';
	position: absolute;
	inset: 0;
	opacity: 0.4;
	background: var(--color-primary-dark);
	z-index: 1;
}
</style>
