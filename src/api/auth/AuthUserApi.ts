import { Group, User, Scope } from '../models';
import { AuthBaseApi } from './AuthBaseApi';

export enum UserInfo {
	Groups = 'groups',
	IndirectGroups = 'indirect_groups',
	Scopes = 'scopes',
}

class AuthUserApi extends AuthBaseApi {
	constructor() {
		super('/user');
	}

	public async getUser<Info extends UserInfo = never>(id: number, info: Info[]) {
		return this.get<
			User & {
				[UserInfo.Groups]: UserInfo.Groups extends Info ? Group[] : never;
				[UserInfo.IndirectGroups]: UserInfo.IndirectGroups extends Info ? Group[] : never;
				[UserInfo.Scopes]: UserInfo.Scopes extends Info ? Scope[] : never;
			},
			{ info: Info[] }
		>(`/${id}`, { info });
	}

	public async deleteUser(id: number) {
		return this.delete<string>(`/${id}`);
	}

	public async getUsers<Info extends UserInfo = never>(info: Info[]) {
		return this.get<
			{
				items: Array<
					User & {
						[UserInfo.Groups]: UserInfo.Groups extends Info ? Group[] : never;
						[UserInfo.IndirectGroups]: UserInfo.IndirectGroups extends Info ? Group[] : never;
						[UserInfo.Scopes]: UserInfo.Scopes extends Info ? Scope[] : never;
					}
				>;
			},
			{ info: Info[] }
		>('', { info });
	}
}

export const authUserApi = new AuthUserApi();
