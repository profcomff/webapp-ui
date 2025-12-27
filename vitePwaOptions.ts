import { VitePWAOptions } from 'vite-plugin-pwa';
import { vitePwaManifest } from './vitePwaManifest';

export const vitePWAconfig: Partial<VitePWAOptions> = {
	manifest: vitePwaManifest,
	workbox: {
		runtimeCaching: [
			{
				urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
				handler: 'StaleWhileRevalidate',
				options: {
					cacheName: 'google-fonts-stylesheets',
				},
			},
			{
				urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
				handler: 'CacheFirst',
				options: {
					cacheName: 'google-fonts-webfonts',
					expiration: {
						maxEntries: 30,
						maxAgeSeconds: 60 * 60 * 24 * 365,
					},
					cacheableResponse: {
						statuses: [0, 200],
					},
				},
			},
			{
				urlPattern: /^https:\/\/api(?:\.test)?\.profcomff\.com\/timetable\/.*/i,
				handler: 'NetworkFirst',
				options: {
					cacheName: 'api-timetable',
					networkTimeoutSeconds: 3,
					expiration: {
						maxEntries: 30,
						maxAgeSeconds: 60 * 60 * 24 * 365,
					},
					cacheableResponse: {
						statuses: [0, 200],
					},
				},
			},
		],
	},
};
