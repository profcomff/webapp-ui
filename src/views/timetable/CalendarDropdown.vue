<script setup lang="ts">
import { MaterialIcon, IrdomCalendar } from '@/components/lib';
import { useTimetableStore } from '@/store';
import { onMounted, onUnmounted, ref } from 'vue';

const show = ref(false);
const expander = ref<HTMLButtonElement | null>(null);
const calendar = ref<HTMLDivElement | null>(null);
const { group } = useTimetableStore();

defineProps<{ date: Date }>();

const clickOutsideHandler = (e: MouseEvent) => {
	if (e.target !== expander.value && e.target !== calendar.value) {
		show.value = false;
	}
};

onMounted(() => {
	document.addEventListener('click', clickOutsideHandler);
});

onUnmounted(() => {
	document.removeEventListener('click', clickOutsideHandler);
});

const textClickHandler = (e: MouseEvent) => {
	e.stopImmediatePropagation();
	show.value = !show.value;
};
</script>

<template>
	<button
		type="button"
		class="expander"
		:aria-expanded="show"
		aria-controls="calendar"
		@click="show = !show"
		ref="expander"
	>
		<span class="date" @click="textClickHandler">
			{{ date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) }}
		</span>

		<span class="group" @click="textClickHandler">
			{{ `Группа ${group?.number ?? ''}` }}
		</span>

		<MaterialIcon name="expand_more" class="expander-icon" />
	</button>
	<div v-show="show" class="dropdown" id="calendar" ref="calendar" @click="$event.stopImmediatePropagation()">
		<IrdomCalendar :date="date" />
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
	box-shadow: 0 2px 4px rgb(0 0 0 / 50%);
	display: flex;
	justify-content: center;
	padding-bottom: 24px;
}
</style>
