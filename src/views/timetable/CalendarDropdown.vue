<script setup lang="ts">
import { ref } from 'vue';
import { useTimetableStore } from '@/store/timetable';
import IrdomCalendar from '@/components/IrdomCalendar.vue';

const show = ref(false);
const expander = ref<HTMLButtonElement | null>(null);
const calendar = ref<HTMLDivElement | null>(null);
const { group } = useTimetableStore();

const props = defineProps<{ date: Date }>();

const innerDate = ref(props.date);
const expanderClickHandler = () => {
	show.value = !show.value;
	innerDate.value = props.date;
};

const clickOutsideHandler = (e: MouseEvent) => {
	if (
		e.target &&
		calendar.value &&
		expander.value &&
		!expander.value.contains(e.target as Node) &&
		!calendar.value.contains(e.target as Node)
	) {
		show.value = false;
		innerDate.value = props.date;
	}
};
</script>

<template>
	<button
		ref="expander"
		v-ripple
		type="button"
		class="expander"
		:aria-expanded="show"
		aria-controls="calendar"
		@click="expanderClickHandler"
	>
		<span class="date">
			{{ date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) }}
		</span>

		<span class="group">
			{{ `Группа ${group?.number ?? ''}` }}
		</span>

		<v-icon icon="expand_more" class="expander-icon" />
	</button>
	<div
		id="calendar"
		ref="calendar"
		v-click-outside="clickOutsideHandler"
		:style="{ transform: `scaleY(${+show})` }"
		class="dropdown"
	>
		<IrdomCalendar v-model="innerDate" :selected="date" />
	</div>
</template>

<style scoped>
button.expander {
	padding: 0 8px 0 16px;
}

.expander {
	display: grid;
	grid-template-areas:
		'date icon'
		'group icon ';
	column-gap: 8px;
	height: 100%;
	align-content: center;
	place-items: center start;
}

.expander-icon {
	grid-area: icon;
	font-size: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: 0.3s ease;
}

button[aria-expanded='true'] .expander-icon {
	rotate: 180deg;
}

.group {
	grid-area: group;
	font-size: 12px;
}

.date {
	grid-area: date;
	font-weight: bold;
	font-size: 18px;
}

.dropdown {
	position: absolute;
	top: 64px;
	left: 0;
	right: 0;
	z-index: 1000;
	box-shadow: 0 2px 4px rgb(0 0 0 / 50%);
	display: flex;
	justify-content: center;
	padding-bottom: 24px;
	transform: translateY(0);
	transition: transform 0.3s ease;
	transform-origin: top;
	background-color: rgb(var(--v-theme-primary));
}
</style>
