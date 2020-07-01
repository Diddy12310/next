<template>
	<div class="satellite">
		<v-toolbar dense color="blue-grey darken-2">
			<v-toolbar-title>Satellite</v-toolbar-title>
      <v-spacer></v-spacer>
			<v-text-field style="max-width: 500px;" color="white" class="mt-7" label="Address..." v-model="input"></v-text-field>
			<v-menu offset-y v-model="quick_links">
				<template v-slot:activator="{ on: menu }">
					<v-tooltip bottom>
						<template v-slot:activator="{ on: tooltip }">
							<v-btn text icon v-on="{ ...tooltip, ...menu }"><v-icon>{{ quick_links ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon></v-btn>
						</template>
						<span>Quick Links</span>
					</v-tooltip>
				</template>
				<v-list dense>
					<v-list-item :input-value="input == 'https://www.bing.com/'" @click="input = 'https://www.bing.com/'">
						<v-list-item-icon><v-icon>mdi-magnify</v-icon></v-list-item-icon>
						<v-list-item-title>Search</v-list-item-title>
					</v-list-item>
					<v-list-item :input-value="input == 'https://www.theepochtimes.com/'" @click="input = 'https://www.theepochtimes.com/'">
						<v-list-item-icon><v-icon>mdi-newspaper</v-icon></v-list-item-icon>
						<v-list-item-title>News</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
    </v-toolbar>

		<iframe id="satellite-embed" :style="{ height: `calc(100vh - ${$root.music.open ? '192px' : '112px'})` }" crossorigin="anonymous" :src="input"></iframe>
	</div>
</template>

<script>
export default {
	name: 'Satellite',
	data() {
		return {
			proxy: 'https://cors.io/?',
			input: 'https://www.bing.com/',
			output: 'https://cors.io/?https://www.bing.com/',
			quick_links: false
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
iframe {
	width: 100%;
	border: 0px;
}
</style>
