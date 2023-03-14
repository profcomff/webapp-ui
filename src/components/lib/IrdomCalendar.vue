<script setup lang="ts">
import { stringifyDate } from '@/utils';
import { ref } from 'vue';
import MaterialIcon from './MaterialIcon.vue';

const weekdays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

const props = defineProps<{ date: Date }>();

const date = ref(props.date);

const getDays = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
const getItemDate = (day: number) => new Date(date.value.getFullYear(), date.value.getMonth(), day);
const getItemStringDate = (day: number) => stringifyDate(getItemDate(day));
const isCurrent = (day: number) => getItemStringDate(day) === stringifyDate(props.date);
const getAriaLabel = (day: number) =>
	getItemDate(day).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

const changeMonthHandler = (offset: number) => {
	const d = new Date(date.value);
	d.setMonth(d.getMonth() + offset);
	date.value = d;
};
</script>

<template>
	<div class="calendar">
		<div class="controls">
			<button type="button" class="left" @click="changeMonthHandler(-1)" aria-label="Предыдущий месяц">
				<MaterialIcon name="arrow_back_ios" />
			</button>

			<span class="noselect">
				{{ date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }) }}
			</span>

			<button type="button" class="right" @click="changeMonthHandler(1)" aria-label="Следующий месяц">
				<MaterialIcon name="arrow_forward_ios" />
			</button>
		</div>
		<div class="grid">
			<span v-for="weekday of weekdays" class="noselect weekday" :key="weekday">{{ weekday }}</span>
			<RouterLink
				v-for="i in getDays(date)"
				class="day"
				:to="`/timetable/${getItemStringDate(i)}`"
				:class="['day', { current: isCurrent(i) }]"
				:style="{ 'grid-column': i === 1 ? getItemDate(i).getDay() : 'unset' }"
				:aria-label="getAriaLabel(i)"
				:key="i"
			>
				{{ i }}
			</RouterLink>
		</div>
	</div>
</template>

<style scoped>
.calendar {
	display: flex;
	flex-direction: column;
	width: fit-content;
}

.controls {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.grid {
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	justify-items: center;

	gap: 8px;
}

.weekday {
	opacity: 70%;
}

.day {
	padding: 8px;
	text-decoration: none;
	color: inherit;
	border-radius: 999px;
	aspect-ratio: 1;
	font-size: 14px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.current {
	background: var(--color-accent);
	color: black;
}

.left,
.right {
	min-width: 48px;
	display: flex;
	padding: 16px 0;
}

.right {
	justify-content: end;
}
</style>
