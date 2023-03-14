import { Group, Scope } from '../models';
import { AuthBaseApi } from './AuthBaseApi';

interface GetMeResponse {
	id: number;
	email: string;
}

export enum MeInfo {
	Groups = 'groups',
	IndirectGroups = 'indirect_groups',
	TokenScopes = 'session_scopes',
	UserScopes = 'user_scopes',
}

interface GetMeParams {
	info: Array<MeInfo>;
}

class AuthProfileApi extends AuthBaseApi {
	constructor() {
		super();
	}

	public async getMe<Info extends MeInfo = never>(params: GetMeParams) {
		return this.get<
			GetMeResponse & {
				[MeInfo.Groups]: MeInfo.Groups extends Info ? Group[] : never;
				[MeInfo.IndirectGroups]: MeInfo.IndirectGroups extends Info ? Group[] : never;
				[MeInfo.TokenScopes]: MeInfo.TokenScopes extends Info ? Scope[] : never;
				[MeInfo.UserScopes]: MeInfo.UserScopes extends Info ? Scope[] : never;
			},
			GetMeParams
		>('/me', params);
	}

	public async logout() {
		return this.post('/logout', undefined);
	}
}

export const authProfileApi = new AuthProfileApi();
