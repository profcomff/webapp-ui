export enum LocalStorageItem {
	StudyGroup = 'timetable-group',
	LastTwoWeeksPreloadDate = 'last-two-week-preload-date',
	Token = 'token',
	TokenScopes = 'token-scopes',
}

export class LocalStorage {
	static set<T>(name: LocalStorageItem, body: T) {
		if (typeof body === 'object') {
			localStorage.setItem(name, JSON.stringify(body));
		} else {
			localStorage.setItem(name, `${body}`);
		}
	}

	static getObject<T>(name: LocalStorageItem): T | null {
		const body = localStorage.getItem(name);
		return body ? JSON.parse(body) : null;
	}

	static get(name: LocalStorageItem): string | null {
		return localStorage.getItem(name);
	}

	static delete(name: LocalStorageItem) {
		localStorage.removeItem(name);
	}
}
