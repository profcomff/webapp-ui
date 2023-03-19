import { AuthOauth2BaseApi } from './AuthOauth2BaseApi';

interface LoginBody {
	code: string;
	scopes?: string[];
}

class AuthVkApi extends AuthOauth2BaseApi<LoginBody> {
	constructor() {
		super('/vk');
	}
}

export const authVkApi = new AuthVkApi();
