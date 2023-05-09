<script setup lang="ts">
import { userSessionApi } from '@/api/auth';

const { data } = await userSessionApi.getSessions();
</script>

<template>
	<table v-for="session of data" :key="session.id" style="margin-bottom: 80px; overflow-wrap: break-word">
		<tr v-for="key of Object.keys(session)" :key="key">
			<td>{{ key }}</td>
			<td>{{ session[key as keyof typeof session] }}</td>
		</tr>
	</table>
</template>
