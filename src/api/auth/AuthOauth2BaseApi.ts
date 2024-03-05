import { AuthBaseApi } from './AuthBaseApi';

export const oauth2Methods: Record<string, AuthOauth2BaseApi> = {};
export const UNKNOWN_DEVICE = 'unknown device';

interface AuthResponse {
	token: string;
	expires: string;
	id: number;
	user_id: number;
}

export interface AuthBody {
	session_name?: string;
}

interface RegisterBody extends AuthBody {
	id_token: string;
	scopes?: string[];
}

export class AuthOauth2BaseApi<LoginBody extends AuthBody = object> extends AuthBaseApi {
	constructor(path = '') {
		super(path);
		oauth2Methods[`/auth/oauth-authorized${path}`] = this;
	}

	public async getAuthUrl() {
		const { data } = await this.get<{ url: string }>('/auth_url');
		return data.url;
	}

	public async login(body: LoginBody) {
		if (!body.session_name) {
			body.session_name = navigator.userAgent ?? UNKNOWN_DEVICE;
		}
		return this.post<AuthResponse, LoginBody>('/login', body);
	}

	public async register(body: RegisterBody) {
		if (!body.session_name) {
			body.session_name = navigator.userAgent ?? UNKNOWN_DEVICE;
		}
		return this.post<AuthResponse, RegisterBody>('/registration', body);
	}

	public async unregister() {
		return this.delete<string>('');
	}

	public async linkNewAccount(body: LoginBody) {
		return this.post<AuthResponse, LoginBody>('/registration', body);
	}
}
