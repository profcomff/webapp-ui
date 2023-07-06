<script setup lang="ts">
import { stringifyDate } from '@/utils';
import MaterialIcon from './MaterialIcon.vue';

const weekdays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

const props = defineProps<{ selected: Date; modelValue: Date }>();
const emits = defineEmits<{ 'update:modelValue': [value: Date] }>();

const getDays = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
const getItemDate = (day: number) => new Date(props.modelValue.getFullYear(), props.modelValue.getMonth(), day);
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
			<button type="button" class="left" @click="changeMonthHandler(-1)" aria-label="Предыдущий месяц">
				<MaterialIcon name="arrow_back_ios" />
			</button>

			<span class="noselect">
				{{ modelValue.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }) }}
			</span>

			<button type="button" class="right" @click="changeMonthHandler(1)" aria-label="Следующий месяц">
				<MaterialIcon name="arrow_forward_ios" />
			</button>
		</div>
		<div class="grid">
			<span v-for="weekday of weekdays" class="noselect weekday" :key="weekday">{{ weekday }}</span>
			<RouterLink
				v-for="i in getDays(modelValue)"
				class="day"
				:to="`/timetable/${getItemStringDate(i)}`"
				:class="['day', { current: isCurrent(i), today: isToday(i) && !isCurrent(i) }]"
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

.today:not(:focus-visible) {
	border: 2px solid white;
}
</style>
