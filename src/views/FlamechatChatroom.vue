<template>
	<div class="chat">
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
				<NewMessage class="new-message" :name="name" :color="color" />
			</v-card-actions>
		</v-card>
	</div>
</template>

<script>
import db from '@/firebase/init'
import moment from 'moment'
import NewMessage from './../components/NewMessage'

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
		track() {
			this.$ga.page(this.$router)
		}
	}
}
</script>

<style>
.new-message {
	width: 100%;
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
	font-size: 1.4em;
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
	font-size: 1em;
}

.messages {
	max-height: 450px;
	min-height: 450px;
	overflow: auto;
}

.chat .name {
	font-size: 22.5px;
}
</style>
