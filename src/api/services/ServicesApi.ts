import { BaseApi } from '../BaseApi';
import { Button, Category } from '../models';

type GetButtonsResponse = Category & {
	buttons: Button[];
};

class ServicesApi extends BaseApi {
	constructor() {
		super(import.meta.env.VITE_APP_API_SERVICES);
	}

	public async getCategories(params?: { offset?: number; limit?: number }) {
		return this.get<Category[], { offset?: number; limit?: number }>('/', params);
	}

	public getButtons(categoryId: number) {
		return this.get<GetButtonsResponse>(`/${categoryId}/button`);
	}
}

export const servicesApi = new ServicesApi();
