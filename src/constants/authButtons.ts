import logos from '@/assets/logos.svg';
import { AuthButton } from '@/components/IrdomAuthButton.vue';

export const authButtons: AuthButton[] = [
	{
		name: 'ЛК МГУ',
		method: 'lk-msu',
		icon: `${logos}#msu`,
		color: '#58b4470d',
	},
	{
		name: '@physics.msu.ru',
		method: 'physics-msu',
		icon: `${logos}#ff`,
		color: '#00014c0d',
	},
	{
		name: '@my.msu.ru',
		method: 'my-msu',
		icon: `${logos}#msu`,
		color: '#2f39500d',
	},
	{
		name: 'Yandex',
		method: 'yandex',
		icon: `${logos}#yandex`,
		color: '#e94c000d',
	},
	{
		name: 'ВК',
		method: 'vk',
		icon: `${logos}#vk`,
		color: '#0077ff0d',
	},
	{
		name: 'Github',
		method: 'github',
		icon: `${logos}#github`,
		color: '#24292f0d',
	},
	{
		name: 'Google',
		method: 'google',
		icon: `${logos}#google`,
		color: '#58b4470d',
	},
];
