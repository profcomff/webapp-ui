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
