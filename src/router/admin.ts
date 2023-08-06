import { RouteRecordRaw } from 'vue-router';

export const adminRoutes: RouteRecordRaw[] = [
	{
		path: '',
		component: () => import('@/views/admin/AdminView.vue'),
	},
	{
		path: 'groups',
		component: () => import('@/views/admin/groups/AdminGroupsView.vue'),
	},
	{
		path: 'scopes',
		component: () => import('@/views/admin/scopes/AdminScopesView.vue'),
	},
	{
		path: 'group/:id(\\d+)',
		component: () => import('@/views/admin/group/AdminGroupView.vue'),
	},
	{
		path: 'users',
		component: () => import('@/views/admin/users/AdminUsersView.vue'),
	},
];
