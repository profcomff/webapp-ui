<script setup lang="ts">
import { IrdomDialog } from '@/components';

const emits = defineEmits(['close']);

const closeModal = () => {
	emits('close');
};

interface Props {
	open?: boolean;
}

defineProps<Props>();
</script>

<template>
	<div>
		<irdom-dialog @close="closeModal" :open="open">
			<template #main> </template>
			<template #slider> </template>
		</irdom-dialog>
	</div>
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
