<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import MaterialIcon from './MaterialIcon.vue';

const show = ref(false);
const button = ref<HTMLButtonElement | null>(null);
const menu = ref<HTMLMenuElement | null>(null);
const id = `popover-${Math.trunc(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)}`;

const clickOutsideHandler = (event: MouseEvent) => {
	if (show.value && event.target !== button.value) {
		event.preventDefault();
		show.value = false;
	}
};

onMounted(() => {
	if (button.value && menu.value) {
		menu.value.style.right = `${window.innerWidth - button.value.offsetLeft - button.value.offsetWidth}px`;
		menu.value.style.top = `${button.value.offsetTop + button.value.offsetHeight}px`;
	}

	document.addEventListener('click', clickOutsideHandler);
});

onUnmounted(() => {
	document.removeEventListener('click', clickOutsideHandler);
});
</script>

<template>
	<button
		type="button"
		class="expander"
		v-bind="$attrs"
		@click="show = !show"
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
	box-shadow: 0 0 20px rgba(0, 0, 0, 50%);
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
