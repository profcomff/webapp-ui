import { LocalStorage, LocalStorageItem } from '@/models';
import { NavigationGuard } from 'vue-router';
import { StudyGroup } from '@/api/models';

export const timetableGuard: NavigationGuard = to => {
	const group = LocalStorage.getObject<StudyGroup>(LocalStorageItem.StudyGroup);

	if (to.path !== '/timetable/init' && to.path.startsWith('/timetable') && !group) {
		return { path: '/timetable/init' };
	}

	if (to.path === '/timetable/init' && group) {
		return { path: '/timetable' };
	}
};
