export interface ToolbarMenuItem {
	name: string;
	onClick: () => void;
}

interface ActionItem {
	icon: string;
	ariaLabel: string;
}

export interface ToolbarActionButton extends ActionItem {
	onClick: (event: MouseEvent) => void;
}

export interface ToolbarActionLink extends ActionItem {
	href: string;
}

export type ToolbarAction = ToolbarActionButton | ToolbarActionLink;
