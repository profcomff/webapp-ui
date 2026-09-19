<script setup lang="ts">
import { computed } from 'vue';
import logos from '@/assets/logos.svg';
import mguLogoUrl from '../assets/mguLogoProfUnion.webp';
import type { ZachetCardData } from '../controller/types';

const props = defineProps<{
	card: ZachetCardData;
}>();

const contacts = computed(() => props.card.contacts);

async function copyText(value: string, label: string) {
	if (!value || value === '—') {
		return;
	}

	try {
		await navigator.clipboard.writeText(value);
		console.log('[ZachetCard][back] copied contact', { label, value });
	} catch (error) {
		console.error('[ZachetCard][back] failed to copy contact', { label, value, error });
	}
}

function handleCopyPhone(event: MouseEvent) {
	void copyText(contacts.value.phone, 'phone');

	const target = event.currentTarget as HTMLElement | null;
	target?.blur();
}

function handleCopyEmail(event: MouseEvent) {
	void copyText(contacts.value.email, 'email');

	const target = event.currentTarget as HTMLElement | null;
	target?.blur();
}
</script>

<template>
	<div class="zachet-card-back">
		<div class="zachet-card-back__hero">
			<div class="zachet-card-back__hero-left">
				<div class="zachet-card-back__brand">Zachёt!</div>

				<div class="zachet-card-back__subtitle">Дисконтная система</div>
			</div>

			<div class="zachet-card-back__hero-right">
				<img :src="mguLogoUrl" alt="ОПК МГУ" class="zachet-card-back__logo-image" />
			</div>
		</div>

		<div class="zachet-card-back__contacts">
			<div class="zachet-card-back__contact zachet-card-back__contact_address">
				<v-icon icon="home" size="12" />
				<span>{{ contacts.address }}</span>
			</div>

			<button
				type="button"
				class="zachet-card-back__contact zachet-card-back__contact-button zachet-card-back__contact_phone"
				@click="handleCopyPhone"
			>
				<v-icon icon="call" size="12" />
				<span>{{ contacts.phone }}</span>
			</button>

			<button
				type="button"
				class="zachet-card-back__contact zachet-card-back__contact-button zachet-card-back__contact_email"
				@click="handleCopyEmail"
			>
				<v-icon icon="email" size="12" />
				<span>{{ contacts.email }}</span>
			</button>

			<a
				class="zachet-card-back__contact zachet-card-back__contact-link zachet-card-back__contact_vk"
				href="https://vk.com/msuprofcom"
				target="_blank"
				rel="noopener noreferrer"
			>
				<svg class="zachet-card-back__vk-icon" aria-hidden="true">
					<use :href="`${logos}#vk`" />
				</svg>
				<span>{{ contacts.vk }}</span>
			</a>

			<a
				class="zachet-card-back__contact zachet-card-back__contact-link zachet-card-back__contact_website"
				href="https://msuprof.com"
				target="_blank"
				rel="noopener noreferrer"
			>
				<v-icon icon="language" size="12" />
				<span>{{ contacts.website }}</span>
			</a>
		</div>
	</div>
</template>

<style scoped>
.zachet-card-back {
	display: flex;
	flex-direction: column;
	flex: 1;
	min-height: 0;
}

.zachet-card-back__hero {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	padding: 18px 18px 16px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.85);
	flex: 1;
}

.zachet-card-back__hero-left {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 6px;
	min-width: 0;
}

.zachet-card-back__hero-right {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	flex-shrink: 0;
}

.zachet-card-back__brand {
	font-size: 38px;
	font-weight: 700;
	line-height: 0.95;
	color: #ffffff;
}

.zachet-card-back__subtitle {
	font-size: 14px;
	font-weight: 700;
	line-height: 1.1;
	color: #ffffff;
}

.zachet-card-back__logo-image {
	display: block;
	width: 82px;
	height: auto;
}

.zachet-card-back__contacts {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	grid-template-areas:
		'address vk'
		'phone .'
		'email website';
	row-gap: 8px;
	column-gap: 16px;
	padding: 10px 18px 12px;
	align-items: center;
	flex-shrink: 0;
}

.zachet-card-back__contact {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	font-size: 9px;
	line-height: 1.15;
	word-break: break-word;
	color: rgb(var(--v-theme-on-primary));
	text-decoration: none;
}

.zachet-card-back__contact_address {
	grid-area: address;
}

.zachet-card-back__contact_phone {
	grid-area: phone;
}

.zachet-card-back__contact_email {
	grid-area: email;
}

.zachet-card-back__contact_vk {
	grid-area: vk;
	justify-self: start;
}

.zachet-card-back__contact_website {
	grid-area: website;
	justify-self: start;
}

.zachet-card-back__contact-button {
	padding: 0;
	border: 0;
	background: transparent;
	cursor: pointer;
	font: inherit;
	text-align: left;
}

.zachet-card-back__contact-link:hover,
.zachet-card-back__contact-button:hover {
	opacity: 0.9;
}

.zachet-card-back__vk-icon {
	width: 12px;
	height: 12px;
	display: block;
	flex: 0 0 12px;
	color: rgb(var(--v-theme-on-primary));
	fill: currentColor;
}
</style>
