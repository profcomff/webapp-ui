import { BaseApi } from '../BaseApi';
import { Button, Category } from '../models';

type GetButtonsResponse = Category & {
	buttons: Button[];
};

export enum CategoryInfo {
	Buttons = 'buttons',
}

class ServicesApi extends BaseApi {
	constructor() {
		super('/services');
	}

	public async getCategories<Info extends CategoryInfo = never>(info?: Info[]) {
		return this.get<
			Array<
				Category & {
					buttons: CategoryInfo.Buttons extends Info ? Button[] : never;
				}
			>,
			{ info?: Info[] }
		>('/category', { info });
	}

	public getButtons(categoryId: number) {
		return this.get<GetButtonsResponse>(`/category/${categoryId}/button/`);
	}
}

export const servicesApi = new ServicesApi();
