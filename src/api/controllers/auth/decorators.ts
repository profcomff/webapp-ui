/* eslint-disable @typescript-eslint/no-explicit-any */
import { ToastType } from '@/models';
import { useProfileStore, useToastStore } from '@/store';
import axios from 'axios';

export function scoped<Response>(scopeName: string, method: (...args: any[]) => Response) {
	return (...args: any[]) => {
		const { hasTokenAccess } = useProfileStore();
		const toastStore = useToastStore();

		if (hasTokenAccess(scopeName)) {
			return method(...args);
		} else {
			toastStore.push({
				title: `У вас нет доступа к методу ${method.name}`,
				type: ToastType.Error,
			});
		}
	};
}

export function showErrorToast<Response>(method: (...args: any[]) => Response) {
	return async (...args: any[]) => {
		const toastStore = useToastStore();
		try {
			const response = await method(...args);
			return response;
		} catch (err) {
			if (axios.isAxiosError(err)) {
				toastStore.push({
					title: err.response?.data.message,
					type: ToastType.Error,
				});
			} else {
				toastStore.push({
					title: 'Неизвестная ошибка',
					description: err instanceof Error ? err.message : '',
					type: ToastType.Error,
				});
			}
		}
	};
}
