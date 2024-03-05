<script setup lang="ts">
import { stringifyDate } from '@/utils/date';
import { computed, ref } from 'vue';

const weekdays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

const props = defineProps<{ modelValue: Date }>();
const emit = defineEmits<{ 'update:modelValue': [value: Date] }>();

const date = ref(props.modelValue);
const numberOfDays = computed(() =>
	new Date(date.value.getFullYear(), date.value.getMonth() + 1, 0).getDate()
);

function changeMonthHandler(delta: number) {
	date.value = new Date(
		date.value.getFullYear(),
		date.value.getMonth() + delta,
		date.value.getDate()
	);
}

function getItemDate(i: number) {
	return new Date(date.value.getFullYear(), date.value.getMonth(), i);
}

function getItemStringDate(i: number) {
	return stringifyDate(getItemDate(i));
}

function isToday(i: number) {
	return stringifyDate(new Date()) === getItemStringDate(i);
}

function isCurrent(i: number) {
	return stringifyDate(props.modelValue) === getItemStringDate(i);
}

function getAriaLabel(i: number) {
	return getItemDate(i).toLocaleDateString('ru-RU');
}

function itemClickHandler(i: number) {
	emit('update:modelValue', new Date(date.value.getFullYear(), date.value.getMonth(), i));
}
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
				{{ date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }) }}
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
			<button
				v-for="i in numberOfDays"
				:key="i"
				v-ripple
				type="button"
				class="day"
				:class="{ current: isCurrent(i), today: isToday(i) && !isCurrent(i) }"
				:style="{ 'grid-column': i === 1 ? getItemDate(i).getDay() : 'unset' }"
				:aria-label="getAriaLabel(i)"
				@click="itemClickHandler(i)"
			>
				{{ i }}
			</button>
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
