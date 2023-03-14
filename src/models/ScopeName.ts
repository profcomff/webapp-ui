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
});
