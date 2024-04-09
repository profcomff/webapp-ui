<script setup lang="ts">
import { useToolbar } from '@/store/toolbar';
import AsyncRoomInfo from './AsyncRoomInfo.vue';
import AsyncRoomSchedule from './AsyncRoomSchedule.vue';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { useRoute } from 'vue-router';
import FullscreenLoader from '@/components/FullscreenLoader.vue';
import router from '@/router';

const route = useRoute();
const toolbar = useToolbar();

toolbar.setup({
	title: 'Аудитория',
	backUrl:
		router.options.history.state.back &&
		router.options.history.state.back.toString().startsWith('/timetable/event')
			? undefined
			: '/timetable',
	backable: true,
	share: true,
});
</script>

<template>
	<IrdomLayout>
		<section class="section">
			<Suspense>
				<AsyncRoomInfo :id="+route.params.id" />

				<template #fallback> <FullscreenLoader /> </template>
			</Suspense>
		</section>

		<section class="section">
			<h3 class="h3">Карта этажа</h3>

			<RouterLink to="/apps/2" class="map">
				<span class="text">
					Посмотреть на карте
					<v-icon icon="open_in_new" />
				</span>
			</RouterLink>
		</section>

		<section class="section">
			<p class="date">
				Сегодня, {{ new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'long' }) }}
			</p>
			<Suspense>
				<AsyncRoomSchedule :id="+route.params.id" />
				<template #fallback><FullscreenLoader /></template>
			</Suspense>
		</section>
	</IrdomLayout>
</template>

<style scoped>
.icon {
	font-size: 30px;
}

.h3 {
	font-size: 20px;
	margin-bottom: 16px;
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
	background-color: rgb(var(--v-theme-surface));
	filter: brightness(20%);
	z-index: 1;
}

.date {
	font-size: 20px;
	margin-bottom: 16px;
	font-weight: bold;
}

.section {
	margin-bottom: 32px;
}

.section:last-child {
	margin-bottom: 0;
}
</style>
