import { stringifyDate } from './../utils/date';
import { StudyGroup } from '../api/models';

enum LocalStorageItem {
	Group = 'group',
	LastTwoWeeksPreloadDate = 'last-two-week-preload-date',
	Token = 'token',
}

export class LocalStorage {
	static setGroup(group: StudyGroup) {
		localStorage.setItem(LocalStorageItem.Group, JSON.stringify(group));
	}

	static getGroup(): StudyGroup | null {
		const group = localStorage.getItem(LocalStorageItem.Group);
		return group === null ? null : JSON.parse(group);
	}

	static removeGroup() {
		localStorage.removeItem(LocalStorageItem.Group);
	}

	static getLastTwoWeeksPreloadDate() {
		return localStorage.getItem(LocalStorageItem.LastTwoWeeksPreloadDate);
	}

	static setLastTwoWeeksPreloadDate(date: Date) {
		localStorage.setItem(LocalStorageItem.LastTwoWeeksPreloadDate, stringifyDate(date));
	}

	static getToken(): string | null {
		return localStorage.getItem(LocalStorageItem.Token);
	}

	static setToken(token: string) {
		localStorage.setItem(LocalStorageItem.Token, token);
	}

	static removeToken() {
		localStorage.removeItem(LocalStorageItem.Token);
	}
}
