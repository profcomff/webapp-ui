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

const props = defineProps({
	open: {
		type: Boolean,
		required: true,
	},
});

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
	() => props.open,
	() => {
		if (props.open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
	},
);
</script>

<template>
	<div v-if="open" class="modal">
		<dialog class="modal-wrapper" :open="props.open">
			<div class="modal__exit">
				<button @click="closeModal" class="modal__exit-btn">
					<img draggable="false" src="../assets/close.svg" alt="exit btn" />
				</button>
			</div>
			<div :class="slider ? 'delete' : ''" v-show="main" class="modal__main">
				<h3 class="modal__main-title">Обновления</h3>
				<h4 class="modal__main-subtitle">Привет! Хочешь, покажу тебе, что новенького в нашем приложении?</h4>
				<button @click="goNext" class="modal__main-btn">Показать</button>
			</div>
			<div :class="!main ? 'open' : ''" v-show="slider" class="modal__slider">
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
							<img :src="updateImg" alt="" />
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
							<button @click="closeModal" class="modal__slider-btn">В приложение</button>
						</div>
					</swiper-slide>
				</swiper>
			</div>
			<div class="modal__bottom">
				<img class="modal__bottom-img" draggable="false" :src="catImg" alt="cat" />
			</div>
		</dialog>
	</div>
</template>

<style scoped lang="scss">
.modal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	background-color: rgba(0, 0, 0, 0.3);
	z-index: 1000;
	display: flex;
	align-items: center;
	justify-content: center;

	&-wrapper {
		width: 100%;
		margin: auto;
		max-width: 290px;
		height: 380px;
		border: none;
		padding: 20px 20px 0px 20px;
		background: #ffffff;
		box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.25);
		border-radius: 20px;
	}

	&__main {
		padding: 0px 15px;
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: center;

		&.delete {
			transition: 0.2s;
			transform: translateX(-50px);
			opacity: 0;
			visibility: hidden;
		}

		&-title {
			font-weight: 600;
			font-size: 24px;
			line-height: 28px;
			text-align: center;
			color: #000000;
		}

		&-subtitle {
			margin-top: 38px;
			font-weight: 400;
			font-size: 16px;
			line-height: 130%;
			text-align: center;
			color: #000000;
		}

		&-btn {
			cursor: pointer;
			margin-top: 40px;
			background: #00004b;
			border-radius: 10px;
			padding: 8px 36px;
			font-weight: 600;
			font-size: 12px;
			line-height: 14px;
			text-align: center;
			color: #ffffff;
		}
	}

	&__slider {
		padding: 0px 10px;
		transform: translateX(30px);
		opacity: 0;
		visibility: hidden;
		height: calc(100% - 140px);

		&.open {
			transition: 0.3s;
			transform: translateX(0px);
			opacity: 1;
			visibility: visible;
		}

		.swiper {
			width: 100%;
			height: 100%;
		}

		.swiper-slide {
			text-align: center;
			font-size: 18px;
			background: #fff;
			display: flex;
			justify-content: center;

			h3 {
				font-weight: 400;
				font-size: 16px;
				line-height: 130%;
				color: #000000;
			}
		}

		.first-slide {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 10px;
		}

		.end-slide {
			padding-top: 20px;
			display: flex;
			flex-direction: column;
			gap: 35px;
			align-items: center;
		}

		&-btn {
			cursor: pointer;
			background: #00004b;
			border-radius: 10px;
			padding: 8px 36px;
			font-weight: 600;
			font-size: 12px;
			line-height: 14px;
			text-align: center;
			color: #ffffff;
		}
	}

	&__exit {
		width: 100%;
		display: flex;
		justify-content: flex-end;
		margin-bottom: 25px;

		&-btn {
			cursor: pointer;
			border: none;
			background: transparent;
			width: 20px;
			height: 20px;
			display: flex;
			justify-content: center;
			align-items: center;

			img {
				user-select: none;
			}
		}
	}

	&__bottom {
		display: flex;
		justify-content: center;
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;

		&-img {
			user-select: none;
			margin-bottom: -1px;
		}
	}
}
</style>
