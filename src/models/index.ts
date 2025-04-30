import { components as authComponents } from '@profcomff/api-uilib/src/openapi/auth';
import { components as achievementComponents } from '@profcomff/api-uilib/src/openapi/achievement';
import { components as serviceComponents } from '@profcomff/api-uilib/src/openapi/services';
import { components as timetableComponents } from '@profcomff/api-uilib/src/openapi/timetable';

// auth models
export type AuthGroup = authComponents['schemas']['Group'];
export type GetUser = authComponents['schemas']['UserGet'];
export type Session = authComponents['schemas']['auth_backend__schemas__models__Session'];
export type Scope = authComponents['schemas']['ScopeGet'];
export type User = authComponents['schemas']['User'];
export const UNKNOWN_DEVICE = 'unknown device';

export const AuthMethodLinkList = [
	'github',
	'google',
	'vk',
	'lk-msu',
	'yandex',
	'my-msu',
	'physics-msu',
	'authentic',
] as const;
export type AuthMethodLink = (typeof AuthMethodLinkList)[number];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AuthMethodNameList = [
	'email',
	'github_auth',
	'google_auth',
	'vk_auth',
	'lkmsu_auth',
	'yandex_auth',
	'my_msu_auth',
	'physics_auth',
	'authentic_auth',
] as const;
export type AuthMethodName = (typeof AuthMethodNameList)[number];

export enum SessionInfo {
	Token = 'token',
}

export interface LoginError {
	status: string;
	message: string;
	ru: string;
	id_token: string;
}

// achievement models
type Reciever = achievementComponents['schemas']['RecieverGet'];
export interface AchievementGet {
	id: number;
	name: string;
	description: string;
	picture: string | null;
	owner_user_id: number;
	recievers?: Reciever[] | undefined;
}

// service models
export type Category = serviceComponents['schemas']['CategoryGet'];
export type ServiceData = serviceComponents['schemas']['ButtonGet'];

// timetable models
export type Event = timetableComponents['schemas']['Event'];
export type Lecturer = timetableComponents['schemas']['LecturerGet'];
export type Room = timetableComponents['schemas']['RoomGet'];
export type StudyGroup = timetableComponents['schemas']['GroupGet'];

// app models
export interface AppToken {
	appId: number;
	token: string | undefined;
	expire: number;
}

// general models
interface Entity {
	id: number;
}

// userdata models
export interface UserdataCategory extends Entity {
	name: string;
	read_scope?: string;
	update_scope?: string;
	params?: UserdataParam[];
}

export enum UserdataParamResponseType {
	All = 'all',
}

interface UserdataParam extends Entity {
	name: string;
	is_required: boolean;
	changeable: boolean;
	type: UserdataParamResponseType;
	category_id: number;
}

interface UserdataRawItem {
	category: string;
	param: string;
	value?: string | null;
}

export interface UserdataItem {
	category: string;
	param: string;
	value: UserdataExtendedValue;
}

export interface UserdataRaw {
	items: UserdataRawItem[];
}

export interface Userdata {
	items: UserdataItem[];
}

export interface UserdataExtendedValue {
	name: string;
	is_required?: boolean;
	changeable?: boolean;
	type?: UserdataParamResponseType;
}

export interface UserdataUpdateUserItem {
	category: string;
	param: string;
	value: string | null;
}

export interface UserdataUpdateUser {
	items: UserdataUpdateUserItem[];
	source: string;
}

export enum ToastType {
	Error = 'error',
	Warn = 'warn',
	Info = 'info',
}

export interface Toast {
	title: string;
	type?: ToastType;
	description?: string;
}

export type UserdataTreeSheet = Map<string, UserdataExtendedValue>;

export type UserdataTree = Map<string, UserdataTreeSheet>;

export interface UserdataArrayDataItem {
	param: string;
	value: UserdataExtendedValue;
}

export interface UserdataArrayCategoryItem {
	category: string;
	param: string;
}

export interface UserdataArrayItem {
	name: string;
	data: UserdataArrayDataItem[];
}

export type UserdataArray = UserdataArrayItem[];

export enum UserdataCategoryName {
	PersonalInfo = 'Личная информация',
	Study = 'Учёба',
	Contacts = 'Контакты',
	Career = 'Карьера',
}

export enum UserdataParams {
	FullName = 'Полное имя',
	Photo = 'Фото',
}

export type UserdataConfig = Readonly<Record<UserdataCategoryName, Readonly<UserdataParams[]>>>;
