import { vitePWAconfig } from './vitePwaOptions';
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';
import { VitePWA } from 'vite-plugin-pwa';
import Stylelint from 'vite-plugin-stylelint';
import Eslint from 'vite-plugin-eslint';
import Vue from '@vitejs/plugin-vue';
import path from 'path';
import postcssPresetEnv from 'postcss-preset-env';
import basicSsl from '@vitejs/plugin-basic-ssl';
import vuetify from 'vite-plugin-vuetify';

export default defineConfig({
	css: {
		postcss: {
			plugins: [
				postcssPresetEnv({
					features: {
						'nesting-rules': true
					}
				})
			]
		}
	},
	plugins: [
		basicSsl(),
		Vue(),
		vuetify(),
		Eslint(),
		Stylelint({
			files: [path.resolve(__dirname, 'src/**/*.{vue,css}')]
		}),
		VitePWA(vitePWAconfig)
	],
	resolve: {
		alias: [
			{ find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
			{
				find: '@icons',
				replacement: path.resolve(__dirname, 'node_modules/vue-material-design-icons')
			}
		]
	},
	publicDir: 'src/public'
});
