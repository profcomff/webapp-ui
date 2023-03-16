import { stringifyDateIso, getDateWithDayOffset } from './../../utils/date';
import { timetableEventApi, GetEventsParams } from './../timetable/TimetableEventApi';
import { timetableRoomApi } from './../timetable/TimetableRoomApi';
import { useTimetableStore } from './../../store/timetable';
import { timetableLecturerApi } from './../timetable/TimetableLecturerApi';

export class TimetableApi {
	public static async getLecturer(id: number) {
		const { setLecturers } = useTimetableStore();
		const { data } = await timetableLecturerApi.getLecturer(id);
		setLecturers([data]);
	}

	public static async getLecturers() {
		const { setLecturers } = useTimetableStore();
		const { data } = await timetableLecturerApi.getLecturers();
		setLecturers(data.items);
	}

	public static async getRoom(id: number) {
		const { setRooms } = useTimetableStore();
		const { data } = await timetableRoomApi.getRoom(id);
		setRooms([data]);
	}

	public static async getRooms() {
		const { setRooms } = useTimetableStore();
		const { data } = await timetableRoomApi.getRooms();
		setRooms(data.items);
	}

	public static async getEvent(id: number) {
		const { setEvents } = useTimetableStore();
		const { data } = await timetableEventApi.getEvent(id);
		setEvents([data]);
	}

	public static async getEvents(params?: GetEventsParams) {
		const { setEvents } = useTimetableStore();
		const { data } = await timetableEventApi.getEvents(params);
		setEvents(data.items);
	}

	public static async getDayEvents(date: Date) {
		const { setDay } = useTimetableStore();
		const { data } = await timetableEventApi.getEvents({
			start: stringifyDateIso(date),
			end: stringifyDateIso(getDateWithDayOffset(date, 1)),
		});
		setDay(date, data.items);
	}
}
