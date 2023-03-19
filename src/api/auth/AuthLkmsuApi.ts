import { AuthOauth2BaseApi } from './AuthOauth2BaseApi';

interface LoginBody {
	code: string;
	scopes?: string[];
}

class AuthLkmsuApi extends AuthOauth2BaseApi<LoginBody> {
	constructor() {
		super('/lk-msu');
	}
}

export const authLkmsuApi = new AuthLkmsuApi();
