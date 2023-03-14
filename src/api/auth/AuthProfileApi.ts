import { Group, Scope } from '../models';
import { AuthBaseApi } from './AuthBaseApi';

interface GetMeResponse {
	id: number;
	email: string;
	scopes: Scope[];
	indirect_groups: Group[];
	groups: Group[];
}

interface GetMeParams {
	info: Array<'groups' | 'indirect_groups' | 'user_scopes'>;
}

class AuthProfileApi extends AuthBaseApi {
	constructor() {
		super();
	}

	public async getMe(token: string, params?: GetMeParams) {
		return this.get<GetMeResponse, GetMeParams>('/me', params, {
			Authorization: token,
		});
	}

	public async logout(token: string) {
		return this.post('/logout', undefined, {
			Authorization: token,
		});
	}
}

export const authProfileApi = new AuthProfileApi();
