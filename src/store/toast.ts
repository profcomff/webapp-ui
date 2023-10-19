import { Toast } from '@/models';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useToastStore = defineStore('toast', () => {
	const list = ref<Map<number, Toast>>(new Map());

	function push(toast: Toast, timeout: number | null = 30000000) {
		const id = Math.round(Number.MAX_SAFE_INTEGER * Math.random());
		list.value.set(id, toast);
		if (timeout !== null) {
			setTimeout(() => remove(id), timeout);
		}
	}

	function remove(id: number) {
		list.value.delete(id);
	}

	return { list, push, remove };
});
