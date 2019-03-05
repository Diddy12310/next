<template>
	<div class="new-message">
		<form @submit.prevent="addMessage">
			<v-btn id="submit" type="submit" flat icon style="float: right; display: inline; position: relative; top: 8.25px;">
        <v-icon>send</v-icon>
      </v-btn>
			<v-text-field class="message" autocomplete="off" label="Message..." v-model="newMessage"></v-text-field>
			<p style="color: #F44336;" v-if="feedback">{{ feedback }}</p>
		</form>
	</div>
</template>

<script>
import db from '@/firebase/init'

export default {
	name: 'NewMessage',
	props: ['name', 'color'],
	data() {
		return {
			newMessage: null,
			feedback: null
		}
	},
	methods: {
		addMessage() {
			if(this.newMessage) {
				db.collection('messages').add({
					name: this.name,
					content: this.newMessage,
					color: this.color,
					timestamp: Date.now()
				}).catch(err => {
					console.log(err)
				})
				this.newMessage = null
				this.feedback = null
			} else {
				this.feedback = 'You must enter a message in order to send one!'
			}
		}
	}
}
</script>

<style scoped>
.message {
	width: 92.5%;
}
</style>
