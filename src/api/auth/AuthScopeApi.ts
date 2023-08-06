import { AuthBaseApi } from './AuthBaseApi';
import { DefaultResponse } from '../BaseApi';
import { Scope } from '../models';

interface ModifyScopeBody {
	name: string;
	comment?: string;
}

class AuthScopeApi extends AuthBaseApi {
	constructor() {
		super('/scope');
	}

	public async getScopes() {
		return this.get<Scope[]>('', undefined);
	}

	public async createScope(body: ModifyScopeBody) {
		return this.post<Scope, ModifyScopeBody>('', body);
	}

	public async getScope(id: number) {
		return this.get<Scope>(`/${id}`);
	}

	public async deleteScope(id: number) {
		return this.delete<DefaultResponse>(`/${id}`, undefined);
	}

	public async patchScope({ id, comment, name }: Scope) {
		return this.patch<Scope, ModifyScopeBody>(`/${id}`, { comment, name });
	}
}

export const authScopeApi = new AuthScopeApi();
