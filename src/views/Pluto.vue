<template>
	<div class="pluto">
		<h1 class="display-3 blue--text font-weight-thin text-uppercase" style="margin: 50px; text-align: center;">Pluto</h1>
		<v-card>
			<v-card-title primary-title>
				<div>
					<h3 class="headline mb-0">Windows</h3>
				</div>
			</v-card-title>
			<v-divider></v-divider>
			<v-card-text>The Paradigm installer for Windows.</v-card-text>
			<v-card-actions>
				<v-btn v-if="winavail" flat color="accent" :href="windows" download>Download</v-btn>
				<span v-if="!winavail" class="red--text font-weight-medium" style="margin: 6px;">UNAVAILABLE</span>
			</v-card-actions>
		</v-card>

		<v-card>
			<v-card-title primary-title>
				<div>
					<h3 class="headline mb-0">macOS</h3>
				</div>
			</v-card-title>
			<v-divider></v-divider>
			<v-card-text>The Paradigm installer for macOS.</v-card-text>
			<v-card-actions>
				<v-btn v-if="macavail" flat color="accent" :href="macos" download>Download</v-btn>
				<span v-if="!macavail" class="red--text font-weight-medium" style="margin: 6px;">UNAVAILABLE</span>
			</v-card-actions>
		</v-card>
	</div>
</template>

<script>
import db from '@/firebase/init'

export default {
	name: 'Pluto',
	data() {
		return {
			windows: '',
			macos: '',
			winavail: null,
			macavail: null
		}
	},
	created() {
		db.collection('meta').doc('electron').get().then((doc) => {
			this.windows = doc.data().windows
			this.macos = doc.data().macos
			this.winavail = doc.data().winavail
			this.macavail = doc.data().macavail
		})
	}
}
</script>

<style scoped>
.v-card {
	width: 400px;
	margin: 16px auto;
}
</style>
