export interface ToolbarMenuItem {
	name: string;
	onClick: () => void;
}

export interface ToolbarActionItem {
	icon: string;
	ariaLabel: string;
	onClick: (event: MouseEvent) => void;
}
