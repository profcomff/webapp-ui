import { BaseApi } from '../BaseApi';

type Json = Record<string, Record<string, string>>;

class UserdataUserApi extends BaseApi {
	constructor() {
		super('/user');
	}

	public async getById(id: number) {
		return this.get<Record<string, Record<string, string>>>(`/${id}`);
	}

	public async patchById(id: number, body: Json) {
		return this.post<Json, Json>(`/${id}`, body);
	}
}

export const userdataUserApi = new UserdataUserApi();
