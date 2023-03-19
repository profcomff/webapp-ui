import { AuthOauth2BaseApi } from './AuthOauth2BaseApi';

interface LoginBody {
	code: string;
	scopes?: string[];
}

class AuthYandexApi extends AuthOauth2BaseApi<LoginBody> {
	constructor(path: string) {
		super(path);
	}
}

export const authYandexApi = new AuthYandexApi('/yandex');
export const authMymsuApi = new AuthYandexApi('/my-msu');
