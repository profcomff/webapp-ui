<script setup lang="ts">
import { computed } from 'vue';
import logos from '@/assets/logos.svg';
import mguLogoUrl from '../assets/mguLogoProfUnion.webp';
import type { ZachetCardData } from '../controller/types';

const props = defineProps<{
	card: ZachetCardData;
}>();

const emit = defineEmits<{
	copyUnionCardNumber: [];
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

function handleCopyCardNumber(event: MouseEvent) {
	emit('copyUnionCardNumber');

	const target = event.currentTarget as HTMLElement | null;
	target?.blur();
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
		<div class="zachet-card-back__header">
			<div class="zachet-card-back__title">ПРОФСОЮЗНЫЙ БИЛЕТ</div>

			<v-btn variant="flat" class="zachet-card-back__copy-btn" @click="handleCopyCardNumber">
				<template #prepend>
					<v-icon icon="content_copy" />
				</template>

				№{{ props.card.unionCardNumber }}
			</v-btn>
		</div>

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
				<v-icon icon="home" size="16" />
				<span>{{ contacts.address }}</span>
			</div>

			<button
				type="button"
				class="zachet-card-back__contact zachet-card-back__contact-button zachet-card-back__contact_phone"
				@click="handleCopyPhone"
			>
				<v-icon icon="call" size="16" />
				<span>{{ contacts.phone }}</span>
			</button>

			<button
				type="button"
				class="zachet-card-back__contact zachet-card-back__contact-button zachet-card-back__contact_email"
				@click="handleCopyEmail"
			>
				<v-icon icon="email" size="16" />
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
				<v-icon icon="public" size="16" />
				<span>{{ contacts.website }}</span>
			</a>
		</div>
	</div>
</template>

<style scoped>
.zachet-card-back {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	overflow: hidden;
	min-height: var(--zachet-card-face-min-height-mobile);
	border-radius: 16px;
	background: var(--zachet-card-red);
	color: rgb(var(--v-theme-on-primary));
	box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
}

.zachet-card-back__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	padding: 12px 16px;
	border-bottom: 2px solid rgba(255, 255, 255, 0.85);
}

.zachet-card-back__title {
	font-size: 16px;
	font-weight: 500;
	line-height: 1.1;
	text-transform: uppercase;
}

.zachet-card-back__copy-btn {
	min-width: 0;
	background: rgb(var(--v-theme-on-primary)) !important;
	color: var(--zachet-card-red) !important;
	border-radius: 8px;
	font-size: 14px;
	font-weight: 700;
	text-transform: none;
	box-shadow: none !important;
}

:deep(.zachet-card-back__copy-btn .v-btn__overlay),
:deep(.zachet-card-back__copy-btn .v-btn__underlay) {
	display: none;
}

.zachet-card-back__hero {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20px;
	padding: 16px;
	border-bottom: 2px solid rgba(255, 255, 255, 0.85);
}

.zachet-card-back__hero-left {
	display: flex;
	flex-direction: column;
	gap: 8px;
	align-items: flex-start;
}

.zachet-card-back__hero-right {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	flex-shrink: 0;
}

.zachet-card-back__brand {
	font-size: 48px;
	font-weight: 700;
	line-height: 0.95;
}

.zachet-card-back__subtitle {
	font-size: 18px;
	font-weight: 700;
	line-height: 1.1;
}

.zachet-card-back__logo-image {
	display: block;
	width: 112px;
	height: auto;
}

.zachet-card-back__contacts {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	grid-template-areas:
		'address vk'
		'phone .'
		'email website';
	row-gap: 10px;
	column-gap: 28px;
	padding: 14px 16px 16px;
	align-items: center;
}

.zachet-card-back__contact {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	font-size: 13px;
	line-height: 1.2;
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
	width: 16px;
	height: 16px;
	display: block;
	flex: 0 0 16px;
	color: rgb(var(--v-theme-on-primary));
	fill: currentColor;
}

@media (max-width: 480px) {
	.zachet-card-back__hero {
		flex-direction: column;
		align-items: flex-start;
	}

	.zachet-card-back__contacts {
		grid-template-columns: 1fr;
		grid-template-areas:
			'address'
			'phone'
			'email'
			'vk'
			'website';
	}
}

@media (min-width: 768px) {
	.zachet-card-back {
		min-height: var(--zachet-card-face-min-height-desktop);
	}

	.zachet-card-back__header {
		padding: 18px 24px;
	}

	.zachet-card-back__title {
		font-size: 20px;
	}

	.zachet-card-back__hero {
		padding: 22px 24px;
	}

	.zachet-card-back__brand {
		font-size: 64px;
	}

	.zachet-card-back__subtitle {
		font-size: 22px;
	}

	.zachet-card-back__logo-image {
		width: 140px;
	}

	.zachet-card-back__contacts {
		padding: 18px 24px 22px;
	}

	.zachet-card-back__contact {
		font-size: 14px;
	}
}
</style>
