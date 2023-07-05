import { AuthBody, AuthOauth2BaseApi } from './AuthOauth2BaseApi';

interface LoginBody extends AuthBody {
	code: string;
	scopes?: string[];
}

class GoogleApi extends AuthOauth2BaseApi<LoginBody> {
	constructor(path?: string) {
		super(path);
	}
}

export const authGoogleApi = new GoogleApi('/google');
export const authPhysicsApi = new GoogleApi('/physics-msu');
