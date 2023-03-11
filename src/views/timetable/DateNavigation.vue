<script setup lang="ts">
import { MaterialIcon } from '@/components/lib';
import { getDateWithDayOffset, getWeekdayName, stringifyDate } from '@/utils';
import { computed } from '@vue/reactivity';

const props = defineProps<{ date: Date }>();

const yestarday = computed(() => getDateWithDayOffset(props.date, -1));
const tomorrow = computed(() => getDateWithDayOffset(props.date, 1));
</script>

<template>
	<nav class="nav" aria-label="Навигация по дням">
		<div class="container wrapper">
			<RouterLink
				:to="`/timetable/${stringifyDate(yestarday)}`"
				class="noselect button left"
				:aria-label="getWeekdayName(yestarday, 'long')"
			>
				<MaterialIcon name="arrow_back_ios" />
				<span>{{ getWeekdayName(yestarday) }}</span>
			</RouterLink>

			<span class="noselect today">{{ getWeekdayName(date, 'long') }}</span>

			<RouterLink
				:to="`/timetable/${stringifyDate(tomorrow)}`"
				class="noselect button right"
				:aria-label="getWeekdayName(tomorrow)"
			>
				<span>{{ getWeekdayName(tomorrow) }}</span>
				<MaterialIcon name="arrow_forward_ios" class="right-icon" />
			</RouterLink>
		</div>
	</nav>
</template>

<style scoped>
.nav {
	width: 100%;
	position: sticky;
	top: 0;
	background: white;
}
.wrapper {
	display: flex;
	align-items: center;
	justify-content: space-between;
	text-transform: uppercase;
}

.button {
	padding: 16px 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	text-decoration: none;
	font-weight: 500;
	color: inherit;
}

.button:active {
	color: inherit;
}

.right-icon {
	margin-left: 4px;
}

.left {
	padding-left: 16px;
}

.right {
	padding-right: 16px;
}

.today {
	font-weight: 500;
}
</style>
