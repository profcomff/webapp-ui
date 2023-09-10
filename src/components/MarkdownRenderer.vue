<script setup lang="ts">
import Markdown from 'markdown-it';

const props = withDefaults(defineProps<{ text: string }>(), { text: '' });
const markdown = new Markdown();
</script>

<template>
	<!-- eslint-disable vue/no-v-html -->
	<div v-html="markdown.render(props.text)" />
	<!-- eslint-enable -->
</template>
