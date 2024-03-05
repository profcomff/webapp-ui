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
	<div class="md" v-html="markdown.render(props.text)" />
	<!-- eslint-enable -->
</template>

<style scoped>
.md >>> h1 {
	margin-top: 0.67em;
	margin-bottom: 4px;
}

.md >>> h2 {
	margin-top: 0.83em;
	margin-bottom: 4px;
}

.md >>> h3 {
	margin-top: 1em;
	margin-bottom: 4px;
}

.md >>> h4 {
	margin-top: 1.33em;
	margin-bottom: 4px;
}

.md >>> h5 {
	margin-top: 1.67em;
	margin-bottom: 4px;
}

.md >>> h6 {
	margin-top: 2.33em;
	margin-bottom: 4px;
}

.md >>> ul ul,
.md >>> ol ul,
.md >>> ol ol,
.md >>> ul ol {
	margin-left: 15px;
}

.md >>> a {
	color: #1a0dab;
	text-decoration: none;
}

.md >>> a:hover {
	text-decoration: underline;
}
</style>
