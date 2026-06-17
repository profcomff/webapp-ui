<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useZachetCardController } from './controller/useZachetCardController';
import ZachetCardFront from './ui/ZachetCardFront.vue';
import ZachetCardBack from './ui/ZachetCardBack.vue';

const props = defineProps<{
	userId?: number;
}>();

const { card, loading, error, reload } = useZachetCardController(props);
const isFrontSide = ref(true);

const DESIGN_WIDTH = 374;
const DESIGN_HEIGHT = 242;
const MAX_SCALE = 1.9;

const stageRef = ref<HTMLElement | null>(null);
const scale = ref(1);

let resizeObserver: ResizeObserver | null = null;

const viewportStyle = computed(() => ({
	height: `${DESIGN_HEIGHT * scale.value}px`,
}));

const shellStyle = computed(() => ({
	transform: `scale(${scale.value})`,
}));

function updateScale() {
	const stageWidth = stageRef.value?.clientWidth ?? DESIGN_WIDTH;
	scale.value = Math.min(stageWidth / DESIGN_WIDTH, MAX_SCALE);
}

async function copyUnionCardNumber() {
	if (!card.value?.unionCardNumber || card.value.unionCardNumber === '—') {
		logZachetCardComponent('copy skipped because union card number is empty');
		return;
	}

	try {
		await navigator.clipboard.writeText(card.value.unionCardNumber);
		logZachetCardComponent('union card number copied', {
			unionCardNumber: card.value.unionCardNumber,
		});
	} catch (error) {
		errorZachetCardComponent('failed to copy union card number', error);
	}
}

function handleCopyClick(event: MouseEvent) {
	void copyUnionCardNumber();

	const target = event.currentTarget as HTMLElement | null;
	target?.blur();
}

function toggleCardSide() {
	isFrontSide.value = !isFrontSide.value;

	logZachetCardComponent('card side toggled', {
		isFrontSide: isFrontSide.value,
	});
}

onMounted(async () => {
	await nextTick();
	updateScale();

	resizeObserver = new ResizeObserver(() => {
		updateScale();
	});

	if (stageRef.value) {
		resizeObserver.observe(stageRef.value);
	}
});

onBeforeUnmount(() => {
	resizeObserver?.disconnect();
});

watch(
	() => ({
		loading: loading.value,
		error: error.value,
		card: card.value,
		isFrontSide: isFrontSide.value,
		scale: scale.value,
	}),
	state => {
		logZachetCardComponent('state changed', state);
	},
	{ immediate: true, deep: true }
);

function logZachetCardComponent(message: string, payload?: unknown) {
	if (!import.meta.env.DEV) {
		return;
	}

	if (payload === undefined) {
		console.log('[ZachetCard][component]', message);
		return;
	}

	console.log('[ZachetCard][component]', message, payload);
}

function errorZachetCardComponent(message: string, payload?: unknown) {
	if (!import.meta.env.DEV) {
		return;
	}

	if (payload === undefined) {
		console.error('[ZachetCard][component]', message);
		return;
	}

	console.error('[ZachetCard][component]', message, payload);
}
</script>

<template>
	<div class="zachet-card-module">
		<div v-if="loading" class="zachet-card-module__state">Загрузка карты...</div>

		<div v-else-if="error" class="zachet-card-module__state zachet-card-module__state_error">
			<div>{{ error }}</div>
			<v-btn color="primary" @click="reload">Повторить</v-btn>
		</div>

		<div v-else-if="card" class="zachet-card-module__content">
			<div ref="stageRef" class="zachet-card-module__stage">
				<div class="zachet-card-module__viewport" :style="viewportStyle">
					<div class="zachet-card-shell" :style="shellStyle">
						<div class="zachet-card-shell__header">
							<div class="zachet-card-shell__title">ПРОФСОЮЗНЫЙ БИЛЕТ</div>

							<v-btn
								variant="flat"
								size="small"
								rounded="sm"
								class="zachet-card-shell__copy-btn"
								@click="handleCopyClick"
							>
								<template #prepend>
									<v-icon icon="content_copy" size="24" />
								</template>

								№{{ card.unionCardNumber }}
							</v-btn>
						</div>

						<ZachetCardFront v-if="isFrontSide" :card="card" />

						<ZachetCardBack v-else :card="card" />
					</div>
				</div>

				<v-btn
					block
					size="x-large"
					color="primary"
					class="zachet-card-module__flip-btn"
					@click="toggleCardSide"
				>
					ПЕРЕВЕРНУТЬ
				</v-btn>
			</div>
		</div>

		<div v-else class="zachet-card-module__state">Нет данных для отображения карты</div>
	</div>
</template>

<style scoped>
.zachet-card-module {
	--zachet-card-red: #c2291b;
	width: 100%;
}

.zachet-card-module__content {
	display: flex;
	justify-content: center;
	width: 100%;
}

.zachet-card-module__stage {
	width: min(100%, 710px);
	display: flex;
	flex-direction: column;
	gap: 16px;
	align-items: center;
}

.zachet-card-module__viewport {
	position: relative;
	width: 100%;
}

.zachet-card-shell {
	position: absolute;
	top: 0;
	left: 0;
	width: 374px;
	height: 242px;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	border-radius: 10px;
	background: var(--zachet-card-red);
	color: rgb(var(--v-theme-on-primary));
	box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
	transform-origin: top left;
}

.zachet-card-shell__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	padding: 14px 18px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.85);
	flex-shrink: 0;
}

.zachet-card-shell__title {
	font-size: 16px;
	font-weight: 400;
	line-height: 20px;
	letter-spacing: 0;
	text-transform: uppercase;
	color: #ffffff;
}

.zachet-card-shell__copy-btn {
	min-width: 0;
	height: 32px !important;
	padding-top: 2.86px !important;
	padding-right: 5.73px !important;
	padding-bottom: 2.86px !important;
	padding-left: 5.73px !important;
	gap: 4px;
	background: rgb(var(--v-theme-on-primary)) !important;
	color: var(--zachet-card-red) !important;
	box-shadow: none !important;
	text-transform: none;
	font-size: 16px;
	font-weight: 700;
	line-height: 20px;
	letter-spacing: 0.02em;
	border-radius: 4px !important;
}

:deep(.zachet-card-shell__copy-btn .v-btn__prepend) {
	margin-inline-end: 4px;
}

:deep(.zachet-card-shell__copy-btn .v-btn__content) {
	display: inline-flex;
	align-items: center;
}

:deep(.zachet-card-shell__copy-btn .v-btn__overlay),
:deep(.zachet-card-shell__copy-btn .v-btn__underlay) {
	display: none;
}

.zachet-card-module__state {
	display: flex;
	flex-direction: column;
	gap: 12px;
	align-items: center;
	justify-content: center;
	min-height: 220px;
	padding: 16px;
	border-radius: 20px;
	background: rgb(var(--v-theme-surface));
	color: rgba(var(--v-theme-on-surface));
}

.zachet-card-module__state_error {
	background: #fff1f0;
	color: #b42318;
}

.zachet-card-module__flip-btn {
	font-weight: 700;
	letter-spacing: 0.5px;
}
</style>
