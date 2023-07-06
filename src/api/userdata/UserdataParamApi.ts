import { BaseApi, DefaultResponse } from '../BaseApi';
import { UserdataParam } from '../models';

interface Args {
	id: number;
	categoryId: number;
}

class UserdataParamApi extends BaseApi {
	constructor() {
		super('/userdata/category');
	}

	public async getAll(categoryId: number) {
		return this.get<UserdataParam[]>(`/${categoryId}/param`);
	}

	public async create(categoryId: number, body: Omit<UserdataParam, 'id' | 'category_id'>) {
		return this.post<UserdataParam, Omit<UserdataParam, 'id' | 'category_id'>>(`/${categoryId}/param`, body);
	}

	public async getById({ id, categoryId }: Args) {
		return this.get<UserdataParam>(`/${categoryId}/param/${id}`);
	}

	public async deleteById({ id, categoryId }: Args) {
		return this.get<DefaultResponse>(`/${categoryId}/param/${id}`);
	}

	public async patchById({ id, categoryId }: Args, body: Omit<UserdataParam, 'id' | 'category_id'>) {
		return this.patch<UserdataParamApi, Omit<UserdataParam, 'id' | 'category_id'>>(
			`/${categoryId}/param/${id}`,
			body,
		);
	}
}

export const userdataParamApi = new UserdataParamApi();
