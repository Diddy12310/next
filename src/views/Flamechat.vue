<template>
	<div class="welcome">
		<v-card class="welcome-card">
			<v-card-text>
				<h2>Welcome to Flamechat!</h2>
				<form @submit.prevent="enterChat">
					<v-text-field autocomplete="off" type="text" name="name" v-model="name" label="Username"></v-text-field>
					<v-checkbox v-model="terms" label="I have read and accepted the Terms and Conditions"></v-checkbox>
					<v-btn flat router to="/terms">View Terms and Conditions</v-btn><br>
					<p style="color: #F44336;" v-if="feedback">{{ feedback }}</p>
					<v-btn type="submit">Enter Chat</v-btn>
				</form>
			</v-card-text>
		</v-card>
	</div>
</template>

<script>
export default {
  name: 'Flamechat',
  data() {
    return {
			name: null,
			terms: null,
			feedback: null
    }
  },
	methods: {
		enterChat() {
			if(this.name && this.terms) {
				this.$router.push({ name: 'FlamechatChatroom', params: { name: this.name } })
			} else {
				this.feedback = 'You must enter a name and accept the Terms and Conditions to join!'
			}
		}
	}
}
</script>

<style scoped>
.welcome-card {
	margin: 100px auto;
	width: 500px;
	text-align: center;
}
</style>