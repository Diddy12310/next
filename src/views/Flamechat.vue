<template>
	<div class="flamechat">
		<v-toolbar dense color="deep-orange darken-2" v-if="flamechatEnable">
			<v-toolbar-title>Flamechat</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn v-if="username && color && ready && chatroom" @click="leaveRoom()" flat>Leave</v-btn>
			<v-btn v-if="username == 'diddy12310' && color && ready && chatroom" flat @click="clearAllMessages()">Purge</v-btn>
		</v-toolbar>

		<v-container>

			<!-- Disabled card -->
			<v-card class="disabled-card" v-if="!flamechatEnable">
				<h1 class="display-4 red--text font-weight-bold">:(</h1><br><br>
				<p class="headline font-weight-light">Flamechat is off.<br>It will remain off indefinitely.</p>
			</v-card>

			<!-- Welcome card -->
			<div v-if="flamechatEnable">
				<v-card class="welcome-card" v-if="!username || !color || !ready || !chatroom">
					<v-card-title>
						<h3 class="headline mb-0 text-xs-center">Welcome to Flamechat!</h3>
					</v-card-title>
					<v-card-text>
						<h6 class="title">Color</h6>
						<v-radio-group v-model="color" column>
							<v-radio :label="color.label" :color="color.value" :value="color.value" v-for="color in colors" :key="color.value"></v-radio>
							<v-radio label="Gold" color="#bf9b30" value="#bf9b30" v-if="username == 'diddy12310'"></v-radio>
							<v-radio label="Bot" color="#00796B" value="#00796B" v-if="username == 'paradigm'"></v-radio>
						</v-radio-group>
						<h6 class="title">Chatroom</h6>
						<v-radio-group v-model="chatroom" column>
							<v-radio :label="room.name" :value="room.db" :disabled="!room.available" v-if="room.id !== 'chatrooms'" v-for="room in chatrooms" :key="room.id"></v-radio>
							<v-radio color="#C0C0C0" label="The Inner Core" value="the-inner-core" v-if="username == 'diddy12310' || username == 'mylichius' || username == '???'"></v-radio>
						</v-radio-group>
					</v-card-text>
					<v-card-actions>
						<v-btn :disabled="!chatroom || !color" flat @click.stop="ready = true, setChatroom()" color="accent">Join</v-btn>
					</v-card-actions>
				</v-card>


				<!-- Chat card -->
				<v-card class="chat-card" v-if="username && color && ready && chatroom">
					<v-card-text>
						<ul class="messages" v-chat-scroll="{ always: false }">
							<p v-if="messages == []">There are no messages posted on this room.</p>
							<li v-for="message in messages" :key="message.id" :id="message.id">
								<span :style="{ color: message.color }" class="name"><strong>{{ message.name }} </strong></span>
								<span v-if="flamechatHTML" v-html="message.content"></span>
								<span v-if="!flamechatHTML">{{ message.content }}</span>
								<span class="time">{{ message.timestamp }}</span>
								<v-btn class="admin-btn" icon flat color="error" v-if="username == 'diddy12310'" @click.prevent="deleteChat(message.id)"><v-icon>delete</v-icon></v-btn>
								<v-btn class="admin-btn" icon flat color="warning" v-if="username == 'diddy12310'" @click.prevent="editor = true, editing = message.id, editMessage = message.content"><v-icon>edit</v-icon></v-btn>
							</li>
						</ul>
					</v-card-text>

					<v-card-actions>
						<form @submit.prevent="sendChat" class="new-message" v-if="!editor">
							<v-btn :disabled="!flamechatEnable" id="submit" type="submit" flat icon style="float: right; display: inline; position: relative; top: 16px;">
								<v-icon>send</v-icon>
							</v-btn>
							<v-text-field :disabled="!flamechatEnable" class="message-box" autocomplete="off" label="Message..." v-model="newMessage"></v-text-field>
						</form>
						<form @submit.prevent="editChat" class="new-message" v-if="editor">
							<v-btn id="submit" type="submit" flat icon style="float: right; display: inline; position: relative; top: 16px;">
								<v-icon>edit</v-icon>
							</v-btn>
							<v-text-field v-model="editMessage" class="message-box" autocomplete="off" label="Edit Message"></v-text-field>
						</form>
					</v-card-actions>
				</v-card>

			</div>
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
			editMessage: '',
			editor: false,
			editing: null,
			flamechatEnable: true,
			chatroom: null,
			chatrooms: [],
			flamechatHTML: null
    }
	},
	created() {
		this.username = this.$parent.$parent.$parent.username
		this.chatroom = null

		var chatroomsRef = db.collection('flamechat')
		chatroomsRef.onSnapshot(snapshot => {
			snapshot.docChanges().forEach(change => {
				// if (change.doc.id != 'chatrooms') {
				// 	console.log(change)
					if (change.type === "added") {
						let doc = change.doc
						this.chatrooms.push({
							id: doc.id,
							name: doc.data().name,
							db: doc.data().db,
							available: doc.data().available,
						})
					}
					if (change.type === "removed") {
						let doc = change.doc
						this.chatrooms.splice(change.oldIndex, 1)
					}
					if (change.type === "modified") {
						let doc = change.doc
						this.chatrooms.splice(change.oldIndex, 1, {
							id: doc.id,
							name: doc.data().name,
							db: doc.data().db,
							available: doc.data().available
						})
					}
				// }
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
			this.flamechatHTML = doc.data().flamechatHTML
		})

		metaRef.onSnapshot(snapshot => {
			snapshot.docChanges().forEach(change => {
				if(change.type === "modified") {
					let doc = change.doc
					this.flamechatEnable = doc.data().flamechatEnable
					this.flamechatHTML = doc.data().flamechatHTML
					this.newMessage = null
				}
			})
		})
	},
	methods: {
		deleteChat(id) {
			db.collection('flamechat').doc('chatrooms').collection(this.chatroom).doc(id).delete().then(() => {
				this.feedback = 'Message deleted successfully.'
				this.snackbar = true
				this.$ga.event(this.username, 'deleted a message on ' + this.chatroom)
			})
		},
		clearAllMessages() {
			var message
			for(message in this.messages) {
				db.collection('flamechat').doc('chatrooms').collection(this.chatroom).get().then(snapshot => {
					snapshot.forEach(doc => {
						doc.ref.delete()
						this.feedback = 'All messages cleared.'
						this.snackbar = true
					})
				})
			}
			this.$ga.event(this.username, 'cleared all messages')
		},
		sendChat() {
			if(this.newMessage && this.username != '' && this.color != null) {
				db.collection('flamechat').doc('chatrooms').collection(this.chatroom).add({
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
				this.$ga.event(this.username, 'sent ' + this.newMessage + ' on ' + this.chatroom)
				this.newMessage = null
			} else {
				this.feedback = 'Your message did not send sucessfully! Try signing out and back in.'
				this.snackbar = true
			}
		},
		editChat(id) {
			db.collection('flamechat').doc('chatrooms').collection(this.chatroom).doc(this.editing).update({
				content: this.editMessage
			}).then(() => {
				this.feedback = 'Message edited successfully.'
				this.snackbar = true
				this.$ga.event(this.username, 'edited ' + this.editMessage + ' on ' + this.chatroom)
				this.editing = null
				this.editMessage = ''
				this.editor = false
			})
		},
		setChatroom() {
			let ref = db.collection('flamechat').doc('chatrooms').collection(this.chatroom).orderBy('timestamp', 'asc')
			this.messages = []

			ref.onSnapshot(snapshot => {
				snapshot.docChanges().forEach(change => {
					if(change.type === "added") {
						let doc = change.doc
						this.messages.push({
							id: doc.id,
							name: doc.data().name,
							content: doc.data().content,
							color: doc.data().color,
							timestamp: moment(doc.data().timestamp).format('lll')
						})
					}
					if(change.type === "removed") {
						let doc = change.doc
						this.messages.splice(change.oldIndex, 1)
					}
					if(change.type === "modified") {
						let doc = change.doc
						this.messages.splice(change.oldIndex, 1, {
							id: doc.id,
							name: doc.data().name,
							content: doc.data().content,
							color: doc.data().color,
							timestamp: moment(doc.data().timestamp).format('lll')
						})
					}
				})
			})
		},
		leaveRoom() {
			this.chatroom = null
			this.ready = false
		}
	}
}
</script>

<style scoped>
.welcome-card {
	margin: 50px auto;
	width: 100%;
	max-width: 550px;
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

.disabled-card {
	width: 100%;
	max-width: 350px;
	text-align: center;
	padding: 8px;
	margin: 64px auto;
}
</style>