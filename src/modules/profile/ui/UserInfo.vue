<script setup lang="ts">
import { UserdataArrayDataItem } from '@/models';
defineProps<{
	name: string;
	data: UserdataArrayDataItem[];
}>();
</script>

<template>
	<div class="pa-5 mb-4 rounded-lg bg-grey-lighten-4">
		<h3>{{ name }}</h3>
		<div v-for="{ param, value } of data" :key="param" class="mt-4">
			<div class="text-caption">
				{{ param }}
			</div>
			<div class="text-body-1 text-break">
				{{ value.name }}
			</div>
		</div>
	</div>
</template>
