import type { UserdataItem, ZachetCardData } from './types';

const FALLBACK = '—';

function normalizeValue(value?: string | null): string | null {
	if (typeof value !== 'string') return null;

	const trimmed = value.trim();

	return trimmed.length ? trimmed : null;
}

function getValue(items: UserdataItem[], category: string, param: string): string | null {
	const item = items.find(entry => entry.category === category && entry.param === param);

	return normalizeValue(item?.value);
}

function resolveUnionCardNumber(items: UserdataItem[]): string {
	return (
		getValue(items, 'Учёба', 'Номер профсоюзного билета') ??
		getValue(items, 'Учетные данные', 'Номер профсоюзного билета') ??
		FALLBACK
	);
}

function resolvePhotoUrl(items: UserdataItem[]): string | undefined {
	const value = getValue(items, 'Личная информация', 'Фото');

	if (!value) return undefined;

	return value;
}

export function mapUserdataToZachetCard(items: UserdataItem[]): ZachetCardData {
	logZachetCardMapper('start mapping items', { items });

	const mappedCard: ZachetCardData = {
		unionCardNumber: resolveUnionCardNumber(items),
		fullNameRu: getValue(items, 'Личная информация', 'Полное имя') ?? FALLBACK,
		fullNameEn: FALLBACK,
		birthDate: getValue(items, 'Личная информация', 'Дата рождения') ?? FALLBACK,
		facultyRu: getValue(items, 'Учёба', 'Факультет') ?? FALLBACK,
		facultyEn: FALLBACK,
		statusRu: getValue(items, 'Учёба', 'Ступень обучения') ?? FALLBACK,
		statusEn: FALLBACK,
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
