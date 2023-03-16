import { stringifyDate } from '@/utils';
import { LocalStorage, LocalStorageItem } from '@/models';
import { StudyGroup } from './../api/models/index';
import { Lecturer, Room, Event } from '@/api/models';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTimetableStore = defineStore('timetable', () => {
	const events = ref<Map<number, Event>>(new Map());
	const days = ref<Map<string, Event[]>>(new Map());
	const lecturers = ref<Map<number, Lecturer>>(new Map());
	const rooms = ref<Map<number, Room>>(new Map());
	const group = ref<StudyGroup | null>(null);

	function updateGroup(newGroup?: StudyGroup) {
		group.value = newGroup ?? LocalStorage.getObject<StudyGroup>(LocalStorageItem.StudyGroup);
	}

	function setLecturers(lecturerList: Lecturer[]) {
		for (const l of lecturerList) {
			lecturers.value.set(l.id, l);
		}
	}

	function setRooms(roomList: Room[]) {
		for (const r of roomList) {
			rooms.value.set(r.id, r);
		}
	}

	function setEvents(eventList: Event[]) {
		for (const e of eventList) {
			setRooms(e.room);
			setLecturers(e.lecturer);
			events.value.set(e.id, e);
		}
	}

	function setDay(date: Date, eventList: Event[]) {
		const key = stringifyDate(date);

		if (!days.value.has(key)) {
			days.value.set(key, []);
		}

		for (const e of eventList) {
			setEvents(eventList);
			days.value.get(key)?.push(e);
		}
	}

	return { events, days, lecturers, rooms, group, updateGroup, setLecturers, setRooms, setEvents, setDay };
});
