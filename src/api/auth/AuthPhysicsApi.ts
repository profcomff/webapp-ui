import { AuthBaseApi } from './AuthBaseApi';

interface LoginBody {
	code: string;
	state: string;
	scopes?: string[];
}

interface RegisterBody {
	id_token: string;
	scopes?: string[];
}

interface AuthResponse {
	token: string;
	expires: string;
	id: number;
	user_id: number;
}

class AuthPhysicsApi extends AuthBaseApi {
	constructor() {
		super('/physics-msu');
	}

	public async getAuthUrl(redirect_uri?: string) {
		const { data } = await this.get<{ url: string }>('/auth_url');

		const url = new URL(data.url);
		if (redirect_uri) {
			url.searchParams.set('redirect_uri', redirect_uri);
		}

		return url.toString();
	}

	public async login(body: LoginBody) {
		return this.post<AuthResponse, LoginBody>('/login', body);
	}

	public async register(body: RegisterBody) {
		return this.post<AuthResponse, RegisterBody>('/registration', body);
	}
}

export const authPhysicsApi = new AuthPhysicsApi();
