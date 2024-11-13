import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	...compat.extends(
		'eslint:recommended',
		'plugin:vue/vue3-recommended',
		'@vue/typescript/recommended',
		'plugin:prettier/recommended'
	),
	{
		languageOptions: {
			globals: {
				...globals.node,
			},

			ecmaVersion: 2020,
			sourceType: 'module',
		},

		rules: {
			'no-duplicate-imports': 'error',

			'vue/html-self-closing': [
				'error',
				{
					html: {
						void: 'always',
						normal: 'always',
						component: 'always',
					},

					svg: 'always',
					math: 'always',
				},
			],
		},
	},
];
