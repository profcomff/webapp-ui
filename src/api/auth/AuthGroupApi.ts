import { Group, Scope } from '../models';
import { AuthBaseApi } from './AuthBaseApi';

interface CreateGroupBody {
	name: string;
	parent_id: number;
	scopes: number[];
}

export enum GroupInfo {
	Children = 'child',
	Scopes = 'scopes',
	IndirectScopes = 'indirect_scopes',
	Users = 'users',
}

interface GetGroupParams {
	info: Array<GroupInfo>;
}

class AuthGroupApi extends AuthBaseApi {
	constructor() {
		super('/group');
	}

	public async getGroup<Info extends GroupInfo = never>(id: number, params?: GetGroupParams) {
		return this.get<
			Group & {
				[GroupInfo.Scopes]: GroupInfo.Scopes extends Info ? Scope[] : never;
				[GroupInfo.IndirectScopes]: GroupInfo.IndirectScopes extends Info ? Scope[] : never;
				[GroupInfo.Children]: GroupInfo.Children extends Info ? Group[] : never;
				[GroupInfo.Users]: never;
			},
			GetGroupParams
		>(`/${id}`, params);
	}

	public async deleteGroup(id: number) {
		return this.delete<string>(`/${id}`, undefined);
	}

	public async patchGroup(id: number, body: Partial<CreateGroupBody>) {
		return this.patch<Group, Partial<CreateGroupBody>>(`/${id}`, body);
	}

	public async getGroups(params?: GetGroupParams) {
		return this.get<{ items: Group[] }, GetGroupParams>('', params);
	}

	public async createGroup(body: CreateGroupBody) {
		return this.post<Group, CreateGroupBody>('', body);
	}
}

export const authGroupApi = new AuthGroupApi();
