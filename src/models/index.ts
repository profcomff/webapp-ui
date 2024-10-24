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

export enum AuthMethod {
	Email = 'email',
	Yandex = 'yandex',
	Github = 'github',
	Google = 'google',
	LkMsu = 'lk-msu',
	MyMsu = 'my-msu',
	Physics = 'physics-msu',
	VK = 'vk',
}

export const AuthMethodLinkList = [
	'github',
	'google',
	'vk',
	'lk-msu',
	'yandex',
	'my-msu',
	'physics-msu',
] as const;
export type AuthMethodLink = (typeof AuthMethodLinkList)[number];

export const AuthMethodNameList = [
	'email',
	'github_auth',
	'google_auth',
	'vk_auth',
	'lkmsu_auth',
	'yandex_auth',
	'my_msu_auth',
	'physics_auth',
] as const;
export type AuthMethodName = (typeof AuthMethodNameList)[number];

export type MySessionInfo =
	| ('groups' | 'indirect_groups' | 'session_scopes' | 'user_scopes' | 'auth_methods')[]
	| undefined;

export type UserSessionById =
	| ('groups' | 'indirect_groups' | 'auth_methods' | 'scopes')[]
	| undefined;

export enum SessionInfo {
	SessionScopes = 'session_scopes',
	Token = 'token',
	Expires = 'expires',
}

// achievement models
export type Reciever = achievementComponents['schemas']['RecieverGet'];
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

// general models
export interface Entity {
	id: number;
}

// userdata models
export interface UserdataSource extends Entity {
	name: string;
	trust_level: number;
}

export interface UserdataCategory extends Entity {
	name: string;
	read_scope?: string;
	update_scope?: string;
	params?: UserdataParam[];
}

export enum UserdataParamResponseType {
	All = 'all',
	Last = 'last',
	MostTrusted = 'most_trusted',
}

export interface UserdataParam extends Entity {
	name: string;
	is_required: boolean;
	changeable: boolean;
	type: UserdataParamResponseType;
	category_id: number;
}

export interface UserdataRawItem {
	category: string;
	param: string;
	value?: string | null;
}

export interface UserdataItem {
	category: string;
	param: string;
	value: UserdataExtendedValue;
}

export type UserdataAuth = authComponents['schemas']['UsersGet'];
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
