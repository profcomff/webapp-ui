import { authUserApi, UserInfo } from './../../auth/AuthUserApi';
import { scopename } from './../../../models/ScopeName';
import { useAuthStore } from './../../../store/auth';
import { authScopeApi } from './../../auth/AuthScopeApi';
import { scoped } from './decorators';

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
}
