import { Group, Scope } from '../models';
import { AuthBaseApi } from './AuthBaseApi';

interface CreateGroupBody {
	name: string;
	parent_id: number;
	scopes: number[];
}

interface GetGroupParams {
	info: Array<'child' | 'scopes' | 'indirect_scopes'>;
}

export enum GroupInfo {
	Child = 'child',
	Scopes = 'scopes',
	IndirectScopes = 'indirect_scopes',
}

class AuthGroupApi extends AuthBaseApi {
	constructor() {
		super('/group');
	}

	public async getGroup<Info = never>(id: number, params?: GetGroupParams) {
		return this.get<
			Group & {
				scopes: GroupInfo.Scopes extends Info ? Scope[] : never;
				indirect_scopes: GroupInfo.IndirectScopes extends Info ? Scope[] : never;
				child: GroupInfo.Child extends Info ? Group[] : never;
			},
			GetGroupParams
		>(`/${id}`, params);
	}

	public async deleteGroup(id: number, token: string) {
		return this.delete<string>(`/${id}`, undefined, {
			Authorization: token,
		});
	}

	public async patchGroup(id: number, body: Partial<CreateGroupBody>, token: string) {
		return this.patch<Group, Partial<CreateGroupBody>>(`/${id}`, body, {
			Authorization: token,
		});
	}

	public async getGroups(params?: GetGroupParams) {
		return this.get<{ items: Group[] }, GetGroupParams>('', params);
	}

	public async createGroup(body: CreateGroupBody, token: string) {
		return this.post<Group, CreateGroupBody>('', body, {
			Authorization: token,
		});
	}
}

export const authGroupApi = new AuthGroupApi();
