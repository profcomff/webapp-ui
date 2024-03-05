import { BaseApi } from './BaseApi';
import { ArrayResponse, Entity } from './models';

export interface GetAllParams {
	limit?: number;
	offset?: number;
}

export class EntityBaseApi<
	E extends Entity,
	GetAllP extends GetAllParams = never,
	ModifyB = Omit<E, 'id'>,
	GetP = never
> extends BaseApi {
	constructor(path: string) {
		super(path);
	}

	public async getById(id: number, params?: GetP) {
		return this.get<E, GetP>(`/${id}`, params);
	}

	public async getAll(params?: GetAllP) {
		return this.get<ArrayResponse<E>, GetAllP>('/', params);
	}

	public async deleteById(id: number) {
		return this.delete<string>(`/${id}`);
	}

	public async patchById(id: number, body: ModifyB) {
		return this.patch<E, ModifyB>(`/${id}`, body);
	}

	public async create(body: ModifyB) {
		return this.post<E, ModifyB>('', body);
	}
}
