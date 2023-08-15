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
	[UserdataCategoryName.PersonalInfo]: [
		UserdataParamName.Surname,
		UserdataParamName.Name,
		UserdataParamName.Patronymic,
	] as const,
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
		const name = [UserdataParamName.Name, UserdataParamName.Surname, UserdataParamName.Patronymic];
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
		const name = info?.get(UserdataParamName.Name) ?? '';
		const surname = info?.get(UserdataParamName.Surname) ?? '';
		const patronymic = info?.get(UserdataParamName.Patronymic) ?? '';

		if (!name && !surname && !patronymic) {
			return '[object Object]';
		}
		UserdataConverter.hasFullName = true;
		return `${surname} ${name} ${patronymic}`.trim();
	}
}
