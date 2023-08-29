import { UserdataRaw } from '@/api/models';
import {
	UserdataArray,
	UserdataArrayItem,
	UserdataCategoryName,
	UserdataConfig,
	UserdataParamName,
	UserdataTree,
	UserdataTreeSheet,
} from '@/models';

const categoryOrder = [UserdataCategoryName.PersonalInfo, UserdataCategoryName.Study, UserdataCategoryName.Contacts];
const userdataConfig: Partial<UserdataConfig> = {
	[UserdataCategoryName.PersonalInfo]: [UserdataParamName.FullName] as const,
};

export class UserdataConverter {
	public static hasFullName: boolean = false;

	public static flatToTree(flat: UserdataRaw): UserdataTree {
		return flat.items.reduce((acc, item) => {
			if (!acc.has(item.category)) {
				acc.set(item.category, new Map());
			}

			acc.get(item.category)!.set(item.param, item.value);

			return acc;
		}, new Map() as UserdataTree);
	}

	public static sheetToItem(category: string, sheet: UserdataTreeSheet): UserdataArrayItem {
		const res: UserdataArrayItem = { name: category, data: [] };

		for (const [param, value] of sheet) {
			res.data.push({ param, value });
		}

		const paramOrder = userdataConfig[category as UserdataCategoryName];
		if (paramOrder) {
			res.data.sort(
				(a, b) =>
					paramOrder.indexOf(a.param as UserdataParamName) - paramOrder.indexOf(b.param as UserdataParamName),
			);
		}

		return res;
	}

	public static treeToArray(tree: UserdataTree): UserdataArray {
		const res: UserdataArray = [];
		const name = UserdataParamName.FullName;
		for (const [category, sheet] of tree.entries()) {
			for (const param of sheet.keys()) {
				if (UserdataConverter.hasFullName && name.includes(param as UserdataParamName)) {
					sheet.delete(param);
				}
			}
			if (sheet.size === 0) {
				continue;
			}
			res.push(UserdataConverter.sheetToItem(category, sheet));
		}

		res.sort(
			(a, b) =>
				categoryOrder.indexOf(a.name as UserdataCategoryName) -
				categoryOrder.indexOf(b.name as UserdataCategoryName),
		);

		return res;
	}

	public static flatToArray(flat: UserdataRaw) {
		return UserdataConverter.treeToArray(UserdataConverter.flatToTree(flat));
	}

	public static getFullName(flat: UserdataRaw) {
		const tree = UserdataConverter.flatToTree(flat);
		const info = tree.get(UserdataCategoryName.PersonalInfo);
		const full_name = info?.get(UserdataParamName.FullName) ?? '';

		if (!full_name) {
			return '[object Object]';
		}
	}

	public static categoryToFlat(categories: UserdataCategory[]) {
		const result: UserdataRaw = { items: [] };
		categories.forEach(category => {
			category.params?.forEach(param => {
				result.items.push({ category: category.name, param: param, value: '' } as UserdataRawItem);
			});
		});
		return result;
	}

	public static uniteWithUserCategories(categories: UserdataRaw, userCategories: UserdataRaw): UserdataArray {
		const result_userdata: UserdataArray = [];
		const categoriesTree = UserdataConverter.flatToTree(categories);
		const userCategoriesTree = UserdataConverter.flatToTree(userCategories);
		categoriesTree.forEach((item, category) => {
			const category_info: UserdataArrayDataItem[] = [];
			item.forEach((value, param) => {
				if (userCategoriesTree.get(category) && userCategoriesTree.get(category)?.get(param)) {
					const userValue = userCategoriesTree.get(category)?.get(param);
					if (userValue) {
						category_info.push({ param: param, value: userValue });
					}
				} else {
					category_info.push({ param: param, value: value });
				}
			});
			result_userdata.push({ name: category, data: category_info });
		});
		return result_userdata;
	}
}
