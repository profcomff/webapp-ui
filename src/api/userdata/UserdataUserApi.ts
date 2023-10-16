import { UserdataRaw, UserdataUpdateUser } from '../models';
import { UserdataBaseApi } from './UserdataBaseApi';

type Json = Record<string, Record<string, string>>;

class UserdataUserApi extends UserdataBaseApi {
	constructor() {
		super('/user');
	}

	public async getById(id: number) {
		return this.get<UserdataRaw>(`/${id}`);
	}

	public async patchById(id: number, body: UserdataUpdateUser) {
		return this.post<Json, UserdataUpdateUser>(`/${id}`, body);
	}
}

export const userdataUserApi = new UserdataUserApi();
