import {
	Userdata,
	UserdataExtendedValue,
	UserdataItem,
	UserdataUpdateUser,
	UserdataUpdateUserItem,
	UserdataCategory,
	UserdataParamResponseType,
	UserdataRaw,
	UserdataArray,
	UserdataArrayItem,
	UserdataCategoryName,
	UserdataConfig,
	UserdataTree,
	UserdataTreeSheet,
	UserdataArrayCategoryItem,
	UserdataArrayDataItem,
	UserdataParams,
} from '@/models';

const categoryOrder = [
	UserdataCategoryName.PersonalInfo,
	UserdataCategoryName.Study,
	UserdataCategoryName.Contacts,
	UserdataCategoryName.Career,
];
const userdataConfig: Partial<UserdataConfig> = {
	[UserdataCategoryName.PersonalInfo]: [UserdataParams.Photo, UserdataParams.FullName] as const,
};

export class UserdataConverter {
	public static alreadyGetParams: UserdataItem[] = [];

	public static flatToTree(flat: UserdataRaw): UserdataTree {
		return flat.items.reduce((acc, item) => {
			if (!acc.has(item.category)) {
				acc.set(item.category, new Map());
			}
			let extendedValue: UserdataExtendedValue | undefined = undefined;
			if (typeof item.value === 'string') {
				extendedValue = {
					name: item.value,
					is_required: false,
					changeable: true,
					type: UserdataParamResponseType.All,
				};
			} else if (item.value !== null) {
				extendedValue = item.value;
			}
			if (extendedValue) {
				acc.get(item.category)!.set(item.param, extendedValue);
			}
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
					paramOrder.indexOf(a.param as UserdataParams.FullName) -
					paramOrder.indexOf(b.param as UserdataParams.FullName)
			);
		}

		return res;
	}

	public static treeToArray(tree: UserdataTree): UserdataArray {
		const res: UserdataArray = [];
		for (const [category, sheet] of tree.entries()) {
			for (const param of sheet.keys()) {
				if (
					UserdataConverter.alreadyGetParams.find(
						item => item.category === category && item.param === param
					)
				) {
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
				categoryOrder.indexOf(b.name as UserdataCategoryName)
		);

		return res;
	}

	public static flatToArray(flat: UserdataRaw) {
		return UserdataConverter.treeToArray(UserdataConverter.flatToTree(flat));
	}

	public static categoryToFlat(categories: UserdataCategory[]) {
		const result: Userdata = { items: [] };
		categories.forEach(category => {
			category.params?.forEach(param => {
				result.items.push({
					category: category.name,
					param: param.name,
					value: {
						name: '',
						is_required: param.is_required,
						changeable: param.changeable,
						type: param.type,
					},
				});
			});
		});
		return result;
	}

	public static arrayToFlat(userdata: UserdataArray): Userdata {
		const result: Userdata = { items: [] };
		for (const item of userdata) {
			for (const info of item.data) {
				const rawInfo: UserdataItem = {
					category: item.name,
					param: info.param,
					value: info.value,
				};
				result.items.push(rawInfo);
			}
		}
		return result;
	}

	public static uniteWithUserCategories(
		categories: UserdataRaw,
		userCategories: UserdataRaw
	): UserdataArray {
		const result_userdata: UserdataArray = [];
		const categoriesTree = UserdataConverter.flatToTree(categories);
		const userCategoriesTree = UserdataConverter.flatToTree(userCategories);
		for (const [category, item] of categoriesTree) {
			const category_info: UserdataArrayDataItem[] = [];
			for (const [param, value] of item) {
				if (
					UserdataConverter.alreadyGetParams.find(
						item => item.category === category && item.param === param
					)
				) {
					continue;
				}

				if (userCategoriesTree.get(category) && userCategoriesTree.get(category)?.get(param)) {
					const userValue = userCategoriesTree.get(category)?.get(param);
					category_info.push({
						param: param,
						value: {
							name: userValue!.name,
							is_required: value.is_required,
							changeable: value.changeable || userValue!.name.trim() === '',
							type: value.type,
						},
					});
				} else {
					category_info.push({ param: param, value: value });
				}
			}
			result_userdata.push({ name: category, data: category_info });
		}
		result_userdata.sort(
			(a, b) =>
				categoryOrder.indexOf(a.name as UserdataCategoryName) -
				categoryOrder.indexOf(b.name as UserdataCategoryName)
		);
		return result_userdata;
	}

	public static arrayToUpdate(
		userdata: UserdataArray,
		source: string,
		alreadyGetParamValue: UserdataUpdateUserItem[]
	): UserdataUpdateUser {
		const updateUserdata: UserdataUpdateUser = { items: [], source: '' };
		updateUserdata.source = source;
		for (const category of userdata) {
			for (const item of category.data) {
				const updateItem = {} as UserdataUpdateUserItem;
				if (item.value.name.trim() === '') {
					updateItem.category = category.name;
					updateItem.param = item.param;
					updateItem.value = null;
				} else {
					updateItem.category = category.name;
					updateItem.param = item.param;
					updateItem.value = item.value.name;
				}

				updateUserdata.items.push(updateItem);
			}
		}
		for (const item of alreadyGetParamValue) {
			const update_already_get_item = UserdataConverter.alreadyGetParams.find(
				element => element.category === item.category && element.param === item.param
			);
			if (update_already_get_item) {
				const updateItem = {
					category: item.category,
					param: item.param,
					value: item.value,
				} as UserdataUpdateUserItem;
				updateUserdata.items.push(updateItem);
			}
		}
		return updateUserdata;
	}

	public static getItem(
		flat: UserdataRaw,
		info: UserdataArrayCategoryItem
	): UserdataExtendedValue | null {
		const tree = UserdataConverter.flatToTree(flat);
		const info_tree = tree.get(info.category);
		const itemValue = info_tree?.get(info.param) ?? '';
		if (!itemValue) {
			return null;
		}
		UserdataConverter.alreadyGetParams.push({
			category: info.category,
			param: info.param,
			value: itemValue,
		});
		return itemValue;
	}
}
