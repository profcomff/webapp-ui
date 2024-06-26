import { useAuthStore } from '@/store/auth';
import { useToastStore } from './../../../store/toast';
import { apply, checkToken, scoped, showErrorToast } from './decorators';
import {
	MySessionInfo,
	SessionInfo,
	UserInfo,
	authEmailApi,
	authScopeApi,
	authUserApi,
	userSessionApi,
} from '@/api/auth';
import router from '@/router';
import { scopename } from '@/models/ScopeName';
import { useProfileStore } from '@/store/profile';
import { LocalStorage, LocalStorageItem } from '@/models/LocalStorage';

export class AuthApi {
	static getScopes = apply(async () => {
		const { setScopes } = useAuthStore();
		const { data } = await authScopeApi.getScopes();
		setScopes(data);
	}, [scoped, scopename.auth.scope.read]);

	static getUser = apply(
		async (id: number, info: UserInfo[] = []) => {
			const { setUsers } = useAuthStore();
			const { data } = await authUserApi.getUser(id, info);
			setUsers([data]);
		},
		[scoped, scopename.auth.user.read]
	);

	static getUsers = apply(
		async (info: UserInfo[] = []) => {
			const { setUsers } = useAuthStore();
			const { data } = await authUserApi.getUsers(info);
			setUsers(data.items);
		},
		[scoped, scopename.auth.user.read]
	);

	static logout = apply(async () => {
		const profileStore = useProfileStore();
		const toastStore = useToastStore();
		profileStore.deleteToken();
		router.push('/auth');
		toastStore.push({
			title: 'Вы успешно вышли из аккаунта',
		});
	}, [showErrorToast]);

	static getMe = apply(
		async (info?: MySessionInfo[]) => {
			const profileStore = useProfileStore();
			const promise = userSessionApi.getMe(info);
			const { data } = await promise;

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
				profileStore.authMethods = data.auth_methods ?? null;
			}

			profileStore.updateTokenScopes();

			return promise;
		},

		[showErrorToast],
		[checkToken]
	);

	static getById = apply(
		async (id: number, info?: MySessionInfo[]) => {
			const promise = userSessionApi.getById(id, info);
			return promise;
		},

		[showErrorToast],
		[checkToken]
	);

	static loginEmail = apply(
		async (email: string, password: string) => {
			const profileStore = useProfileStore();
			const toastStore = useToastStore();

			const promise = authEmailApi.login({ email, password });
			const { data } = await promise;

			LocalStorage.set(LocalStorageItem.Token, data.token);
			profileStore.updateToken();

			toastStore.push({
				title: 'Вы успешно вошли в аккаунт',
			});

			return promise;
		},
		[showErrorToast]
	);

	static approveEmail = apply(
		async (token: string) => {
			const toastStore = useToastStore();

			await authEmailApi.approveEmail({ token });
			toastStore.push({
				title: 'Вы успешно подтвердили E-mail',
			});
		},
		[showErrorToast]
	);

	static registerEmail = apply(
		async (email: string, password: string) => {
			return authEmailApi.register({ email, password });
		},
		[showErrorToast]
	);

	static getSessions = apply(
		async (info?: SessionInfo[]) => {
			const data = await userSessionApi.getSessions(info);
			return data;
		},
		[showErrorToast],
		[checkToken]
	);

	static deleteSession = apply(
		async (token: string) => {
			const data = await userSessionApi.deleteSession(token);
			return data;
		},
		[checkToken],
		[showErrorToast]
	);

	static requestResetForgottenPassword = apply(
		async (email: string) => {
			const data = await authEmailApi.requestResetForgottenPassword({ email });
			return data;
		},
		[showErrorToast]
	);

	static requestResetPassword = apply(
		async (password: string, new_password: string) => {
			const data = await authEmailApi.requestResetPassword({ password, new_password });
			return data;
		},
		[showErrorToast],
		[checkToken]
	);

	static resetPassword = apply(
		async (new_password: string, token: string) => {
			const data = await authEmailApi.resetPassword({ new_password }, token);
			return data;
		},
		[showErrorToast]
	);

	static resetEmail = apply(
		async (token: string) => {
			const data = await authEmailApi.resetEmail({ token });
			return data;
		},
		[showErrorToast]
	);

	static requestResetEmail = apply(
		async (email: string) => {
			const data = await authEmailApi.requestResetEmail({ email });
			return data;
		},
		[checkToken],
		[showErrorToast]
	);
}
