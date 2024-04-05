<script setup lang="ts"></script>

<template>
	<div class="loader-container">
		<div class="loader" />
	</div>
</template>

<style>
.loader-container {
	display: flex;
	flex-direction: column;
	flex: 1;
	place-content: space-around center;
	width: 100%;
	height: 100%;
}

.loader-container > * {
	margin: 16px auto;
}

.loader {
	width: 60px;
	aspect-ratio: 4;
	background: radial-gradient(circle closest-side, #000 90%, #0000) 0 / calc(100% / 3) 100% space;
	clip-path: inset(0 100% 0 0);
	animation: l1 1s steps(4) infinite;
}

@keyframes l1 {
	to {
		clip-path: inset(0 -34% 0 0);
	}
}
</style>
