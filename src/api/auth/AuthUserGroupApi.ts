import { AuthBaseApi } from './AuthBaseApi';

interface GetUsersResponse {
	items: Array<{
		id: number;
		email: string;
	}>;
}

class AuthUserGroupApi extends AuthBaseApi {
	constructor() {
		super('/group');
	}

	public async getUsers(groupId: number, token: string) {
		return this.get<GetUsersResponse>(`/${groupId}/user`, undefined, {
			Authorization: token,
		});
	}

	public async addUser(groupId: number, user_id: number, token: string) {
		return this.post<{ group_id: number; user_id: number }, { user_id: number }>(
			`/${groupId}/user`,
			{ user_id },
			{
				Authorization: token,
			},
		);
	}

	public async deleteUser(groupId: number, userId: number) {
		return this.delete<string>(`/${groupId}/user/${userId}`);
	}
}

export const authUserGroupApi = new AuthUserGroupApi();
