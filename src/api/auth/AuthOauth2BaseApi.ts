import { AuthBaseApi } from './AuthBaseApi';

export const oauth2Methods: { [url: string]: AuthOauth2BaseApi } = {};

interface AuthResponse {
	token: string;
	expires: string;
	id: number;
	user_id: number;
}

interface RegisterBody {
	id_token: string;
	scopes?: string[];
}

export class AuthOauth2BaseApi<LoginBody = unknown> extends AuthBaseApi {
	private _redirect_path: string | null = null;

	constructor(path = '') {
		super(path);
		this._redirect_path = `/auth/oauth-authorized${path}`;
		oauth2Methods[this._redirect_path] = this;
	}

	public async getAuthUrl() {
		const { data } = await this.get<{ url: string }>('/auth_url');
		return data.url;
	}

	public async openAuthUrl() {
		const url = await this.getAuthUrl();
		window.open(url, '_blank');
	}

	public async login(body: LoginBody) {
		return this.post<AuthResponse, LoginBody>('/login', body);
	}

	public async register(body: RegisterBody) {
		return this.post<AuthResponse, RegisterBody>('/registration', body);
	}
}
