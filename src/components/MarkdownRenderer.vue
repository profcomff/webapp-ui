<script setup lang="ts">
import Markdown from 'markdown-it';

const props = withDefaults(defineProps<{ text: string }>(), { text: '' });
const markdown = new Markdown({
	breaks: true,
	linkify: true,
	quotes: '«»„“',
});
</script>

<template>
	<!-- eslint-disable vue/no-v-html -->
	<div v-html="markdown.render(props.text)" />
	<!-- eslint-enable -->
</template>

<style scoped>
h1 {
	margin-top: 0.67em;
	margin-bottom: 0.47em;
}
h2 {
	margin-top: 0.83em;
	margin-bottom: 0.63em;
}
h3 {
	margin-top: 1em;
	margin-bottom: 0.8em;
}
h4 {
	margin-top: 1.33em;
	margin-bottom: 1.13em;
}
h5 {
	margin-top: 1.67em;
	margin-bottom: 1.47em;
}
h6 {
	margin-top: 2.33em;
	margin-bottom: 2.13em;
}
ul ul,
ol ul {
	margin-left: 15px;
}
ol ol,
ul ol {
	margin-left: 15px;
}
a {
	color: #1a0dab;
	text-decoration: none;
}
a::hover {
	text-decoration: underline;
}
</style>
