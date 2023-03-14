import { StudyGroup } from '../api/models';

enum LocalStorageItem {
	StudyGroup = 'study-group',
	LastTwoWeeksPreloadDate = 'last-two-week-preload-date',
	Token = 'token',
}

export class LocalStorage {
	static setStudyGroup(group: StudyGroup) {
		localStorage.setItem(LocalStorageItem.StudyGroup, JSON.stringify(group));
	}

	static getStudyGroup(): StudyGroup | null {
		const group = localStorage.getItem(LocalStorageItem.StudyGroup);
		return group === null ? null : JSON.parse(group);
	}

	static deleteStudyGroup() {
		localStorage.removeItem(LocalStorageItem.StudyGroup);
	}

	static getToken(): string | null {
		return localStorage.getItem(LocalStorageItem.Token);
	}

	static setToken(token: string) {
		localStorage.setItem(LocalStorageItem.Token, token);
	}

	static deleteToken() {
		localStorage.removeItem(LocalStorageItem.Token);
	}
}
