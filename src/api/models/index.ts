export interface Entity {
	id: number;
}

export type ArrayResponse<I extends Entity> = {
	items: I[];
	limit: number;
	offset: number;
	total: number;
};

export interface StudyGroup extends Entity {
	name: string;
	number: string;
}

export interface Event extends Entity {
	name: string;
	room: Room[];
	group: StudyGroup[];
	lecturer: Lecturer[];
	start_ts: string;
	end_ts: string;
}

export interface Lecturer extends Entity {
	first_name: string;
	middle_name: string;
	last_name: string;
	avatar_id: number;
	avatar_link: string;
	description: string;
}

export interface Room extends Entity {
	name: string;
	building: string;
	direction: string;
}

export enum ButtonType {
	Internal = 'internal',
	External = 'external',
	Inapp = 'inapp',
	Disabled = 'disabled',
}

export interface AppButton {
	id: number;
	order: number;
	icon: string;
	name: string;
	link: string;
	type: ButtonType;
}

export interface AppButtonCategory {
	id: number;
	order: number;
	type: 'grid3' | 'list';
	name: string;
}

export interface Group {
	id: number;
	name: string;
	parent_id: number | null;
}

export interface Scope {
	id: number;
	name: string;
	comment: string;
}

export interface User extends Entity {
	email: string;
}

export interface SessionScope extends Entity {
	name: string;
}

export interface UserScope extends Entity {
	name: string;
}

export interface Session extends Entity {
	email: string;
}

export interface UserdataSource extends Entity {
	name: string;
	trust_level: number;
}

export interface UserdataCategory extends Entity {
	name: string;
	read_scope?: string;
	update_scope?: string;
	params?: UserdataParam[];
}

export enum UserdataParamResponseType {
	All = 'all',
	Last = 'last',
	MostTrusted = 'most_trusted',
}

export interface UserdataParam extends Entity {
	name: string;
	is_required: boolean;
	changeable: boolean;
	type: UserdataParamResponseType;
	category_id: number;
}

export interface UserdataRawItem {
	category: string;
	param: string;
	value: UserdataExtendedValue | string;
}

export interface UserdataRaw {
	items: UserdataRawItem[];
}

export interface UserdataExtendedValue {
	name: string;
	is_required?: boolean;
	changeable?: boolean;
	type?: UserdataParamResponseType;
}

export interface UserdataUpdateUserItem {
	category: string;
	param: string;
	value: string | null;
}

export interface UserdataUpdateUser {
	items: UserdataUpdateUserItem[];
	source: string;
}
