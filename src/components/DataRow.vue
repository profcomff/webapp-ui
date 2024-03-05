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
	<div v-ripple :class="{ clickable }" class="row">
		<div class="slot">
			<slot />
		</div>
		<div class="data">
			<div class="title">
				<RouterLink v-if="href" :to="href" class="title-link title">{{ title }}</RouterLink>
				<p v-else class="title">
					{{ title }}
				</p>
			</div>
			<p class="info">{{ info }}</p>
		</div>
	</div>
</template>

<style scoped>
.row {
	display: flex;
	width: 100%;
	border-radius: 16px;
	padding: 12px 20px;
	margin-bottom: 16px;
	gap: 20px;
	align-items: center;
	position: relative;
	height: 70px;

	&:last-child {
		margin-bottom: 0;
	}
}

.clickable {
	background: rgb(var(--v-theme-surface-variant));
	cursor: pointer;
	transition: ease 0.3s;
}

.clickable:hover {
	filter: brightness(90%);
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
	color: rgb(var(--v-theme-secondary));
}

.title-link::after {
	content: '';
	position: absolute;
	inset: 0;
	z-index: 1;
}
</style>
