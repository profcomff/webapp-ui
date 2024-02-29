import { LocalStorage, LocalStorageItem } from './../models/LocalStorage';
import { NavigationGuard, RouteRecordRaw } from 'vue-router';

export const adminRoutes: RouteRecordRaw[] = [
	{
		path: '',
		component: () => import('../views/admin/AdminView.vue')
	},
	{
		path: 'groups',
		component: () => import('../views/admin/groups/AdminGroupsView.vue')
	},
	{
		path: 'scopes',
		component: () => import('../views/admin/scopes/AdminScopesView.vue')
	},
	{
		path: 'group/:id(\\d+)',
		component: () => import('../views/admin/group/AdminGroupView.vue')
	},
	{
		path: 'users',
		component: () => import('../views/admin/users/AdminUsersView.vue')
	},
	{
		path: 'achievement',
		component: () => import('../views/admin/achievement/AchievementListView.vue')
	},
	{
		path: 'achievement/:id(\\d+)',
		component: () => import('../views/admin/achievement/AchievementRecieversView.vue')
	}
];

export const adminHandler: NavigationGuard = to => {
	if (to.path.startsWith('/admin')) {
		if (!LocalStorage.get(LocalStorageItem.Token)) {
			return { path: '/auth' };
		}
	}
};
