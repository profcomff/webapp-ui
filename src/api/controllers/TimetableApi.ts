import { stringifyDateIso, getDateWithDayOffset } from './../../utils/date';
import { timetableEventApi, GetEventsParams } from './../timetable/TimetableEventApi';
import { timetableRoomApi } from './../timetable/TimetableRoomApi';
import { useTimetableStore } from './../../store/timetable';
import { timetableLecturerApi } from '../timetable';

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

	public static async getDayEvents(date: Date, groupId: number) {
		const { setDay } = useTimetableStore();
		const { data } = await timetableEventApi.getEvents({
			start: stringifyDateIso(date),
			end: stringifyDateIso(getDateWithDayOffset(date, 1)),
			group_id: groupId,
		});
		setDay(date, data.items);
	}

	public static async getLecturerEvents(lecturerId: number) {
		const { setLecturerEvents, setLecturers } = useTimetableStore();
		const { data } = await timetableEventApi.getEvents({
			start: stringifyDateIso(new Date()),
			end: stringifyDateIso(getDateWithDayOffset(new Date(), 1)),
			lecturer_id: lecturerId,
		});
		if (data.items.length) {
			setLecturers(data.items[0].lecturer);
			setLecturerEvents(lecturerId, data.items);
		}
	}

	public static async getRoomEvents(roomId: number) {
		const { setRoomEvents, setRooms } = useTimetableStore();
		const { data } = await timetableEventApi.getEvents({
			start: stringifyDateIso(new Date()),
			end: stringifyDateIso(getDateWithDayOffset(new Date(), 1)),
			room_id: roomId,
		});
		if (data.items.length) {
			setRooms(data.items[0].room);
			setRoomEvents(roomId, data.items);
		}
	}
}
