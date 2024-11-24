import logos from '@/assets/logos.svg';
import { AuthButton } from '@/components/IrdomAuthButton.vue';

export const authButtons: AuthButton[] = [
	{
		name: 'ЛК МГУ',
		link: 'lk-msu',
		method: 'lkmsu_auth',
		icon: `${logos}#msu`,
		color: '#58b4470d',
	},
	{
		name: '@physics.msu.ru',
		link: 'physics-msu',
		method: 'physics_auth',
		icon: `${logos}#ff`,
		color: '#00014c0d',
	},
	{
		name: '@my.msu.ru',
		link: 'my-msu',
		method: 'my_msu_auth',
		icon: `${logos}#msu`,
		color: '#2f39500d',
	},
	{
		name: 'Yandex',
		link: 'yandex',
		method: 'yandex_auth',
		icon: `${logos}#yandex`,
		color: '#e94c000d',
	},
	{
		name: 'ВК',
		link: 'vk',
		method: 'vk_auth',
		icon: `${logos}#vk`,
		color: '#0077ff0d',
	},
	{
		name: 'Github',
		link: 'github',
		method: 'github_auth',
		icon: `${logos}#github`,
		color: '#24292f0d',
	},
	{
		name: 'Google',
		link: 'google',
		method: 'google_auth',
		icon: `${logos}#google`,
		color: '#58b4470d',
	},
	{
		name: 'Profcomff ID',
		link: 'authentic',
		method: 'authentic_auth',
		icon: `${logos}#pkffid`,
		color: '#f8ac0e',
	},
];
