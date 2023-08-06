import { NavigationHookAfter } from 'vue-router';
import { marketingApi } from '@/api/marketing';
import { useProfileStore } from '@/store';

export const marketingGuard: NavigationHookAfter = (to, from) => {
	const { marketingId } = useProfileStore();
	if (marketingId) {
		marketingApi.writeAction({
			action: 'route to',
			path_from: from.fullPath,
			path_to: to.fullPath,
			user_id: marketingId,
		});
	}
};
