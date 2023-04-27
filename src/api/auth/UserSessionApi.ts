import { BaseApi } from '../BaseApi';
import { User } from './../models/index';
import { AuthBaseApi } from './AuthBaseApi';

interface LogoutResponse {
	status: string;
	message: string;
}

enum SessionInfo {
	Groups = 'groups',
	IndirectGroups = 'indirect-groups',
	SessionScopes = 'session-scopes',
	UserScopes = 'user-scopes',
	AuthMethods = 'auth-methods',
}

class UserSessionApi extends AuthBaseApi {
	constructor() {
		super('');
	}
	public async logout() {
		return this.post<LogoutResponse>('/logout');
	}
	// 	public async getSessionInfo<Info extends SessionInfo = never>(info?: Info[]) {
	// 		return this.get
	// 	}
	// }
}
