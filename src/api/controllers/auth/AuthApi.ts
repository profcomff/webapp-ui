import { useToastStore } from './../../../store/toast';
import { scoped, showErrorToast } from './decorators';
import { useAuthStore, useProfileStore } from '@/store';
import { LocalStorage, LocalStorageItem, scopename } from '@/models';
import { MySessionInfo, UserInfo, authEmailApi, authScopeApi, authUserApi, userSessionApi } from '@/api/auth';

export class AuthApi {
	static getScopes = scoped(scopename.auth.scope.read, async function getScopes() {
		const { setScopes } = useAuthStore();
		const { data } = await authScopeApi.getScopes();
		setScopes(data);
	});

	static getUser = scoped(scopename.auth.user.read, async function getUser(id: number, info: UserInfo[]) {
		const { setUsers } = useAuthStore();
		const { data } = await authUserApi.getUser(id, info);
		setUsers([data]);
	});

	static getUsers = scoped(scopename.auth.user.read, async function getUsers(info: UserInfo[]) {
		const { setUsers } = useAuthStore();
		const { data } = await authUserApi.getUsers(info);
		setUsers(data.items);
	});

	static logout = showErrorToast<ReturnType<typeof userSessionApi.logout>>(async () => {
		{
			const toastStore = useToastStore();
			const promise = userSessionApi.logout();

			await promise;

			LocalStorage.delete(LocalStorageItem.Token);
			LocalStorage.delete(LocalStorageItem.TokenScopes);

			toastStore.push({
				title: 'Вы успешно вышли из аккаунта',
			});

			return promise;
		}
	});

	static getMe = showErrorToast<ReturnType<typeof userSessionApi.getMe>>(async (info?: MySessionInfo[]) => {
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
	});

	static loginEmail = showErrorToast<ReturnType<typeof authEmailApi.login>>(
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
	);

	static registerEmail = showErrorToast<ReturnType<typeof authEmailApi.register>>(
		async (email: string, password: string) => {
			const toastStore = useToastStore();

			const promise = authEmailApi.register({ email, password });
			const { data } = await promise;

			toastStore.push(
				{
					title: data.message,
				},
				'infinity',
			);

			return promise;
		},
	);
}
