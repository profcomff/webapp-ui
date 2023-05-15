<script setup lang="ts">
import { userSessionApi } from '@/api/auth';

const { data } = await userSessionApi.getSessions();
</script>

<template>
	<table v-for="session of data" :key="session.id" style="margin-bottom: 80px; overflow-wrap: break-word">
		<tr>
			<td>Последняя активность</td>
			<td>
				{{
					new Date(session.last_activity).toLocaleDateString('ru-RU', {
						day: 'numeric',
						month: 'long',
						hour: 'numeric',
						minute: 'numeric',
					})
				}}
			</td>
		</tr>
	</table>
</template>
