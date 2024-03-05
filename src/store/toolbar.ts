import { ToolbarActionItem, ToolbarMenuItem } from '@/components/IrdomToolbar.vue';
import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Setup {
	menuItems: ToolbarMenuItem[];
	title: string;
	backUrl: string | undefined;
	actions: ToolbarActionItem[];
	backable: boolean;
	share: boolean;
}

export const useToolbar = defineStore('toolbar', () => {
	const menuItems = ref<ToolbarMenuItem[]>([]);
	const title = ref('Твой ФФ!');
	const backUrl = ref<string | undefined>(undefined);
	const actions = ref<ToolbarActionItem[]>([]);
	const backable = ref(false);
	const share = ref(false);

	function setup(s: Partial<Setup>) {
		menuItems.value = s.menuItems ?? [];
		actions.value = s.actions ?? [];
		title.value = s.title ?? 'Твой ФФ!';
		backUrl.value = s.backUrl ?? undefined;
		backable.value = s.backable ?? Boolean(s.backUrl);
		share.value = s.share ?? false;
	}

	return { menuItems, title, backUrl, actions, backable, share, setup };
});
