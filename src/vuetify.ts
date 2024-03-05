import { md3 } from 'vuetify/blueprints';
import { createVuetify } from 'vuetify';
import { aliases, md } from 'vuetify/iconsets/md';

const profcomffLight = {
	dark: false,
	colors: {
		primary: 'rgb(0, 1, 76)',
		'on-primary': 'rgb(255, 255, 255)',

		secondary: 'rgb(255, 139, 0)',
		'on-secondary': 'rgb(255, 255, 255)',

		background: 'rgb(255, 255, 255)',
		'on-background': 'rgb(0, 0, 0)',

		surface: 'rgb(245, 245, 245)',
		'on-surface': 'rgb(0, 0, 0, 0.87)',

		'surface-variant': 'rgb(245, 245, 245)',
		'on-surface-variant': 'rgba(0, 0, 0, 0.87)',
	},
};

export const vuetify = createVuetify({
	icons: {
		defaultSet: 'md',
		aliases,
		sets: {
			md,
		},
	},
	defaults: {
		VChip: {
			style: 'border-radius: 999px !important;',
		},
		VContainer: {
			style: 'max-width: 900px;',
		},
		VBottomNavigation: {
			style:
				'background-color: rgb(var(--v-theme-primary)); color: rgb(var(--v-theme-on-primary));',
		},
		VAppBar: {
			style:
				'background-color: rgb(var(--v-theme-primary)); color: rgb(var(--v-theme-on-primary)); overflow: visible;',
		},
		VList: {
			style:
				'background-color: rgb(var(--v-theme-background)); color: rgb(var(--v-theme-on-background))',
		},
		VCard: {
			style:
				'background-color: rgb(var(--v-theme-surface)); color: rgba(var(--v-theme-on-surface))',
		},
	},
	blueprint: md3,
	theme: {
		defaultTheme: 'profcomffLight',
		themes: {
			profcomffLight,
		},
	},
});
