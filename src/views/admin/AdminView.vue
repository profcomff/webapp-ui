<script setup lang="ts">
import AccessRestricted from '@/components/AccessRestricted.vue';
import IrdomLayout from '@/components/IrdomLayout.vue';
import { scopename } from '@/models/ScopeName';
import { useProfileStore } from '@/store/profile';
import { useToolbar } from '@/store/toolbar';
import { onMounted, ref } from 'vue';
import { AuthApi } from '@/api/controllers/auth/AuthApi';
import { MySessionInfo } from '@/api/auth';
import { useToastStore } from '@/store/toast';

const profileStore = useProfileStore();
const toolbar = useToolbar();
const toastStore = useToastStore();

const isTokenVisible = ref(false);

toolbar.setup({
	title: 'Админка',
});

const copyText = (text: string) => {
	navigator.clipboard
		.writeText(text)
		.then(() =>
			toastStore.push({
				title: 'Значение скопировано',
			})
		)
		.catch(err => {
			console.error(err);
		});
};

onMounted(() => {
	if (!profileStore.id) {
		AuthApi.getMe([MySessionInfo.SessionScopes]);
	}
});
</script>

<template>
	<IrdomLayout>
		<h3>Информаця о пользователе</h3>
		<div class="info">
			<h4>Ваш id: {{ profileStore.id }}</h4>
			<h4>Токен:</h4>
			<v-text-field
				v-model="profileStore.token"
				:type="isTokenVisible ? 'text' : 'password'"
				:append-inner-icon="isTokenVisible ? 'md:visibility' : 'md:visibility_off'"
				append-icon="md:content_copy"
				readonly
				variant="underlined"
				hide-details
				@click:append-inner="isTokenVisible = !isTokenVisible"
				@click:append="copyText(profileStore.token ?? '')"
			/>
			<v-expansion-panels class="info" flat>
				<v-expansion-panel title="Права сессии">
					<v-expansion-panel-text>
						<div class="scope-list">
							<p
								v-for="(scope, i) in profileStore.tokenScopes.sort()"
								:key="i"
								v-ripple
								class="scope-name"
								:title="scope"
								@click="copyText(scope)"
							>
								{{ scope }}
							</p>
						</div>
					</v-expansion-panel-text>
				</v-expansion-panel>
			</v-expansion-panels>
			<v-btn prepend-icon="md:refresh" variant="plain" @click:abort="console.log('123')">
				Обновить сессию
			</v-btn>
		</div>

		<h3>Инструменты администратора</h3>

		<AccessRestricted :scope="scopename.auth.group.create">
			<RouterLink to="/admin/groups" class="link">Группы пользователей</RouterLink>
		</AccessRestricted>

		<AccessRestricted :scope="scopename.auth.scope.create">
			<RouterLink to="/admin/scopes" class="link"> Права доступа </RouterLink>
		</AccessRestricted>

		<AccessRestricted :scope="scopename.auth.user.read">
			<RouterLink to="/admin/users" class="link">Пользователи</RouterLink>
		</AccessRestricted>

		<AccessRestricted :scope="scopename.achievements.achievement.create">
			<RouterLink to="/admin/achievement" class="link">Достижения</RouterLink>
		</AccessRestricted>
	</IrdomLayout>
</template>

<style>
.info {
	opacity: 0.7;
	display: flex;
	flex-flow: column;
	column-gap: 8px;
	align-items: center;
	width: 100%;
	margin: 16px 0;

	& > * {
		width: 100%;
	}
}

.link {
	display: flex;
	align-items: center;
	padding: 12px 24px;
	gap: 0.8em;
	border-radius: 5px;
	margin-bottom: 10px;
	background-color: rgb(var(--v-theme-surface-variant));
	transition: ease 0.3s;
}

.link:hover {
	filter: brightness(90%);
}

.scope-list {
	display: flex;
	widows: 100%;
	flex-flow: row wrap;
	gap: 8px;
	justify-content: space-between;
}

.scope-name {
	display: block;
	border-radius: 5px;
	width: 100%;
	max-width: 250px;
	padding: 8px;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
