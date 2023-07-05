import { AuthBody, AuthOauth2BaseApi } from './AuthOauth2BaseApi';

interface LoginBody extends AuthBody {
	id: number;
	first_name: string;
	last_name: string;
	username: string;
	photo_url: string;
	auth_date: string;
	hash: string;
	scopes?: string[];
}

class AuthTelegramApi extends AuthOauth2BaseApi<LoginBody> {
	constructor() {
		super('/telegram');
	}
}

export const authTelegramApi = new AuthTelegramApi();
