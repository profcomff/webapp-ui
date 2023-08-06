import { LocalStorage, LocalStorageItem } from '@/models';
import { NavigationGuard } from 'vue-router';

export const authGuard: NavigationGuard = to => {
	if (to.path === '/auth' && LocalStorage.get(LocalStorageItem.Token)) {
		return { path: '/profile' };
	}
};
