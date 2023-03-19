import { AuthOauth2BaseApi } from './AuthOauth2BaseApi';

interface LoginBody {
	code: string;
	scopes?: string[];
}

class AuthGithubApi extends AuthOauth2BaseApi<LoginBody> {
	constructor() {
		super('/github');
	}
}

export const authGithubApi = new AuthGithubApi();
