<template>
	<div class="system-status">
		<h1 class="display-3 blue--text font-weight-thin text-uppercase" style="margin: 50px; text-align: center;">System Status</h1>
		<div class="detail">
			<p>Main Site: <span :class="{ ok: main == 'OK', down: main == 'Down' }">{{ main }}</span></p>
			<p>Relay: <span :class="{ ok: relay == 'OK', down: relay == 'Down' }">{{ relay }}</span></p>
			<p>Development Server: <span :class="{ ok: dev == 'OK', down: dev == 'Down' }">{{ dev }}</span></p>
			<p>Electron: <span :class="{ ok: electron == 'OK', down: electron == 'Down' }">{{ electron }}</span></p>
		</div>
	</div>
</template>

<script>
import db from '@/firebase/init'

export default {
	name: 'System Status',
	data() {
		return {
			main: '',
			relay: '',
			dev: '',
			electron: ''
		}
	},
	created() {
		db.collection('meta').doc('status').get().then((doc) => {
			this.main = doc.data().main
			this.relay = doc.data().relay
			this.dev = doc.data().dev
			this.electron = doc.data().electron
		})
	}
}
</script>

<style scoped>
div.detail {
	width: 300px;
	margin: auto;
}

p {
	font-size: 20px;
	padding: 0;
	margin: 0;
}

.ok {
	color: #4CAF50;
	font-size: 30px;
	font-weight: bold;
}

.down {
	color: #F44336;
	font-size: 30px;
	font-weight: bold;
}
</style>
