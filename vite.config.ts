import { vitePWAconfig } from './vitePwaOptions';
import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'url';
import { VitePWA } from 'vite-plugin-pwa';
import { config } from 'dotenv';
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
	test: {
		include: ['tests/*/**/*.ts'],
		globalSetup: 'tests/globalSetup.ts',
		server: {
			deps: {
				inline: ['vuetify'],
			},
		},
		env: {
			...config({ path: './.env.vitest' }).parsed,
		},
	},
});
