import { BaseApi } from '../BaseApi';
import { User, SessionScope, UserScope, Session } from './../models/index';
import { AuthBaseApi } from './AuthBaseApi';

interface CreateBody {
	scopes: string[];
	expires: string;
}

export enum SessionInfo {
	Groups = 'groups',
	IndirectGroups = 'indirect_groups',
	SessionScopes = 'session_scopes',
	UserScopes = 'user_scopes',
	AuthMethods = 'auth_methods',
}

interface StatusResponse {
	status: string;
	message: string;
}

interface SessionResponse {
	token: string;
	expires: string;
	id: number;
	user_id: number;
	session_scopes: string[];
}

class UserSessionApi extends AuthBaseApi {
	constructor() {
		super('');
	}
	public async logout() {
		return this.post<StatusResponse>('/logout');
	}
	public async getSessionInfo<Info extends SessionInfo = never>(info?: Info[]) {
		return this.get<
			Array<
				Session & {
					groups: SessionInfo.Groups extends Info ? number[] : never;
					indirectGroup: SessionInfo.IndirectGroups extends Info ? number[] : never;
					sessionScopes: SessionInfo.SessionScopes extends Info ? SessionScope[] : never;
					userScopes: SessionInfo.UserScopes extends Info ? UserScope[] : never;
					authMethods: SessionInfo.AuthMethods extends Info ? string[] : never;
				}
			>,
			{ info?: Info[] }
		>('/me', { info });
	}
	public async getSession() {
		return this.get<SessionResponse>('/session');
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
