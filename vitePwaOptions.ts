import { VitePWAOptions } from 'vite-plugin-pwa';
import { vitePwaManifest } from './vitePwaManifest';

export const vitePWAconfig: Partial<VitePWAOptions> = {
	workbox: {
		runtimeCaching: [
			{
				urlPattern: /^https?:\/\/fonts\.googleapis\.com\/.*/i,
				handler: 'CacheFirst',
				options: {
					cacheName: 'google-fonts-cache',
					expiration: {
						maxEntries: 10,
						maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
					},
					cacheableResponse: {
						statuses: [0, 200],
					},
				},
			},
			{
				urlPattern: /^https?:\/\/fonts\.gstatic\.com\/.*/i,
				handler: 'CacheFirst',
				options: {
					cacheName: 'gstatic-fonts-cache',
					expiration: {
						maxEntries: 10,
						maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
					},
					cacheableResponse: {
						statuses: [0, 200],
					},
				},
			},
			{
				urlPattern: /^https?:\/\/cdn\.profcomff\.com\/.*/i,
				handler: 'CacheFirst',
				options: {
					cacheName: 'cdn-cache',
					cacheableResponse: {
						statuses: [0, 200],
					},
				},
			},
		],
	},
	manifest: vitePwaManifest,
};
