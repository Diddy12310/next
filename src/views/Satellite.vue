<template>
	<div class="satellite">
		<v-text-field label="Web Address" v-model="address"></v-text-field>
		<embed crossorigin="anonymous" :src="address">
	</div>
</template>

<script>
export default {
	name: 'Satellite',
	data() {
		return {
			address: 'https://www.bing.com/'
		}
	},
	methods: {
		track() {
			this.$ga.page(this.$router)
		}
	}
}
</script>

<style scoped>
div.satellite {
	height: 100%;
	width: 100%;
	margin: 16px;
}

embed {
	height: calc(100vh - 174px);
	width: 100%;
	margin: 0;
	padding-bottom: 0;
}
</style>
