<script setup lang="ts">
import { IrdomCalendar, MaterialIcon } from '@/components/lib';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useTimetableStore } from '@/store';

const show = ref(false);
const expander = ref<HTMLButtonElement | null>(null);
const calendar = ref<HTMLDivElement | null>(null);
const { group } = useTimetableStore();

const props = defineProps<{ date: Date }>();
const date = computed(() => props.date);

const innerDate = ref(date.value);
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

const textClickHandler = () => {
	show.value = !show.value;
	innerDate.value = props.date;
};

onMounted(() => {
	document.addEventListener('click', clickOutsideHandler);
});

onUnmounted(() => {
	document.removeEventListener('click', clickOutsideHandler);
});
</script>

<template>
	<button
		ref="expander"
		type="button"
		class="expander"
		:aria-expanded="show"
		aria-controls="calendar"
		@click="expanderClickHandler"
	>
		<span class="date" @click="textClickHandler">
			{{ date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) }}
		</span>

		<span class="group" @click="textClickHandler">
			{{ `Группа ${group?.number ?? ''}` }}
		</span>

		<MaterialIcon name="expand_more" class="expander-icon" />
	</button>
	<div id="calendar" ref="calendar" :style="{ transform: `scaleY(${+show})` }" class="dropdown">
		<IrdomCalendar v-model="innerDate" :selected="date" />
	</div>
</template>

<style scoped>
.expander {
	display: grid;
	grid-template-areas:
		'date icon'
		'group icon ';
	column-gap: 8px;
	align-items: center;
	height: 100%;
	align-content: center;
	justify-items: start;
}

.expander-icon {
	grid-area: icon;
	font-size: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
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
	top: 56px;
	left: 0;
	right: 0;
	background: var(--color-primary-dark);
	z-index: 10;
	box-shadow: 0 2px 4px oklch(0 0 0deg / 50%);
	display: flex;
	justify-content: center;
	padding-bottom: 24px;
	transform: translateY(0);
	transition: transform 0.3s ease;
	transform-origin: top;
}
</style>
