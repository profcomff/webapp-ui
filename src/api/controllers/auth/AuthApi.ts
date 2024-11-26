import { useAuthStore } from '@/store/auth';
import { useToastStore } from '@/store/toast';
import { apply, checkToken, scoped, showErrorToast } from './decorators';
import { scopename } from '@/models/ScopeName';
import { useProfileStore } from '@/store/profile';
import { LocalStorage, LocalStorageItem } from '@/models/LocalStorage';
import { UNKNOWN_DEVICE } from '@/models';

import router from '@/router';
import apiClient from '@/api/';

export enum UserInfo {
	Groups = 'groups',
	IndirectGroups = 'indirect_groups',
	Scopes = 'scopes',
}

export enum SessionInfo {
	SessionScopes = 'session_scopes',
	Token = 'token',
	Expires = 'expires',
}

export type MySessionInfo =
	| ('groups' | 'indirect_groups' | 'session_scopes' | 'user_scopes' | 'auth_methods')[]
	| undefined;

export type UserSessionById =
	| ('groups' | 'indirect_groups' | 'auth_methods' | 'scopes')[]
	| undefined;

export class AuthApi {
	static getScopes = apply(async () => {
		const { setScopes } = useAuthStore();
		const { data } = await apiClient.GET('/auth/scope');
		if (data) {
			setScopes(data);
		}
	}, [scoped, scopename.auth.scope.read]);

	static getUser = apply(
		async (id: number, info: UserInfo[] = []) => {
			const { setUsers } = useAuthStore();
			const { data } = await apiClient.GET('/auth/user/{user_id}', {
				params: {
					path: { user_id: id },
					query: { info },
				},
			});

			if (data) {
				setUsers([data]);
			}
		},
		[scoped, scopename.auth.user.read]
	);

	static getUsers = apply(
		async (info: UserInfo[] = []) => {
			const { setUsers } = useAuthStore();
			const { data } = await apiClient.GET('/auth/user', {
				params: { query: { info } },
			});
			if (data) {
				setUsers(data.items);
			}
		},
		[scoped, scopename.auth.user.read]
	);

	static logout = apply(async () => {
		const profileStore = useProfileStore();
		const toastStore = useToastStore();
		profileStore.deleteToken();
		await apiClient.POST('/auth/logout');
		profileStore.updateToken();
		router.push('/auth');
		toastStore.push({
			title: 'Вы успешно вышли из аккаунта',
		});
	}, [showErrorToast]);

	static getMe = apply(
		async (info?: MySessionInfo) => {
			const profileStore = useProfileStore();
			const promise = apiClient.GET('/auth/me', {
				params: { query: { info } },
			});
			const { data } = await promise;

			if (data) {
				profileStore.id = data.id;
				if (data.groups) {
					profileStore.groups = data.groups ?? null;
				}
				if (data.indirect_groups) {
					profileStore.indirectGroups = data.indirect_groups;
				}
				if (data.session_scopes) {
					profileStore.sessionScopes = data.session_scopes.map(s => s.name);
					LocalStorage.set<string[]>(
						LocalStorageItem.TokenScopes,
						data.session_scopes.map(s => s.name)
					);
				}
				if (data.user_scopes) {
					profileStore.userScopes = data.user_scopes.map(s => s.name);
				}
				if (data.auth_methods) {
					profileStore.authMethods = data.auth_methods;
				}

				profileStore.updateTokenScopes();
			}

			return promise;
		},
		[showErrorToast],
		[checkToken]
	);

	static getById = apply(
		async (id: number, info?: UserSessionById) => {
			const promise = apiClient.GET('/auth/user/{user_id}', {
				params: {
					path: { user_id: id },
					query: { info },
				},
			});
			return promise;
		},
		[showErrorToast],
		[checkToken]
	);

	static loginEmail = apply(
		async (email: string, password: string) => {
			const profileStore = useProfileStore();
			const toastStore = useToastStore();

			const promise = apiClient.POST('/auth/email/login', {
				body: {
					email,
					password,
					session_name: navigator.userAgent ?? UNKNOWN_DEVICE,
				},
			});
			const { data } = await promise;

			if (data) {
				LocalStorage.set(LocalStorageItem.Token, data.token);
				profileStore.updateToken();

				toastStore.push({
					title: 'Вы успешно вошли в аккаунт',
				});
			}

			return promise;
		},
		[showErrorToast]
	);

	static approveEmail = apply(
		async (token: string) => {
			const toastStore = useToastStore();
			const promise = apiClient.GET('/auth/email/approve', { params: { query: { token } } });
			const data = await promise;

			if (data) {
				toastStore.push({
					title: 'Вы успешно подтвердили E-mail',
				});
			}

			return promise;
		},
		[showErrorToast]
	);

	static registerEmail = apply(
		async (email: string, password: string) => {
			return apiClient.POST('/auth/email/registration', { body: { email, password } });
		},
		[showErrorToast]
	);

	static getSessions = apply(
		async (info?: SessionInfo[]) => {
			const promise = apiClient.GET('/auth/session', { params: { query: { info } } });

			return promise;
		},
		[showErrorToast],
		[checkToken]
	);

	static deleteSession = apply(
		async (token: string) => {
			const promise = apiClient.DELETE('/auth/session/{token}', {
				params: { path: { token } },
			});

			return promise;
		},
		[checkToken],
		[showErrorToast]
	);

	static requestResetForgottenPassword = apply(
		async (email: string) => {
			const promise = apiClient.POST('/auth/email/reset/password/restore', {
				body: { email },
			});

			return promise;
		},
		[showErrorToast]
	);

	static requestResetPassword = apply(
		async (password: string, new_password: string) => {
			const promise = apiClient.POST('/auth/email/reset/password/request', {
				body: {
					password,
					new_password,
				},
			});

			return promise;
		},
		[showErrorToast],
		[checkToken]
	);

	static resetPassword = apply(
		async (new_password: string, token: string) => {
			const promise = apiClient.POST('/auth/email/reset/password', {
				params: { header: { 'reset-token': token } },
				body: { new_password },
			});

			return promise;
		},
		[showErrorToast]
	);

	static resetEmail = apply(
		async (token: string) => {
			const promise = apiClient.GET('/auth/email/reset/email', {
				params: { query: { token } },
			});

			return promise;
		},
		[showErrorToast]
	);

	static requestResetEmail = apply(
		async (email: string) => {
			const promise = apiClient.POST('/auth/email/reset/email/request', {
				body: { email },
			});

			return promise;
		},
		[checkToken],
		[showErrorToast]
	);
}
