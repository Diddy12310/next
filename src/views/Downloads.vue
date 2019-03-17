<template>
	<div class="download">
		<h1 class="display-3 blue--text font-weight-thin text-uppercase" style="margin: 50px; text-align: center;">Downloads</h1>

		<v-card>
			<v-card-title primary-title>
				<div>
					<h3 class="headline mb-0">Windows</h3>
				</div>
			</v-card-title>
			<v-divider></v-divider>
			<v-card-text>The Paradigm installer for Windows.</v-card-text>
			<v-card-actions>
				<v-btn flat color="accent" :href="windows" download>Download</v-btn>
			</v-card-actions>
		</v-card>
	</div>
</template>

<script>
import db from '@/firebase/init'

export default {
	name: 'Download',
	data() {
		return {
			windows: ''
		}
	},
	created() {
		db.collection('meta').doc('windows-installer').get().then((doc) => {
			this.windows = doc.data().location
		})
	}
}
</script>

<style scoped>
.v-card {
	width: 400px;
	margin: auto;
}
</style>
