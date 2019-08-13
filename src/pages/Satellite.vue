<template>
	<div class="satellite">
		<!-- <v-toolbar dense>
      <v-spacer></v-spacer>
      <v-toolbar-title class="red--text font-weight-light">This page will likely be removed in a future release due to lack of functionality.</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

		<v-text-field style="margin: 16px;" label="Web Address" v-model="input"></v-text-field>
		<v-btn text icon @click="changeURL()"><v-icon>send</v-icon></v-btn>
		<iframe id="satellite-embed" crossorigin="anonymous" :src="input"></iframe> -->
		<div style="text-align: center; margin: 50px 0px;">
			<h1 class="display-3 red--text font-weight-thin text-uppercase">Shutdown</h1>
			<h6 class="headline white--text font-weight-thin mt-3">This page was temporarily shut down due to fatal bugs. It will be back in a future release.</h6>
		</div>
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
	height: calc(100vh - 210px);
	width: 100%;
}
</style>
