import { Scope } from '../models';
import { AuthBaseApi } from './AuthBaseApi';

interface ModifyScopeBody {
	name: string;
	comment?: string;
}

export const ScopeNameMap: Record<number, string> = {
	1: 'auth.scope.create',
	2: 'auth',
};

class AuthScopeApi extends AuthBaseApi {
	constructor() {
		super('/scope');
	}

	public async getScopes(token: string) {
		return this.get<Scope[]>('', undefined, {
			Authorization: token,
		});
	}

	public async createScope(body: ModifyScopeBody, token: string) {
		return this.post<Scope, ModifyScopeBody>('', body, {
			Authorization: token,
		});
	}

	public async getScope(id: number) {
		return this.get<Scope>(`/${id}`);
	}

	public async deleteScope(id: number, token: string) {
		return this.delete<{ status: string; message: string }>(`/${id}`, undefined, {
			Authorization: token,
		});
	}

	public async patchScope({ id, comment, name }: Scope) {
		return this.patch<Scope, ModifyScopeBody>(`/${id}`, { comment, name });
	}
}

export const authScopeApi = new AuthScopeApi();
