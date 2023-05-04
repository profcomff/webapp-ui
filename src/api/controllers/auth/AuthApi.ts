import { scoped } from './decorators';
import { useAuthStore, useProfileStore } from '@/store';
import { LocalStorage, LocalStorageItem, scopename } from '@/models';
import { SessionInfo, UserInfo, authScopeApi, authUserApi, userSessionApi } from '@/api/auth';

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

	static async logout() {
		const profileStore = useProfileStore();
		if (profileStore.isUserLogged) {
			await userSessionApi.logout();
			LocalStorage.delete(LocalStorageItem.Token);
			LocalStorage.delete(LocalStorageItem.TokenScopes);
			location.reload();
		}
	}

	static async getMe(info?: SessionInfo[]) {
		const profileStore = useProfileStore();
		const { data } = await userSessionApi.getMe(info);

		profileStore.id = data.id;
		profileStore.groups = data.groups ?? null;
		profileStore.indirectGroups = data.indirect_groups ?? null;
		profileStore.sessionScopes = data.session_scopes?.map(s => s.name) ?? null;
		profileStore.userScopes = data.user_scopes?.map(s => s.name) ?? null;

		LocalStorage.set<string[]>(
			LocalStorageItem.TokenScopes,
			data.session_scopes.map(s => s.name),
		);
		profileStore.updateTokenScopes();
	}
}
