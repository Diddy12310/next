<template>
	<div class="chat">
		<v-toolbar dense color="deep-orange darken-2">
      <v-toolbar-title>Flamechat</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn flat @click="signOut()">Sign Out</v-btn>
    </v-toolbar>

		<v-card class="chat-card">
			<v-card-text>
				<ul class="messages" v-chat-scroll>
					<p v-if="!messages">There are no messages posted on this room.</p>
					<li v-for="message in messages" :key="message.id">
						<span :style="{ color: message.color }" class="name"><strong>{{ message.name }}</strong></span>
						<span> {{ message.content }}</span>
						<span class="time">{{ message.timestamp }}</span>
					</li>
				</ul>
			</v-card-text>

			<v-card-actions>
				<NewMessage :name="name" :color="color" />
			</v-card-actions>
		</v-card>
	</div>
</template>

<script>
import db from '@/firebase/init'
import moment from 'moment'
import NewMessage from './../components/NewMessage'
import firebase from 'firebase'

export default {
	name: 'FlamechatChatroom',
	props: ['name', 'color'],
	components: {
		NewMessage
	},
	data() {
		return {
			messages: []
		}
	},
	created() {
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
	},
	methods: {
		signOut() {
			firebase.auth().signOut().then(() => {
				alert('Signed out.')
				this.$router.push({ name: 'Flamechat' })
			}).catch(function(error) {
				console.log(error)
			})
		}

	}
}
</script>

<style scoped>
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
	width: 750px;
	height: 100%;
}

.chat h2 {
	font-size: 2.6em;
	margin-bottom: 40px;
}

.chat span {
	font-size: 1.25em;
}

.chat ul {
	margin-left: 0;
  padding-left: 0;
}

.chat li {
	margin-bottom: 15px;
	list-style-type: none;
}

.chat .time {
	display: block;
	font-size: .85em;
}

.messages {
	height: calc(100vh - 300px);
	overflow: auto;
}

.chat .name {
	font-size: 20px;
}
</style>
