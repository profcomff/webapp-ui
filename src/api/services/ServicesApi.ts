import { AppButton, AppButtonCategory } from '../models';
import { BaseApi } from '../BaseApi';

type GetButtonsResponse = AppButtonCategory & {
	buttons: AppButton[];
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
				AppButtonCategory & {
					buttons: CategoryInfo.Buttons extends Info ? AppButton[] : never;
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
