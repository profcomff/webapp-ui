<script setup lang="ts">
import { IrdomLayout, AnonymousMessage } from '@/components';
import { scopename } from '@/models';
import { useProfileStore } from '@/store';

const { isUserLogged, hasTokenAccess } = useProfileStore();
</script>

<template>
	<IrdomLayout title="Админка">
		<template v-if="isUserLogged()">
			<RouterLink to="/admin/groups" class="link">Редактироване групп пользователей</RouterLink>
			<RouterLink to="/admin/scopes" class="link" v-if="hasTokenAccess(scopename.auth.scope.read)">
				Редактирование прав доступа
			</RouterLink>
		</template>
		<AnonymousMessage v-else />
	</IrdomLayout>
</template>

<style scoped>
.section-title {
	margin-bottom: 20px;
	display: inline;
}

.section {
	margin-bottom: 40px;
}

.section:last-child {
	margin-bottom: 0;
}
.link {
	margin-bottom: 8px;
}

.link:last-child {
	margin-bottom: 0;
}
</style>
