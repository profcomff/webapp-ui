import {
	authLkmsuApi,
	authPhysicsApi,
	authMymsuApi,
	authYandexApi,
	authVkApi,
	authGithubApi,
	authGoogleApi,
	authTelegramApi,
} from '@/api/auth';
import logos from '@/assets/logos.svg';
import { AuthButton } from '@/components';

export const authButtons: AuthButton[] = [
	{
		name: 'Войти через ЛК МГУ',
		api: authLkmsuApi,
		icon: `${logos}#msu`,
		color: '#58b4470d',
	},
	{
		name: 'Войти через @physics.msu.ru',
		api: authPhysicsApi,
		icon: `${logos}#ff`,
		color: '#00014c0d',
	},
	{
		name: 'Войти через @my.msu.ru',
		api: authMymsuApi,
		icon: `${logos}#msu`,
		color: '#2f39500d',
	},
	{
		name: 'Войти через Yandex',
		api: authYandexApi,
		icon: `${logos}#yandex`,
		color: '#e94c000d',
	},
	{
		name: 'Войти через ВК',
		api: authVkApi,
		icon: `${logos}#vk`,
		color: '#0077ff0d',
	},
	{
		name: 'Войти через Telegram',
		api: authTelegramApi,
		icon: `${logos}#telegram`,
		color: '#0077ff0d',
	},
	{
		name: 'Войти через Github',
		api: authGithubApi,
		icon: `${logos}#github`,
		color: '#24292f0d',
	},
	{
		name: 'Войти через Google',
		api: authGoogleApi,
		icon: `${logos}#google`,
	},
];
