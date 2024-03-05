<script setup lang="ts">
import { stringifyDate } from '@/utils/date';

const weekdays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

const props = defineProps<{ selected: Date; modelValue: Date }>();
const emits = defineEmits<{ 'update:modelValue': [value: Date] }>();

const getDays = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
const getItemDate = (day: number) =>
	new Date(props.modelValue.getFullYear(), props.modelValue.getMonth(), day);
const getItemStringDate = (day: number) => stringifyDate(getItemDate(day));
const isCurrent = (day: number) => getItemStringDate(day) === stringifyDate(props.selected);
const isToday = (day: number) => getItemStringDate(day) === stringifyDate(new Date());
const getAriaLabel = (day: number) =>
	getItemDate(day).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

const changeMonthHandler = (offset: number) => {
	const d = new Date(props.modelValue);
	d.setMonth(d.getMonth() + offset);
	emits('update:modelValue', d);
};
</script>

<template>
	<div class="calendar">
		<div class="controls">
			<button
				v-ripple
				type="button"
				class="left"
				aria-label="Предыдущий месяц"
				@click="changeMonthHandler(-1)"
			>
				<v-icon icon="arrow_back_ios" />
			</button>

			<span class="noselect">
				{{ modelValue.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }) }}
			</span>

			<button
				v-ripple
				type="button"
				class="right"
				aria-label="Следующий месяц"
				@click="changeMonthHandler(1)"
			>
				<v-icon icon="arrow_forward_ios" />
			</button>
		</div>
		<div
			v-touch="{
				left: () => changeMonthHandler(1),
				right: () => changeMonthHandler(-1),
			}"
			class="grid"
		>
			<span v-for="weekday of weekdays" :key="weekday" class="noselect weekday">{{ weekday }}</span>
			<RouterLink
				v-for="i in getDays(modelValue)"
				:key="i"
				v-ripple
				class="day"
				:to="`/timetable/${getItemStringDate(i)}`"
				:class="['day', { current: isCurrent(i), today: isToday(i) && !isCurrent(i) }]"
				:style="{ 'grid-column': i === 1 ? getItemDate(i).getDay() : 'unset' }"
				:aria-label="getAriaLabel(i)"
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
	opacity: 0.7;
}

.day {
	width: 32px;
	height: 32px;
	text-decoration: none;
	color: inherit;
	border-radius: 999px;
	font-size: 14px;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: 0.3s ease;
}

.day:hover {
	background-color: rgb(var(--v-theme-secondary));
	opacity: 0.9;
}

.current {
	background: rgb(var(--v-theme-secondary));
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

.today:not(:focus-visible) {
	border: 2px solid white;
}
</style>
