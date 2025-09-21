import { ManifestOptions } from 'vite-plugin-pwa';

export const vitePwaManifest: Partial<ManifestOptions> = {
	icons: [
		{
			src: 'icons/maskable/icon_1024x1024.webp',
			sizes: '1024x1024',
			type: 'image/webp',
			purpose: 'maskable',
		},
		{
			src: 'icons/maskable/icon_512x512.webp',
			sizes: '512x512',
			type: 'image/webp',
			purpose: 'maskable',
		},
		{
			src: 'icons/maskable/icon_192x192.webp',
			sizes: '192x192',
			type: 'image/webp',
			purpose: 'maskable',
		},
		{
			src: 'icons/maskable/icon_144x144.webp',
			sizes: '144x144',
			type: 'image/webp',
			purpose: 'maskable',
		},
		{
			src: 'icons/maskable/icon_96x96.webp',
			sizes: '96x96',
			type: 'image/webp',
			purpose: 'maskable',
		},
		{
			src: 'icons/maskable/icon_72x72.webp',
			sizes: '72x72',
			type: 'image/webp',
			purpose: 'maskable',
		},
		{
			src: 'icons/maskable/icon_48x48.webp',
			sizes: '48x48',
			type: 'image/webp',
			purpose: 'maskable',
		},
		{
			src: 'icons/maskable/icon_36x36.webp',
			sizes: '36x36',
			type: 'image/webp',
			purpose: 'maskable',
		},
		{
			src: 'icons/icon_512x512.webp',
			sizes: '512x512',
			type: 'image/webp',
		},
		{
			src: 'icons/icon_192x192.webp',
			sizes: '192x192',
			type: 'image/webp',
		},
		{
			src: 'icons/icon_144x144.webp',
			sizes: '144x144',
			type: 'image/webp',
		},
		{
			src: 'icons/icon_96x96.webp',
			sizes: '96x96',
			type: 'image/webp',
		},
		{
			src: 'icons/icon_72x72.webp',
			sizes: '72x72',
			type: 'image/webp',
		},
		{
			src: 'icons/icon_48x48.webp',
			sizes: '48x48',
			type: 'image/webp',
		},
		{
			src: 'icons/icon_36x36.webp',
			sizes: '36x36',
			type: 'image/webp',
		},
		{
			src: 'icons/icon_1024x1024.webp',
			sizes: '1024x1024',
			type: 'image/webp',
		},
		{
			src: 'icons/icon_1024x1024.png',
			sizes: '1024x1024',
			type: 'image/png',
		},
		{
			src: 'icons/icon_180x180.webp',
			sizes: '180x180',
			type: 'image/webp',
		},
		{
			src: 'icons/icon_167x167.webp',
			sizes: '167x167',
			type: 'image/webp',
		},
		{
			src: 'icons/icon_152x152.webp',
			sizes: '152x152',
			type: 'image/webp',
		},
		{
			src: 'icons/icon_120x120.webp',
			sizes: '120x120',
			type: 'image/webp',
		},
	],
	name: process.env.MODE === 'production' ? 'Твой Физфак!' : `Твой ФФ! (${process.env.MODE})`,
	short_name: process.env.MODE === 'production' ? 'Твой ФФ!' : `Твой ФФ! (${process.env.MODE})`,
	orientation: 'portrait',
	display: 'standalone',
	start_url: '/timetable',
	description: 'Приложение с сервисами для студентов и сотрудников физического факультета МГУ',
	theme_color: '#471c78',
	background_color: '#471c78',
	lang: 'ru',
	scope: process.env.BASE_URL,
};
