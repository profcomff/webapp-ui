import { useToastStore } from './../../../store/toast';
import { apply, checkToken, scoped, showErrorToast } from './decorators';
import { useAuthStore, useProfileStore } from '@/store';
import { LocalStorage, LocalStorageItem, scopename } from '@/models';
import { MySessionInfo, UserInfo, authEmailApi, authScopeApi, authUserApi, userSessionApi } from '@/api/auth';

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
		[scoped, scopename.auth.user.read],
	);

	static getUsers = apply(
		async (info: UserInfo[] = []) => {
			const { setUsers } = useAuthStore();
			const { data } = await authUserApi.getUsers(info);
			setUsers(data.items);
		},
		[scoped, scopename.auth.user.read],
	);

	static logout = apply(
		async () => {
			const profileStore = useProfileStore();
			profileStore.deleteToken();
			location.reload();
		},
		[showErrorToast],
		[checkToken],
	);

	static getMe = apply(
		async (info?: MySessionInfo[]) => {
			const profileStore = useProfileStore();
			const promise = userSessionApi.getMe(info);
			const { data } = await promise;

			profileStore.id = data.id;
			profileStore.groups = data.groups ?? null;
			profileStore.indirectGroups = data.indirect_groups ?? null;
			profileStore.sessionScopes = data.session_scopes?.map(s => s.name) ?? null;
			profileStore.userScopes = data.user_scopes?.map(s => s.name) ?? null;
			profileStore.authMethods = data.auth_methods ?? null;

			LocalStorage.set<string[]>(
				LocalStorageItem.TokenScopes,
				data.session_scopes.map(s => s.name),
			);
			profileStore.updateTokenScopes();

			return promise;
		},

		[showErrorToast],
		[checkToken],
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
		[showErrorToast],
	);

	static registerEmail = apply(
		async (email: string, password: string) => {
			const toastStore = useToastStore();

			const promise = authEmailApi.register({ email, password });
			const { data } = await promise;

			toastStore.push(
				{
					title: data.message,
				},
				null,
			);

			return promise;
		},
		[showErrorToast],
	);
}
