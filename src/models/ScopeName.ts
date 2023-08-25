export const scopename = Object.freeze({
	auth: {
		group: {
			create: 'auth.group.create',
			delete: 'auth.group.delete',
			update: 'auth.group.update',
		},
		scope: {
			create: 'auth.scope.create',
			delete: 'auth.scope.delete',
			update: 'auth.scope.delete',
			read: 'auth.scope.read',
		},
		user: {
			delete: 'auth.user.delete',
			read: 'auth.user.read',
			update: 'auth.user.update',
		},
	},
	achievements: {
		achievement: {
			create: 'achievements.achievement.create',
			update: 'achievements.achievement.edit',
			give: 'achievements.achievement.give',
			revoke: 'achievements.achievement.revoke',
		},
	},
	webapp: {
		admin: {
			show: 'webapp.admin.show',
		},
	},
});
