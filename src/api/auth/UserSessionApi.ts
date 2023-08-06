import { Session, SessionScope, UserScope } from './../models/index';
import { AuthBaseApi } from './AuthBaseApi';
import { DefaultResponse } from '../BaseApi';

interface CreateBody {
	scopes: string[];
	expires: string;
}

export enum MySessionInfo {
	Groups = 'groups',
	IndirectGroups = 'indirect_groups',
	SessionScopes = 'session_scopes',
	UserScopes = 'user_scopes',
	AuthMethods = 'auth_methods',
}

export enum AuthMethod {
	Email = 'email',
	Yandex = 'yandex_auth',
	Github = 'github_auth',
	Google = 'google_auth',
	LkMsu = 'lkmsu_auth',
	MyMsu = 'my_msu_auth',
	Physics = 'physics_auth',
	Telegram = 'telegram_auth',
	VK = 'vk_auth',
}

interface SessionResponse {
	id: number;
	user_id: number;
	session_name: string;
	last_activity: string;
}

export enum SessionInfo {
	SessionScopes = 'session_scopes',
	Token = 'token',
	Expires = 'expires',
}

class UserSessionApi extends AuthBaseApi {
	constructor() {
		super('');
	}
	public async logout() {
		return this.post<DefaultResponse>('/logout');
	}
	public async getMe<Info extends MySessionInfo = never>(info?: Info[]) {
		return this.get<
			Session & {
				[MySessionInfo.Groups]: MySessionInfo.Groups extends Info ? number[] : never;
				[MySessionInfo.IndirectGroups]: MySessionInfo.IndirectGroups extends Info ? number[] : never;
				[MySessionInfo.SessionScopes]: MySessionInfo.SessionScopes extends Info ? SessionScope[] : never;
				[MySessionInfo.UserScopes]: MySessionInfo.UserScopes extends Info ? UserScope[] : never;
				[MySessionInfo.AuthMethods]: MySessionInfo.AuthMethods extends Info ? AuthMethod[] : never;
			},
			{ info?: Info[] }
		>('/me', { info });
	}
	public async getSessions<Info extends SessionInfo = never>(info?: Info[]) {
		return this.get<
			Array<
				SessionResponse & {
					[SessionInfo.Expires]: SessionInfo.Expires extends Info ? string : never;
					[SessionInfo.SessionScopes]: SessionInfo.SessionScopes extends Info ? string[] : never;
					[SessionInfo.Token]: SessionInfo.Token extends Info ? string : never;
				}
			>,
			{ info?: Info[] }
		>('/session', { info });
	}
	public async createSession(body: CreateBody) {
		return this.post<SessionResponse, CreateBody>('/session', body);
	}
	public async deleteSessions(delete_current?: boolean) {
		return this.delete<string, { delete_current?: boolean }>('/session', { delete_current });
	}
	public async deleteSession(token: string) {
		return this.delete<string>(`/session/${token}`);
	}
}

export const userSessionApi = new UserSessionApi();
