<template>
	<div class="welcome">
		<v-toolbar dense color="deep-orange darken-2">
      <v-toolbar-title>Flamechat</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn class="hidden" id="btnLogout" flat @click="signOut()">Sign Out</v-btn>
    </v-toolbar>


		<!-- Account card -->
		<v-card class="welcome-card">
			<v-card-text>
				<h2>Welcome to Flamechat!</h2>
				<v-tabs fixed-tabs>
					<v-tab>Sign In</v-tab>
					<v-tab>Sign Up</v-tab>
					<v-tabs-items>
						<!-- Sign in tab -->
						<v-tab-item>
							<v-text-field autocomplete="off" type="text" name="username" v-model="username" label="Username"></v-text-field>
							<v-text-field autocomplete="off" type="password" name="password" v-model="password" label="Password"></v-text-field>

							<v-radio-group v-model="color" column>
								<v-radio :label="color.label" :color="color.value" :value="color.value" v-for="color in colors" :key="color.value"></v-radio>
								<v-radio label="Gold" color="#bf9b30" value="#bf9b30" v-if="username == 'Diddy12310'"></v-radio>
								<v-radio label="Bot" color="#00796B" value="#00796B" v-if="username == 'Paradigm'"></v-radio>
							</v-radio-group>

							<v-btn @click="signIn()">Sign In</v-btn>
						</v-tab-item>


						<!-- Sign up tab -->
						<v-tab-item>
							<!-- <v-text-field autocomplete="off" type="text" name="username" v-model="username" label="Username"></v-text-field> -->
							<v-text-field autocomplete="off" type="text" name="username" v-model="username" label="Username"></v-text-field>
							<v-text-field autocomplete="off" type="password" name="password" v-model="password" label="Password"></v-text-field>

							<v-radio-group v-model="color" column>
								<v-radio :label="color.label" :color="color.value" :value="color.value" v-for="color in colors" :key="color.value"></v-radio>
								<v-radio label="Gold" color="#bf9b30" value="#bf9b30" v-if="username == 'Diddy12310'"></v-radio>
								<v-radio label="Bot" color="#00796B" value="#00796B" v-if="username == 'Paradigm'"></v-radio>
							</v-radio-group>

							<v-checkbox v-model="terms" label="I have read and accepted the Terms and Conditions"></v-checkbox>
							<v-btn flat router to="/company/terms">View Terms and Conditions</v-btn><br>

							<v-btn @click="signUp()">Sign Up</v-btn>
						</v-tab-item>
					</v-tabs-items>
				</v-tabs>
				<p style="color: #F44336;" v-if="feedback">{{ feedback }}</p>
			</v-card-text>
		</v-card>


		<!-- Chat card -->
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
				<NewMessage :username="username" :color="color" />
			</v-card-actions>
		</v-card>

	</div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase/app'
import 'firebase/auth'
import moment from 'moment'
import NewMessage from './../components/NewMessage'

export default {
	name: 'Flamechat',
  data() {
    return {
			terms: false,
			color: null,
			feedback: null,
			colors: [],
			username: '',
			email: '',
			password: null,
			user: [],
			messages: []
    }
	},
	components: {
		NewMessage
	},
	methods: {
		signUp() {
			if(this.username && this.password && this.terms == true) {
				firebase.auth().createUserWithEmailAndPassword(this.username + '@theparadigm.ga', this.password).catch(error => this.feedback = error.message)
			} else {
				this.feedback = 'Please fill in the required fields.'
			}
		},
		signIn() {
			if(this.username && this.password && this.color) {
				firebase.auth().signInWithEmailAndPassword(this.username + '@theparadigm.ga', this.password).catch(error => this.feedback = error.message)
			} else {
				this.feedback = 'Please fill in the required fields.'
			}
		},
		signOut() {
			firebase.auth().signOut()
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


		var dbRef = db.collection('colors')

    dbRef.get().then(snapshot => {
      snapshot.forEach(doc => {
        let color = doc.data()
        this.colors.push(color)
      })
		})

		firebase.auth().onAuthStateChanged(firebaseUser => {
			var btnLogout = document.getElementById('btnLogout')
			var scrnWelcome = document.querySelector('.welcome-card')
			var scrnChat = document.querySelector('.chat-card')

			if(firebaseUser) {
				btnLogout.classList.remove('hidden')
				scrnWelcome.classList.add('hidden')
				scrnChat.classList.remove('hidden')

			} else {
				btnLogout.classList.add('hidden')
				scrnWelcome.classList.remove('hidden')
				scrnChat.classList.add('hidden')
			}
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
	width: 750px;
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
	overflow: auto;
}

.chat-card .name {
	font-size: 20px;
}

</style>