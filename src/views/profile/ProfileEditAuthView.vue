<script setup lang="ts">
import { onMounted, computed } from 'vue';
import IrdomLayout from '@/components/IrdomLayout.vue';
import IrdomAuthButton from '@/components/IrdomAuthButton.vue';
import { useProfileStore } from '@/store/profile';
import { authButtons } from '@/constants/authButtons';
import { useToolbar } from '@/store/toolbar';
import { AuthApi } from '@/api';

const profileStore = useProfileStore();
const toolbar = useToolbar();

toolbar.setup({
	title: 'Методы авторизации',
	backUrl: '/profile',
});

onMounted(async () => {
	AuthApi.getMe(['auth_methods']);
});

const canLinked = computed(() =>
	authButtons.filter(({ method }) => !profileStore.authMethods?.includes(method))
);
const canUnlinked = computed(() =>
	authButtons.filter(({ method }) => profileStore.authMethods?.includes(method))
);
</script>

<template>
	<IrdomLayout>
		<section v-if="profileStore.authMethods?.length !== 8" class="section">
			<h2>Привязать аккаунт</h2>
			<div class="buttons">
				<IrdomAuthButton
					v-for="button of canLinked"
					:key="button.method"
					:button="button"
					location="auth-edit"
				/>
			</div>
		</section>

		<section v-if="profileStore.authMethods && profileStore.authMethods.length > 0" class="section">
			<h2>Отвязать аккаунт</h2>
			<div class="buttons">
				<IrdomAuthButton
					v-for="button of canUnlinked"
					:key="button.method"
					:button="button"
					location="auth-edit"
					:disabled="profileStore.authMethods.length === 1"
					:unlink="true"
				/>
			</div>
		</section>
	</IrdomLayout>
</template>

<style scoped>
.buttons {
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
}

.section {
	margin-bottom: 40px;

	& h2 {
		margin-bottom: 20px;
	}
}
</style>
