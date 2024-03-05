<script setup lang="ts">
import { getDateWithDayOffset, stringifyDate, getWeekdayName } from '@/utils/date';
import { computed } from 'vue';

const props = defineProps<{ date: Date }>();

const yestarday = computed(() => getDateWithDayOffset(props.date, -1));
const tomorrow = computed(() => getDateWithDayOffset(props.date, 1));
</script>

<template>
	<nav class="nav" aria-label="Навигация по дням">
		<div class="wrapper">
			<RouterLink
				v-ripple
				:to="`/timetable/${stringifyDate(yestarday)}`"
				class="noselect button left"
				:aria-label="getWeekdayName(yestarday, 'long')"
			>
				<v-icon icon="arrow_back_ios" />
				<span>{{ getWeekdayName(yestarday) }}</span>
			</RouterLink>

			<span class="noselect today">{{ getWeekdayName(date, 'long') }}</span>

			<RouterLink
				v-ripple
				:to="`/timetable/${stringifyDate(tomorrow)}`"
				class="noselect button right"
				:aria-label="getWeekdayName(tomorrow)"
			>
				<span>{{ getWeekdayName(tomorrow) }}</span>
				<v-icon icon="arrow_forward_ios" class="right-icon" />
			</RouterLink>
		</div>
	</nav>
</template>

<style scoped>
.nav {
	width: 100%;
	position: sticky;
	top: 0;
	margin-bottom: 40px;
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

	&:active {
		color: inherit;
	}
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
