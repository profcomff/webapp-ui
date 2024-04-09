<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Placeholder from '@/assets/profile_image_placeholder.webp';
import { AuthApi } from '@/api';
import { MySessionInfo } from '@/api/auth';
import { UserdataApi } from '@/api/controllers/UserdataApi';
import { UserdataArray, UserdataCategoryName, UserdataParams } from '@/models';
import { UserdataExtendedValue } from '@/api/models';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { useProfileStore } from '@/store/profile';
import { UserdataConverter } from '@/utils/UserdataConverter';
import { useRouter } from 'vue-router';
import { useToolbar } from '@/store/toolbar';

const profileStore = useProfileStore();
const router = useRouter();
const toolbar = useToolbar();

toolbar.setup({
	title: 'Профиль',
	backUrl: '/profile',
});

const fullName_item = ref<UserdataExtendedValue | null>();
const photoURL_item = ref<UserdataExtendedValue | null>();
const fullName = ref('');
const photoURL = ref('');
const userdata = ref<UserdataArray>([]);

onMounted(async () => {
	if (history.state.token) {
		profileStore.updateToken(history.state.token);
		delete history.state.token;
	}

	const { data: me } = await AuthApi.getMe([
		MySessionInfo.AuthMethods,
		MySessionInfo.Groups,
		MySessionInfo.IndirectGroups,
		MySessionInfo.SessionScopes,
		MySessionInfo.UserScopes,
	]);
	const { data: user } = await UserdataApi.getUser(me.id);
	// const { data } = await UserdataApi.getCategories();
	fullName_item.value = UserdataConverter.getItem(user, {
		category: UserdataCategoryName.PersonalInfo,
		param: UserdataParams.FullName,
	});
	photoURL_item.value = UserdataConverter.getItem(user, {
		category: UserdataCategoryName.PersonalInfo,
		param: UserdataParams.Photo,
	});
	fullName.value = fullName_item.value?.name ?? '[object Object]';
	photoURL.value = photoURL_item.value?.name ?? Placeholder;
	// userdata.value = UserdataConverter.uniteWithUserCategories(
	// 	UserdataConverter.categoryToFlat(data),
	// 	user
	// );
});

async function saveEdit() {
	const { data: me } = await AuthApi.getMe([
		MySessionInfo.AuthMethods,
		MySessionInfo.Groups,
		MySessionInfo.IndirectGroups,
		MySessionInfo.SessionScopes,
		MySessionInfo.UserScopes,
	]);
	const updateBody = UserdataConverter.arrayToUpdate(userdata.value, 'user', [
		{
			category: UserdataCategoryName.PersonalInfo,
			param: UserdataParams.FullName,
			value: fullName.value,
		},
	]);
	await UserdataApi.patchUserById(me.id, updateBody);
	router.push('/profile');
}
</script>

<template>
	<IrdomLayout>
		<img :src="photoURL" alt="Аватар" width="400 " height="400" class="avatar" />
		<textarea
			v-model="fullName"
			outline="none"
			:readonly="!fullName_item?.changeable"
			:required="fullName_item?.is_required"
			class="user-name"
			:contenteditable="true"
			@input="fullName = ($event.target as HTMLInputElement).value"
		/>

		<section class="section">
			<h2>Основная информация</h2>
			<div>
				<div v-for="{ name, data } of userdata" :key="name">
					<div class="userdata-category">
						{{ name }}
					</div>
					<div v-for="{ param, value } of data" :key="param">
						<div class="userdata-param">
							{{ param }}
							<b v-if="value.is_required" class="required-field"> * </b>
						</div>
						<div class="userdata-value">
							<v-text-field
								class="edit-fields"
								:model-value="value.name"
								:required="value.is_required"
								:disabled="!value.changeable"
								variant="underlined"
								@input="value.name = $event.target.value"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
		<div class="fab">
			<v-btn icon="md:save" size="x-large" color="secondary" elevation="24" @click="saveEdit" />
		</div>
	</IrdomLayout>
</template>

<style scoped>
.edit-username {
	align-self: center;
}

.edit-fields {
	padding: 0;
}

.required-field {
	color: red;
}

.fab {
	position: fixed;
	bottom: calc(var(--v-layout-bottom) + 20px);
	right: 15px;
	display: grid;
	gap: 15px;
}

.avatar {
	align-self: center;
	margin-bottom: 16px;
	aspect-ratio: 1;
	height: auto;
	width: 100%;
	max-width: 161px;
	border-radius: 999px;
	object-fit: cover;
	position: relative;
	z-index: 2;
}

.section {
	margin-bottom: 40px;

	& h2 {
		margin-bottom: 20px;
	}
}

.userdata-category {
	margin-top: 28px;
	margin-bottom: 6px;
	color: var(--m-3-sys-light-outline, #79747e);
	font-size: 16px;
	font-weight: 900;
	line-height: 16px; /* 114.286% */
	letter-spacing: 0.5px;

	&:not(:last-child) {
		margin-bottom: 11px;
	}
}

.userdata-param {
	color: var(--m-3-sys-light-outline, #79747e);
	font-size: 12px;
	font-weight: 500;
	line-height: 16px;
	letter-spacing: 0.5px;
	margin-top: 18.5px;
}

.userdata-value {
	margin-bottom: 5px;
	color: var(--m-3-sys-light-on-surface, #1c1b1f);
	font-size: 16px;
	font-weight: 400;
	line-height: 24px;
	letter-spacing: 0.5px;
}

.user-name {
	resize: none;
	overflow: hidden;
	text-align: center;
	margin-bottom: 32px;
	display: flex;
	align-self: center;
	color: #000;
	font-kerning: none;
	font-size: 32px;
	font-weight: 700;
	line-height: 35px;
	letter-spacing: 0.1px;
	outline: none;
	border: none;
	width: 100%;
}

.info {
	margin-bottom: 30px;
	margin-top: 50px;
	color: #000;
	font-size: 20px;
	font-weight: 600;
	line-height: 16px; /* 80% */
	letter-spacing: 0.5px;
}

.v-text-field {
	width: 356px;
	text-align: center;
}
</style>
