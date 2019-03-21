<template>
	<div class="flamechat">
		<v-toolbar dense color="deep-orange darken-2">
			<v-toolbar-title>Flamechat</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-switch v-if="username == 'diddy12310'" @click="toggleFc" v-model="flamechatEnable" style="flex: none !important;"></v-switch>
			<v-btn v-if="username == 'diddy12310'" flat @click="clearAllMessages()">Clear All</v-btn>
		</v-toolbar>

		<v-container>

			<!-- Welcome card -->
			<v-card class="welcome-card" v-if="!username || !color || !ready">
				<v-card-title>
					<h3 class="headline mb-0 text-xs-center">Welcome to Flamechat!</h3>
				</v-card-title>
				<v-card-text>
					<v-radio-group v-model="color" column>
						<v-radio :label="color.label" :color="color.value" :value="color.value" v-for="color in colors" :key="color.value"></v-radio>
						<v-radio label="Gold" color="#bf9b30" value="#bf9b30" v-if="username == 'diddy12310'"></v-radio>
						<v-radio label="Bot" color="#00796B" value="#00796B" v-if="username == 'paradigm'"></v-radio>
					</v-radio-group>
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
						<li v-for="message in messages" :key="message.id" :id="message.id">
							<span :style="{ color: message.color }" class="name"><strong>{{ message.name }} </strong></span>
							<span v-html="message.content"></span>
							<span class="time">{{ message.timestamp }}</span>
							<v-btn class="admin-btn" flat color="error" v-if="username == 'diddy12310'" @click="deleteChat(message.id)">Delete</v-btn>
							<v-btn class="admin-btn" flat color="warning" v-if="username == 'diddy12310'" @click="editChat()">Edit</v-btn>
						</li>
					</ul>
				</v-card-text>

				<v-card-actions>
					<form @submit.prevent="sendChat" class="new-message">
						<v-btn :disabled="!flamechatEnable" id="submit" type="submit" flat icon style="float: right; display: inline; position: relative; top: 16px;">
							<v-icon>send</v-icon>
						</v-btn>
						<v-text-field :disabled="!flamechatEnable" class="message-box" autocomplete="off" label="Message..." v-model="newMessage"></v-text-field>
					</form>
					<!-- <form @submit.prevent="editChat" class="new-message" v-if="editor">
						<v-btn id="submit" type="submit" flat icon style="float: right; display: inline; position: relative; top: 16px;">
							<v-icon>edit</v-icon>
						</v-btn>
						<v-text-field class="message-box" autocomplete="off" label="Edit Message"></v-text-field>
					</form> -->
				</v-card-actions>
			</v-card>
		</v-container>
		<v-snackbar v-model="snackbar" bottom left :timeout="2000">{{ feedback }}</v-snackbar>
	</div>
</template>

<script>
import db from '@/firebase/init'
import moment from 'moment'

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
			messages: [],
			snackbar: false,
			newMessage: '',
			flamechatEnable: null
    }
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
				if(change.type == 'removed') {
					let doc = change.doc
					this.messages.splice(change.oldIndex, 1)
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

		var metaRef = db.collection('meta')
		metaRef.doc('auth').get().then((doc) => {
			this.flamechatEnable = doc.data().flamechatEnable
		})

		metaRef.onSnapshot(snapshot => {
			snapshot.docChanges().forEach(change => {
				if(change.type === "modified") {
					let doc = change.doc
					this.flamechatEnable = doc.data().flamechatEnable
				}
			})
		})
	},
	methods: {
		deleteChat(id) {
			db.collection('messages').doc(id).delete().then(() => {
				this.feedback = 'Message deleted successfully.'
				this.snackbar = true
			})
		},
		clearAllMessages() {
			var message
			for(message in this.messages) {
				db.collection('messages').get().then(snapshot => {
					snapshot.forEach(doc => {
						doc.ref.delete()
						this.feedback = 'All messages cleared.'
						this.snackbar = true
					})
				})
			}
		},
		sendChat() {
			if(this.newMessage && this.username != '' && this.color != null) {
				db.collection('messages').add({
					name: this.username,
					content: this.newMessage,
					color: this.color,
					timestamp: Date.now()
				}).catch(err => {
					console.log(err)
					this.feedback = 'Your message did not send successfully!'
					this.snackbar = true
				})
				this.feedback = 'Your message sent successfully!'
				this.snackbar = true
				this.$ga.event('Flamechat', this.username + ' sent ' + this.newMessage)
				this.newMessage = null
			} else {
				this.feedback = 'Your message did not send sucessfully! Try signing out and back in.'
				this.snackbar = true
			}
		},
		editChat() {
			this.feedback = 'Functionality not implemented yet.'
			this.snackbar = true
		},
		toggleFc() {
			db.collection('meta').doc('auth').update({
				flamechatEnable: !this.flamechatEnable
			})
		}
	}
}
</script>

<style scoped>
.welcome-card {
	margin: 50px auto;
	width: 100%;
	max-width: 550px;
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
	margin: auto;
	width: 100%;
	height: 100%;
	max-width: 1250px;
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
	height: calc(100vh - 312px);
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

.admin-btn {
	margin-left: 2px !important;
}

.message-box {
	width: 92.5% !important;
}

.v-input--switch {
	flex: none !important;
	position: relative;
	top: +10px;
}
</style>