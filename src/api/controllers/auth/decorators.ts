/* eslint-disable @typescript-eslint/no-explicit-any */
import { useProfileStore } from '@/store';

export const scoped = (scopeName: string, method: (...args: any[]) => any) => {
	return (...args: any[]) => {
		const { hasTokenAccess } = useProfileStore();
		if (hasTokenAccess(scopeName)) {
			return method(...args);
		} else {
			alert(`У вас нет доступа к методу ${method.name}`);
		}
	};
};
