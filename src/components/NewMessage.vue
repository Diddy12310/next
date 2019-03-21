<template>
	<div class="new-message">
		<form @submit.prevent="addMessage">
			<v-btn id="submit" type="submit" flat icon style="float: right; display: inline; position: relative; top: 8.25px;">
        <v-icon>send</v-icon>
      </v-btn>
			<v-text-field class="message" autocomplete="off" label="Message..." v-model="newMessage"></v-text-field>
		</form>

		<v-snackbar v-model="snackbar" bottom left :timeout="6000">{{ snackbarMessage }}</v-snackbar>
	</div>
</template>

<script>
import db from '@/firebase/init'

export default {
	name: 'NewMessage',
	props: ['username', 'color'],
	data() {
		return {
			newMessage: null,
			snackbar: null,
			snackbarMessage: ''
		}
	},
	methods: {
		addMessage() {
			if(this.newMessage && this.username != '' && this.color != null) {
				db.collection('messages').add({
					name: this.username,
					content: this.newMessage,
					color: this.color,
					timestamp: Date.now()
				}).catch(err => {
					console.log(err)
					this.snackbarMessage = 'Your message did not send successfully!'
					this.snackbar = true
				})
				this.snackbarMessage = 'Your message sent successfully!'
				this.snackbar = true
				this.$ga.event('Flamechat', this.username + ' sent ' + this.newMessage)
				this.newMessage = null
			} else {
				this.snackbarMessage = 'Your message did not send sucessfully! Try signing out and back in.'
				this.snackbar = true
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
