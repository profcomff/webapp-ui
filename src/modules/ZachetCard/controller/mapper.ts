import type { UserdataItem, ZachetCardData } from './types';

const FALLBACK = '—';

function normalizeValue(value?: string | null): string | null {
	if (typeof value !== 'string') return null;

	const trimmed = value.trim();

	return trimmed.length ? trimmed : null;
}

function getValues(items: UserdataItem[], category: string, param: string): string[] {
	return items
		.filter(entry => entry.category === category && entry.param === param)
		.map(entry => normalizeValue(entry.value))
		.filter((value): value is string => Boolean(value));
}

function getFirstValue(items: UserdataItem[], category: string, param: string): string | null {
	return getValues(items, category, param)[0] ?? null;
}

function formatDate(value: string | null): string {
	if (!value) return FALLBACK;

	if (/^\d{2}\.\d{2}\.\d{4}$/.test(value)) {
		return value;
	}

	if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		const [year, month, day] = value.split('-');
		return `${day}.${month}.${year}`;
	}

	return value;
}

function resolveUnionCardNumber(items: UserdataItem[]): string {
	return (
		getFirstValue(items, 'Учёба', 'Номер профсоюзного билета') ??
		getFirstValue(items, 'Учетные данные', 'Номер профсоюзного билета') ??
		FALLBACK
	);
}

function resolvePhotoUrl(items: UserdataItem[]): string | undefined {
	const value = getFirstValue(items, 'Личная информация', 'Фото');

	if (!value) return undefined;

	return value;
}

function resolveFacultyRu(items: UserdataItem[]): string {
	const facultyValues = getValues(items, 'Учёба', 'Факультет');

	for (const value of facultyValues) {
		if (!value.includes('/')) {
			return value;
		}
	}

	const combinedValue = facultyValues[0];

	if (combinedValue?.includes('/')) {
		return combinedValue.split('/')[0]?.trim() || FALLBACK;
	}

	return combinedValue ?? FALLBACK;
}

function resolveFacultyEn(items: UserdataItem[]): string {
	const directFacultyEn = getFirstValue(items, 'Учёба', 'Faculty');

	if (directFacultyEn) {
		return directFacultyEn;
	}

	const facultyValues = getValues(items, 'Учёба', 'Факультет');
	const combinedValue = facultyValues.find(value => value.includes('/'));

	if (combinedValue) {
		return combinedValue.split('/')[1]?.trim() || FALLBACK;
	}

	return FALLBACK;
}

export function mapUserdataToZachetCard(items: UserdataItem[]): ZachetCardData {
	logZachetCardMapper('start mapping items', { items });

	const mappedCard: ZachetCardData = {
		unionCardNumber: resolveUnionCardNumber(items),
		fullNameRu: getFirstValue(items, 'Личная информация', 'Полное имя') ?? FALLBACK,
		fullNameEn: getFirstValue(items, 'Личная информация', 'Full name') ?? FALLBACK,
		birthDate: formatDate(getFirstValue(items, 'Личная информация', 'Дата рождения')),
		facultyRu: resolveFacultyRu(items),
		facultyEn: resolveFacultyEn(items),
		statusRu: getFirstValue(items, 'Учёба', 'Должность') ?? FALLBACK,
		statusEn: '-',
		photoUrl: resolvePhotoUrl(items),
	};

	logZachetCardMapper('mapped card result', mappedCard);

	return mappedCard;
}

function logZachetCardMapper(message: string, payload?: unknown) {
	if (!import.meta.env.DEV) {
		return;
	}

	if (payload === undefined) {
		console.log('[ZachetCard][mapper]', message);
		return;
	}

	console.log('[ZachetCard][mapper]', message, payload);
}
