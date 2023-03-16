import { BaseApi } from '../BaseApi';

interface WriteActionBody {
	user_id: number;
	action: string;
	additional_data?: string;
	path_from?: string;
	path_to?: string;
}

interface MarketingUser {
	id: number;
	union_number: string;
}

class MarketingApi extends BaseApi {
	constructor() {
		super('/marketing/v1');
	}

	public async writeAction(body: WriteActionBody) {
		return this.post<string, WriteActionBody>('/action', body);
	}

	public async createUser() {
		return this.post<MarketingUser>('/user');
	}
}

export const marketingApi = new MarketingApi();
