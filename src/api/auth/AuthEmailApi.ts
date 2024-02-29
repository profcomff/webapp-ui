import { DefaultResponse } from '../BaseApi';
import { AuthBaseApi } from './AuthBaseApi';
import { UNKNOWN_DEVICE } from './AuthOauth2BaseApi';

interface RegisterBody {
	email: string;
	password: string;
}

interface LoginBody {
	email: string;
	password: string;
	scopes?: string[];
	session_name?: string;
}

interface RequestResetEmailBody {
	email: string;
}

interface ApproveEmailParams {
	token: string;
}

interface RequestResetPasswordBody {
	password: string;
	new_password: string;
}

interface RequestResetForgottenPasswordBody {
	email: string;
}

interface ResetPasswordParams {
	new_password: string;
}

interface LoginResponse {
	token: string;
	expires: string;
	id: number;
	user_id: number;
	session_scopes: string[];
}

class AuthEmailApi extends AuthBaseApi {
	constructor() {
		super('/email');
	}

	public async register(body: RegisterBody) {
		return this.post<DefaultResponse, RegisterBody>('/registration', body);
	}

	public async login(body: LoginBody) {
		if (!body.session_name) {
			body.session_name = navigator.userAgent ?? UNKNOWN_DEVICE;
		}

		return this.post<LoginResponse, LoginBody>('/login', body);
	}

	public async approveEmail(params: ApproveEmailParams) {
		return this.get<DefaultResponse, ApproveEmailParams>('/approve', params);
	}

	public async requestResetEmail(body: RequestResetEmailBody) {
		return this.post<DefaultResponse, RequestResetEmailBody>('/reset/email/request', body);
	}

	public async resetEmail(params: ApproveEmailParams) {
		return this.get<DefaultResponse, ApproveEmailParams>('/reset/email', params);
	}

	public async requestResetPassword(body: RequestResetPasswordBody) {
		return this.post<DefaultResponse, RequestResetPasswordBody>('/reset/password/request', body);
	}

	public async requestResetForgottenPassword(body: RequestResetForgottenPasswordBody) {
		return this.post<DefaultResponse, RequestResetForgottenPasswordBody>(
			'/reset/password/restore',
			body
		);
	}

	public async resetPassword(body: ResetPasswordParams, token: string) {
		return this.post<DefaultResponse, ResetPasswordParams>('/reset/password', body, {
			'reset-token': token
		});
	}
}

export const authEmailApi = new AuthEmailApi();
