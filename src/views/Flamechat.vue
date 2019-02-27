<template>
	<div class="welcome">
		<v-card class="welcome-card">
			<v-card-text>
				<h2>Welcome to Flamechat!</h2><br><br>
				<h1 class="display-4 red--text font-weight-bold">:(</h1><br><br>
				<p class="headline font-weight-light">Flamechat is down.<br>We are actively trying to repair it.</p>
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