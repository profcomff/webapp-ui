import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
	...tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended),
	...pluginVue.configs['flat/recommended'],
	...vueTsEslintConfig(),
	eslintPluginPrettierRecommended,
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
