<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import MaterialIcon from './MaterialIcon.vue';

const show = ref(false);
const button = ref<HTMLButtonElement | null>(null);
const menu = ref<HTMLMenuElement | null>(null);
const id = `popover-${Math.trunc(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)}`;

const expanderClickHandler = () => {
	if (button.value && menu.value) {
		menu.value.style.right = `${window.innerWidth - button.value.offsetLeft - button.value.offsetWidth}px`;
		menu.value.style.top = `${button.value.offsetTop + button.value.offsetHeight}px`;
	}
	show.value = !show.value;
};

const clickOutsideHandler = (event: MouseEvent) => {
	if (show.value && button.value && event.target && !button.value.contains(event.target as Node)) {
		show.value = false;
	}
};

const windowResizeHandler = (e: Event) => {
	const w = e.target as Window;

	if (button.value && menu.value) {
		menu.value.style.right = `${w.innerWidth - button.value.offsetLeft - button.value.offsetWidth}px`;
		menu.value.style.top = `${button.value.offsetTop + button.value.offsetHeight}px`;
	}
};

onMounted(() => {
	window.addEventListener('click', clickOutsideHandler);
	window.addEventListener('resize', windowResizeHandler);
});

onUnmounted(() => {
	window.removeEventListener('click', clickOutsideHandler);
	window.removeEventListener('resize', windowResizeHandler);
});
</script>

<template>
	<button
		type="button"
		class="expander"
		v-bind="$attrs"
		@click="expanderClickHandler"
		:aria-expanded="show"
		:aria-controls="id"
		aria-label="Выпадающее меню"
		ref="button"
	>
		<slot name="expander">
			<MaterialIcon name="more_vert" />
		</slot>
	</button>
	<menu v-show="show" :id="id" class="popover" ref="menu"> <slot /></menu>
</template>

<style scoped>
.popover {
	position: absolute;
	z-index: 999;
	border-radius: 8px;
	background: white;
	box-shadow: 0 0 20px oklch(0 0 0deg / 50%);
	color: black;
}

.expander {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 2px;
	font-size: 24px;
}
</style>
