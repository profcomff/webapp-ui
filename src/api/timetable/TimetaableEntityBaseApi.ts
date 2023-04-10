import { EntityBaseApi, GetAllParams } from '../EntityBaseApi';
import { Entity } from '../models';

export class TimetableEntityBaseApi<
	E extends Entity,
	GetAllP extends GetAllParams = never,
	ModifyB = Omit<E, 'id'>,
	GetP = never,
	DeleteBulkP = never,
> extends EntityBaseApi<E, GetAllP, ModifyB, GetP, DeleteBulkP> {
	constructor(path = '') {
		super(`/timetable${path}`);
	}
}
