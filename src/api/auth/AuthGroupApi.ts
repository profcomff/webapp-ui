import { AuthGroup, Scope } from '../models';
import { AuthBaseApi } from './AuthBaseApi';

interface GetGroupResponse extends AuthGroup {
	scopes: Scope[];
	indirect_scopes: Scope[];
	child: AuthGroup[];
}

interface ModifyGroupBody {
	name?: string;
	parent_id?: number;
	scopes?: number[];
}

interface GetGroupParams {
	info: Array<'child' | 'scopes' | 'indirect_scopes'>;
}

class AuthGroupApi extends AuthBaseApi {
	constructor() {
		super('/group');
	}

	public async getGroup(id: number, params?: GetGroupParams) {
		return this.get<GetGroupResponse, GetGroupParams>(`/${id}`, params);
	}

	public async deleteGroup(id: number, token: string) {
		return this.delete<string>(`/${id}`, undefined, {
			Authorization: token,
		});
	}

	public async patchGroup(id: number, body: ModifyGroupBody, token: string) {
		return this.patch<AuthGroup, ModifyGroupBody>(`/${id}`, body, {
			Authorization: token,
		});
	}

	public async getGroups(params?: GetGroupParams) {
		return this.get<{ items: AuthGroup[] }, GetGroupParams>('', params);
	}

	public async createGroup(body: ModifyGroupBody, token: string) {
		return this.post<AuthGroup, ModifyGroupBody>('', body, {
			Authorization: token,
		});
	}
}

export const authGroupApi = new AuthGroupApi();
