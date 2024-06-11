import { vitePWAconfig } from './vitePwaOptions';
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';
import { VitePWA } from 'vite-plugin-pwa';
import Vue from '@vitejs/plugin-vue';
import postcssPresetEnv from 'postcss-preset-env';
import vuetify from 'vite-plugin-vuetify';

export default defineConfig({
	css: {
		postcss: {
			plugins: [
				postcssPresetEnv({
					features: {
						'nesting-rules': true,
					},
				}),
			],
		},
	},
	plugins: [Vue(), vuetify(), VitePWA(vitePWAconfig)],
	resolve: {
		alias: [{ find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) }],
	},
	publicDir: 'src/public',
});
