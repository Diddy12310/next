<template>
	<div class="welcome">
		<v-toolbar dense color="deep-orange darken-2">
      <v-toolbar-title>Flamechat</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn class="hidden" id="btnLogout" flat @click="signOut()">Sign Out</v-btn>
    </v-toolbar>


		<!-- Account card -->
		<v-card class="welcome-card" v-if="!username || !color || !ready">
			<v-card-title>
				<h3 class="headline mb-0">Welcome to Flamechat!</h3>
			</v-card-title>
			<v-card-text>
				<v-radio-group v-model="color" column>
					<v-radio :label="color.label" :color="color.value" :value="color.value" v-for="color in colors" :key="color.value"></v-radio>
					<v-radio label="Gold" color="#bf9b30" value="#bf9b30" v-if="username == 'diddy12310'"></v-radio>
					<v-radio label="Bot" color="#00796B" value="#00796B" v-if="username == 'paradigm'"></v-radio>
				</v-radio-group>
				<p style="color: #F44336;" v-if="feedback">{{ feedback }}</p>
			</v-card-text>
			<v-card-actions>
				<v-btn flat @click.stop="ready = true" color="accent">Join</v-btn>
			</v-card-actions>
		</v-card>


		<!-- Chat card -->
		<v-card class="chat-card" v-if="username && color && ready">
			<v-card-text>
				<ul class="messages" v-chat-scroll>
					<p v-if="!messages">There are no messages posted on this room.</p>
					<li v-for="message in messages" :key="message.id">
						<span :style="{ color: message.color }" class="name"><strong>{{ message.name }} </strong></span>
						<span v-html="message.content"></span>
						<span class="time">{{ message.timestamp }}</span>
					</li>
				</ul>
			</v-card-text>

			<v-card-actions>
				<NewMessage :username="username" :color="color" />
			</v-card-actions>
		</v-card>

	</div>
</template>

<script>
import db from '@/firebase/init'
import moment from 'moment'
import NewMessage from './../components/NewMessage'

export default {
	name: 'Flamechat',
  data() {
    return {
			ready: false,
			terms: false,
			color: null,
			feedback: null,
			colors: [],
			username: null,
			user: [],
			messages: []
    }
	},
	components: {
		NewMessage
	},
	created() {
		this.username = this.$parent.$parent.$parent.username
		let ref = db.collection('messages').orderBy('timestamp')

		ref.onSnapshot(snapshot => {
			snapshot.docChanges().forEach(change => {
				if(change.type == 'added') {
					let doc = change.doc
					this.messages.push({
						id: doc.id,
						name: doc.data().name,
						content: doc.data().content,
						color: doc.data().color,
						timestamp: moment(doc.data().timestamp).format('lll')
					})
				}
			})
		})

		var dbRef = db.collection('colors')

    dbRef.get().then(snapshot => {
      snapshot.forEach(doc => {
        let color = doc.data()
        this.colors.push(color)
      })
		})
	}
}
</script>

<style scoped>
.welcome-card {
	margin: 100px auto;
	width: 55vw;
	text-align: center;
}

.hidden {
	display: none;
}

.new-message {
	width: 100%;
	position: relative;
	bottom: -12px;
}

.v-card__text {
	height: 100%;
}

.chat-card {
	margin-top: 16px;
	margin-bottom: 16px;
	margin-left: auto;
	margin-right: auto;
	width: 75vw;
	height: 100%;
}

.chat-card h2 {
	font-size: 2.6em;
	margin-bottom: 40px;
}

.chat-card span {
	font-size: 1.25em;
}

.chat-card ul {
	margin-left: 0;
  padding-left: 0;
}

.chat-card li {
	margin-bottom: 15px;
	list-style-type: none;
}

.chat-card .time {
	display: block;
	font-size: .85em;
}

.messages {
	height: calc(100vh - 300px);
	overflow-y: auto;
	overflow-x: hidden;
}

.chat-card .name {
	font-size: 20px;
}

div.v-input__slot {
	margin: 0px !important;
}

div.v-messages {
	height: 0px !important;
}
</style>