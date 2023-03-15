<script setup lang="ts">
interface Props {
	clickable?: boolean;
	title: string;
	info?: string;
	href?: string;
}

defineProps<Props>();
</script>

<template>
	<div :class="['row', { clickable }]">
		<div class="slot">
			<slot />
		</div>
		<div class="data">
			<div class="title">
				<RouterLink v-if="href" :to="href" class="title-link">{{ title }}</RouterLink>
				<template v-else>
					{{ title }}
				</template>
			</div>
			<div class="info">{{ info }}</div>
		</div>
	</div>
</template>

<style scoped>
.row {
	display: flex;
	width: 100%;
	border-radius: 16px;
	padding: 12px 16px;
	margin-bottom: 8px;
	gap: 16px;
	align-items: center;
	position: relative;
	transition: background 0.3s;
}

.row:last-child {
	margin-bottom: 0;
}

.clickable {
	background: whitesmoke;
	cursor: pointer;
}

.clickable:is(:hover, :active) {
	background: lightgray;
}

.slot {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.children:empty {
	display: none;
}

.data {
	display: flex;
	flex-direction: column;
	overflow: hidden;
	gap: 2px;
}

.title {
	font-weight: bold;
}

.info {
	font-weight: normal;
}

.title,
.info {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	text-align: start;
}

.info:empty {
	display: none;
}

.title-link:focus-visible {
	outline: none;
	color: var(--color-accent);
}

.title-link::after {
	content: '';
	position: absolute;
	inset: 0;
	z-index: 1;
}
</style>
