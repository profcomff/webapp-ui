<script setup lang="ts">
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';

import { ref, watch } from 'vue';
import catImg from '@/assets/cat.png';
import updateImg from '@/assets/update.png';

import 'swiper/css/pagination';
import 'swiper/css';

const slider = ref(false);
const main = ref(true);

const emits = defineEmits(['close']);

interface Props {
	open?: boolean;
}

defineProps<Props>();

const closeModal = () => {
	emits('close');
};

const modules = ref([Pagination]);

const goNext = () => {
	slider.value = true;
	setTimeout(() => {
		main.value = false;
	}, 300);
};

watch(
	() => open,
	() => {
		if (open()) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
	},
);
</script>

<template>
	<div v-if="open" class="modal">
		<dialog class="wrapper" :open="open">
			<div class="exit">
				<button @click="closeModal">
					<img draggable="false" src="@/assets/close.svg" alt="exit btn" />
				</button>
			</div>
			<slot name="main">
				<div :class="slider ? 'delete' : ''" v-show="main" class="main">
					<h3>Обновления</h3>
					<h4>Привет! Хочешь, покажу тебе, что новенького в нашем приложении?</h4>
					<button @click="goNext">Показать</button>
				</div>
			</slot>
			<slot name="slider">
				<div :class="!main ? 'open' : ''" v-show="slider" class="slider">
					<swiper
						:pagination="{
							clickable: true,
						}"
						:spaceBetween="20"
						:modules="modules"
						class="mySwiper"
					>
						<swiper-slide>
							<div class="first-slide">
								<h3>Вот мы тут сделали это:</h3>
								<img :src="updateImg" alt="show image" />
							</div>
						</swiper-slide>
						<swiper-slide>
							<h3>
								Теперь вы можете получать информацию об обновлениях и эффективно пользоваться всеми
								возможностями нашего приложения!
							</h3>
						</swiper-slide>
						<swiper-slide>
							<div class="end-slide">
								<h3>
									текст который я не придумал но в зависимости от обновления он может стать более
									конкретным
								</h3>
								<button @click="closeModal">В приложение</button>
							</div>
						</swiper-slide>
					</swiper>
				</div>
			</slot>
			<div class="bottom">
				<img draggable="false" :src="catImg" alt="cat" />
			</div>
		</dialog>
	</div>

	<!-- <div v-if="open" class="modal">
		<dialog class="wrapper" :open="open">
			<div class="exit">
				<button @click="closeModal">
					<img draggable="false" src="@/assets/close.svg" alt="exit btn" />
				</button>
			</div>
			<div :class="slider ? 'delete' : ''" v-show="main" class="main">
				<h3>Обновления</h3>
				<h4>Привет! Хочешь, покажу тебе, что новенького в нашем приложении?</h4>
				<button @click="goNext">Показать</button>
			</div>
			<div :class="!main ? 'open' : ''" v-show="slider" class="slider">
				<swiper
					:pagination="{
						clickable: true,
					}"
					:spaceBetween="20"
					:modules="modules"
					class="mySwiper"
				>
					<swiper-slide>
						<div class="first-slide">
							<h3>Вот мы тут сделали это:</h3>
							<img :src="updateImg" alt="show image" />
						</div>
					</swiper-slide>
					<swiper-slide>
						<h3>
							Теперь вы можете получать информацию об обновлениях и эффективно пользоваться всеми
							возможностями нашего приложения!
						</h3>
					</swiper-slide>
					<swiper-slide>
						<div class="end-slide">
							<h3>
								текст который я не придумал но в зависимости от обновления он может стать более
								конкретным
							</h3>
							<button @click="closeModal">В приложение</button>
						</div>
					</swiper-slide>
				</swiper>
			</div>
			<div class="bottom">
				<img draggable="false" :src="catImg" alt="cat" />
			</div>
		</dialog>
	</div> -->
</template>

<style scoped>
.modal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	background-color: oklch(0% 0 0 / 30%);
	z-index: 1000;
	display: flex;
	align-items: center;
	justify-content: center;

	& .wrapper {
		width: 100%;
		margin: auto;
		max-width: 290px;
		height: 380px;
		border: none;
		padding: 20px 20px 0;
		background: oklch(100% 0 0);
		box-shadow: 4px 4px 20px oklch(0% 0 0 / 25%);
		border-radius: 20px;
	}

	& .main {
		padding: 0 15px;
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: center;

		& h3 {
			font-weight: 600;
			font-size: 24px;
			line-height: 28px;
			text-align: center;
			color: oklch(0% 0 0);
		}

		& h4 {
			margin-top: 38px;
			font-weight: 400;
			font-size: 16px;
			line-height: 130%;
			text-align: center;
			color: oklch(0% 0 0);
		}

		& button {
			cursor: pointer;
			margin-top: 40px;
			background: oklch(18.66% 0.13 264);
			border-radius: 10px;
			padding: 8px 36px;
			font-weight: 600;
			font-size: 12px;
			line-height: 14px;
			text-align: center;
			color: oklch(100% 0 0);
		}
	}

	& .slider {
		padding: 0 10px;
		transform: translateX(30px);
		opacity: 0;
		visibility: hidden;
		height: calc(100% - 120px);

		& .swiper {
			width: 100%;
			height: 100%;
		}

		& button {
			cursor: pointer;
			background: oklch(18.66% 0.13 264);
			border-radius: 10px;
			padding: 8px 36px;
			font-weight: 600;
			font-size: 12px;
			line-height: 14px;
			text-align: center;
			color: oklch(100% 0 0);
		}
	}

	& .open {
		transition: 0.3s;
		transform: translateX(0);
		opacity: 1;
		visibility: visible;
	}

	& .delete {
		transition: 0.2s;
		transform: translateX(-50px);
		opacity: 0;
		visibility: hidden;
	}

	& .swiper-slide {
		text-align: center;
		font-size: 18px;
		background: oklch(100% 0 0);
		display: flex;
		justify-content: center;

		& h3 {
			font-weight: 400;
			font-size: 16px;
			line-height: 130%;
			color: oklch(0% 0 0);
		}
	}

	& .first-slide {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}

	& .end-slide {
		padding-top: 20px;
		display: flex;
		flex-direction: column;
		gap: 35px;
		align-items: center;
	}

	& .exit {
		width: 100%;
		display: flex;
		justify-content: flex-end;
		margin-bottom: 25px;

		& button {
			cursor: pointer;
			border: none;
			background: transparent;
			width: 20px;
			height: 20px;
			display: flex;
			justify-content: center;
			align-items: center;

			& img {
				user-select: none;
			}
		}
	}

	& .bottom {
		display: flex;
		justify-content: center;
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;

		& img {
			user-select: none;
			margin-bottom: -1px;
		}
	}
}
</style>

<style>
& .swiper-pagination-bullet {
	width: 12px !important;
	height: 12px !important;
}
</style>
