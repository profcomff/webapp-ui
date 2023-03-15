<script setup lang="ts">
import { MaterialIcon } from '@/components/lib';
import { useAppsStore } from '@/store';
import { RouterLink } from 'vue-router';

const appsStore = useAppsStore();

const categories =
	appsStore.categories ??
	JSON.parse(`
			[ 
				{
                    "name": "Полезное",
                    "type": "grid3",
                    "buttons": [
                        {
                            "icon": "https://cdn.profcomff.com/app/menu_icons/printer.svg",
                            "name": "Бесплатный принтер",
                            "link": "/apps/browser#https://printer.ui.profcomff.com"
                        },
                        {
                            "icon": "https://cdn.profcomff.com/app/menu_icons/fifth_floor.svg",
                            "name": "Схема этажей",
                            "link": "/apps/browser#https://cdn.profcomff.com/app/map/"
                        }
                    ]
                },
                {
                    "name": "Сервисы",
                    "type": "grid3",
                    "buttons": [
                        {
                            "icon": "https://cdn.profcomff.com/app/menu_icons/write_us.svg",
                            "name": "Написать в профком",
                            "link": "https://vk.me/profcomff"
                        },
                        {
                            "icon": "https://cdn.profcomff.com/app/menu_icons/study_office.svg",
                            "name": "Учебная часть",
                            "link": "https://phys.msu.ru/rus/students/obshaja_infa.php#:~:name=%D0%98%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8F%20%D1%83%D1%87%D0%B5%D0%B1%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BE%D1%82%D0%B4%D0%B5%D0%BB%D0%B0"
                        },
                        {
                            "icon": "https://cdn.profcomff.com/app/menu_icons/courses.svg",
                            "name": "МФК",
                            "link": "https://lk.msu.ru/course"
                        },
                        {
                            "icon": "https://cdn.profcomff.com/app/menu_icons/report.svg",
                            "name": "Жалоба",
                            "link": "/apps/browser#https://forms.yandex.ru/u/635d013b068ff0587320bfc9/"
                        },
                        {
                            "icon": "https://cdn.profcomff.com/app/menu_icons/money_help.svg",
                            "name": "Материальная помощь",
                            "link": "https://vk.com/profcomff?w=page-24234717_51953473"
                        },
                        {
                            "icon": "https://cdn.profcomff.com/app/menu_icons/join.svg",
                            "name": "Вступить в профсоюз",
                            "link": "https://lk.msuprof.com/"
                        }
                    ]
                },
                {
                    "name": "Информация",
                    "type": "list",
                    "buttons": [
                        {
                            "icon": "install_mobile",
                            "name": "Установить приложение",
                            "link": "/apps/browser#https://pages.profcomff.com/installation"
                        },
                        {
                            "icon": "feedback",
                            "name": "Обратная связь",
                            "link": "/apps/browser#https://forms.yandex.ru/u/630f979143537dde00621b0b"
                        },
                        {
                            "icon": "info",
                            "name": "О приложении",
                            "link": "/apps/browser#https://pages.profcomff.com/about"
                        }
                    ]
                }
			]
		`);
// (await servicesApi.getCategories().then(async ({ data: categories }) => {
// 	for (const category of categories) {
// 		const {
// 			data: { buttons },
// 		} = await servicesApi.getButtons(category.id);
// 		category.buttons = buttons;
// 	}
// 	appsStore.categories = categories;
// 	return categories;
// }));
</script>

<template>
	<section v-for="{ name, type, buttons } of categories" class="section" :key="name">
		<h2 class="h2">
			{{ name }}
		</h2>

		<div :class="{ grid3: type === 'grid3', list: type === 'list' }">
			<div
				v-for="({ icon, link, name }, i) of buttons"
				class="app"
				:key="name"
				:style="{ animationDelay: `${i * 0.2}s` }"
			>
				<img v-if="icon.startsWith('http')" :src="icon" :alt="name" width="400" height="400" class="icon" />
				<MaterialIcon v-else :name="icon" class="icon" />

				<a v-if="link.startsWith('http')" :href="link" class="app-link">{{ name }}</a>
				<RouterLink v-else :to="link" class="app-link">{{ name }}</RouterLink>
			</div>
		</div>
	</section>
</template>

<style scoped>
.grid3 {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 32px;
	justify-items: center;
	align-self: center;
}

.grid3 .icon {
	width: 100%;
	height: auto;
	aspect-ratio: 1;
	margin-bottom: 8px;
	display: block;
}

.app {
	text-decoration: none;
	position: relative;
	border-radius: 24px;
}

.grid3 .app {
	max-width: 144px;
	background: white;
	padding: 12px 16px;
	display: block;
	font-size: 14px;
	text-align: center;
	overflow-wrap: anywhere;
	box-shadow: 0 0 20px rgb(0 0 0 / 10%);
	transition: all 0.3s ease;
	animation: pulse;
	animation-duration: 0.5s;
}

.app:nth-of-type(1) {
	animation-duration: 1s;
}

:is(.grid3 .app):hover {
	transform: translateY(-4px);
	box-shadow: 0 0 24px rgb(0 0 / 12%);
}

.list .app {
	display: flex;
	align-items: center;
	padding: 12px 24px;
	gap: 0.8em;
	background-color: #f2f2f2;
	border-radius: 5px;
	margin-bottom: 10px;
}

.app:last-child {
	margin-bottom: 0;
}

.h2 {
	margin-bottom: 16px;
	font-weight: normal;
}

.section {
	margin-bottom: 24px;
}

.section:last-child {
	margin-bottom: 0;
}

.app-link::after {
	content: '';
	position: absolute;
	inset: 0;
	z-index: 1;
}
</style>
