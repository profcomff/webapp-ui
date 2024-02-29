import { UserdataExtendedValue } from '@/api/models';

export enum ToastType {
	Error = 'error',
	Warn = 'warn',
	Info = 'info'
}

export interface Toast {
	title: string;
	type?: ToastType;
	description?: string;
}

export type UserdataTreeSheet = Map<string, UserdataExtendedValue>;

export type UserdataTree = Map<string, UserdataTreeSheet>;

export interface UserdataArrayDataItem {
	param: string;
	value: UserdataExtendedValue;
}

export interface UserdataArrayCategoryItem {
	category: string;
	param: string;
}

export interface UserdataArrayItem {
	name: string;
	data: UserdataArrayDataItem[];
}

export type UserdataArray = UserdataArrayItem[];

export enum UserdataCategoryName {
	PersonalInfo = 'Личная информация',
	Study = 'Учёба',
	Contacts = 'Контакты',
	Career = 'Карьера'
}

export enum UserdataParams {
	FullName = 'Полное имя',
	Photo = 'Фото'
}

export type UserdataConfig = Readonly<Record<UserdataCategoryName, Readonly<UserdataParams[]>>>;
