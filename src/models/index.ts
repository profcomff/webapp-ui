export { LocalStorage, LocalStorageItem } from './LocalStorage';
export { scopename } from './ScopeName';

export enum ToastType {
	Error = 'error',
	Warn = 'warn',
	Info = 'info',
}

export interface Toast {
	title: string;
	type?: ToastType;
	description?: string;
}

export type UserdataTreeSheet = Map<string, string>;

export type UserdataTree = Map<string, UserdataTreeSheet>;

export interface UserdataArrayDataItem {
	param: string;
	value: string;
}

export interface UserdataArrayItem {
	name: string;
	data: UserdataArrayDataItem[];
}

export type UserdataArray = UserdataArrayItem[];

export enum UserdataCategoryName {
	PersonalInfo = 'Личная информация',
	Study = 'Учеба',
	Contacts = 'Контакты',
}

export enum UserdataParamName {
	Surname = 'Фамилия',
	Name = 'Имя',
	Patronymic = 'Отчество',
}

export type UserdataConfig = Readonly<Record<UserdataCategoryName, Readonly<UserdataParamName[]>>>;
