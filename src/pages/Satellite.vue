<template>
	<div class="satellite">
		<v-toolbar dense color="blue-grey darken-2">
			<v-toolbar-title>Satellite</v-toolbar-title>
      <v-spacer></v-spacer>
			<v-text-field class="mt-7" label="Web Address" v-model="input"></v-text-field>
			<v-btn text icon @click="changeURL()"><v-icon>mdi-send</v-icon></v-btn>

    </v-toolbar>

		<iframe id="satellite-embed" crossorigin="anonymous" :src="input"></iframe>
	</div>
</template>

<script>
export default {
	name: 'Satellite',
	data() {
		return {
			proxy: 'https://cors.io/?',
			input: 'https://www.bing.com/',
			output: 'https://cors.io/?https://www.google.com/'
		}
	},
	methods: {
		changeURL() {
			this.output = this.proxy + this.input
		}
	}
}
</script>

<style scoped>
div.satellite {
	height: 100%;
	width: 100%;
}

iframe {
	height: calc(100vh - 120px);
	width: 100%;
	border: 0px;
}
</style>
