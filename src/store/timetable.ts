import { StudyGroup } from './../api/models/index';
import { Lecturer, Room, Event } from '@/api/models';
import { LocalStorage, LocalStorageItem } from '@/models/LocalStorage';
import { stringifyDate } from '@/utils/date';
import { defineStore } from 'pinia';
import { ref } from 'vue';

interface StoreLecturer extends Lecturer {
	schedule: Map<number, Event> | null;
}

interface StoreRoom extends Room {
	schedule: Map<number, Event> | null;
}

export const useTimetableStore = defineStore('timetable', () => {
	const events = ref<Map<number, Event>>(new Map());
	const days = ref<Map<string, Event[]>>(new Map());
	const lecturers = ref<Map<number, StoreLecturer>>(new Map());
	const rooms = ref<Map<number, StoreRoom>>(new Map());
	const group = ref<StudyGroup | null>(null);

	function updateGroup(newGroup?: StudyGroup) {
		group.value = newGroup ?? LocalStorage.getObject<StudyGroup>(LocalStorageItem.StudyGroup);
	}

	function setLecturers(lecturerList: Lecturer[]) {
		for (const l of lecturerList) {
			if (!lecturers.value.has(l.id)) {
				(l as StoreLecturer).schedule = null;
				lecturers.value.set(l.id, l as StoreLecturer);
			} else if (l.avatar_link) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				lecturers.value.get(l.id)!.avatar_link = l.avatar_link;
			}
		}
	}

	function setRooms(roomList: Room[]) {
		for (const r of roomList) {
			if (!rooms.value.has(r.id)) {
				(r as StoreRoom).schedule = null;
				rooms.value.set(r.id, r as StoreRoom);
			}
		}
	}

	function setEvents(eventList: Event[]) {
		for (const e of eventList) {
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

	function setLecturerEvents(lecturerId: number, eventList: Event[]) {
		setEvents(eventList);
		const lecturer = lecturers.value.get(lecturerId);

		if (!lecturer) return;

		if (lecturer.schedule) {
			for (const e of eventList) {
				lecturer.schedule.set(e.id, e);
			}
		} else {
			lecturer.schedule = new Map(eventList.map(e => [e.id, e]));
		}
	}

	function setRoomEvents(roomId: number, eventList: Event[]) {
		setEvents(eventList);
		const room = rooms.value.get(roomId);

		if (!room) return;

		if (room.schedule) {
			for (const e of eventList) {
				room.schedule.set(e.id, e);
			}
		} else {
			room.schedule = new Map(eventList.map(e => [e.id, e]));
		}
	}

	return {
		events,
		days,
		lecturers,
		rooms,
		group,
		updateGroup,
		setLecturers,
		setRooms,
		setEvents,
		setDay,
		setLecturerEvents,
		setRoomEvents
	};
});
