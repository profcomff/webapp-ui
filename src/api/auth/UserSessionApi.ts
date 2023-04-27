import { BaseApi } from '../BaseApi';
import { User, SessionScope, UserScope, Session, StatusResponse, SessionResponse } from './../models/index';
import { AuthBaseApi } from './AuthBaseApi';

interface CreateBody {
	scopes: string[];
	expires: string;
}

export enum SessionInfo {
	Groups = 'groups',
	IndirectGroups = 'indirect-groups',
	SessionScopes = 'session-scopes',
	UserScopes = 'user-scopes',
	AuthMethods = 'auth-methods',
}

export enum DeleteInfo {
	delete_current = 'delete-current',
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
		return this.post<SessionInfo, CreateBody>('/session', body);
	}
	public async deleteSessions<Info extends DeleteInfo = never>(info?: Info[]) {
		return this.delete<StatusResponse, { info?: Info[] }>('/session', { info });
	}
	public async deleteSession(token: string) {
		return this.delete<StatusResponse>(`/session/${token}`);
	}
}

export const userSessionApi = new UserSessionApi();
