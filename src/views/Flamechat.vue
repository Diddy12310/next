<template>
	<div class="welcome">
		<v-card class="welcome-card">
			<v-card-text>
				<h2>Welcome to Flamechat!</h2>
				<form @submit.prevent="enterChat">
					<v-text-field autocomplete="off" type="text" name="name" v-model="name" label="Username"></v-text-field>
					<v-radio-group v-model="color" column>
            <v-radio :label="color.label" :color="color.value" :value="color.value" v-for="color in colors" :key="color.value"></v-radio>
						<v-radio label="Gold" color="#bf9b30" value="#bf9b30" v-if="name == 'Diddy12310'"></v-radio>
						<v-radio label="Bot" color="#00796B" value="#00796B" v-if="name == 'Paradigm'"></v-radio>
          </v-radio-group>
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
import db from '@/firebase/init'

export default {
  name: 'Flamechat',
  data() {
    return {
			name: null,
			terms: null,
			color: null,
			feedback: null,
			colors: []
    }
  },
	methods: {
		enterChat() {
			if(this.name && this.terms) {
				this.$router.push({ name: 'FlamechatChatroom', params: { name: this.name, color: this.color } })
			} else {
				this.feedback = 'You must enter a name and accept the Terms and Conditions to join!'
			}
		},
		track() {
			this.$ga.page(this.$router)
		}
	},
	created() {
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
	width: 500px;
	text-align: center;
}
</style>