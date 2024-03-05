import {
	authLkmsuApi,
	authPhysicsApi,
	authMymsuApi,
	authYandexApi,
	authVkApi,
	authGithubApi,
	authGoogleApi,
	authTelegramApi,
	AuthMethod,
} from '@/api/auth';
import logos from '@/assets/logos.svg';
import { AuthButton } from '@/components/IrdomAuthButton.vue';

export const authButtons: AuthButton[] = [
	{
		name: 'ЛК МГУ',
		api: authLkmsuApi,
		method: AuthMethod.LkMsu,
		icon: `${logos}#msu`,
		color: '#58b4470d',
	},
	{
		name: '@physics.msu.ru',
		api: authPhysicsApi,
		method: AuthMethod.Physics,
		icon: `${logos}#ff`,
		color: '#00014c0d',
	},
	{
		name: '@my.msu.ru',
		api: authMymsuApi,
		method: AuthMethod.MyMsu,
		icon: `${logos}#msu`,
		color: '#2f39500d',
	},
	{
		name: 'Yandex',
		api: authYandexApi,
		method: AuthMethod.Yandex,
		icon: `${logos}#yandex`,
		color: '#e94c000d',
	},
	{
		name: 'ВК',
		api: authVkApi,
		method: AuthMethod.VK,
		icon: `${logos}#vk`,
		color: '#0077ff0d',
	},
	{
		name: 'Telegram',
		api: authTelegramApi,
		method: AuthMethod.Telegram,
		icon: `${logos}#telegram`,
		color: '#0077ff0d',
	},
	{
		name: 'Github',
		api: authGithubApi,
		method: AuthMethod.Github,
		icon: `${logos}#github`,
		color: '#24292f0d',
	},
	{
		name: 'Google',
		api: authGoogleApi,
		method: AuthMethod.Google,
		icon: `${logos}#google`,
		color: '#fff',
	},
];
