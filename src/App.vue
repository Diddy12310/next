<template>
	<v-app dark>
		<div ref="approot"></div>
		<v-toolbar app style="background: linear-gradient(to right, #542478 0%, #011949 100%);">
			<v-toolbar-side-icon @click="drawer = !drawer" v-if="userPresent"></v-toolbar-side-icon>
			<v-toolbar-title><img style="height: 45px; top: 5px; position: relative;" src="./assets/paradigmlogo.png" class="hidden-xs-only"></v-toolbar-title>
			<v-spacer></v-spacer>
			<v-toolbar-items v-if="userPresent">
				<v-btn icon @click="dialog = true">
					<v-icon>person</v-icon>
				</v-btn>
				<v-btn icon @click="refresh">
          <v-icon>refresh</v-icon>
        </v-btn>
			</v-toolbar-items>
		</v-toolbar>

		<v-navigation-drawer v-model="drawer" app temporary floating>
			<v-toolbar>
				<v-toolbar-side-icon @click="drawer = !drawer"><v-icon>close</v-icon></v-toolbar-side-icon>
				<v-toolbar-title>Menu</v-toolbar-title>
			</v-toolbar>
			
			<v-list>
				<v-list-tile v-for="link in apps" :key="link.route" router :to="link.route" :ripple="{ class: 'grey--text' }">
					<v-list-tile-title class="white--text font-weight-light">{{ link.text }}</v-list-tile-title>
				</v-list-tile>

				<v-list-group>
					<v-list-tile slot="activator">
						<v-list-tile-title class="font-weight-black">Company</v-list-tile-title>
					</v-list-tile>

					<v-list-tile v-for="link in company" :key="link.route" router :to="link.route" :ripple="{ class: 'grey--text' }">
						<v-list-tile-title class="white--text font-weight-light">{{ link.text }}</v-list-tile-title>
					</v-list-tile>
				</v-list-group>

				<v-list-group>
					<v-list-tile slot="activator">
						<v-list-tile-title class="font-weight-black">Latest</v-list-tile-title>
					</v-list-tile>

					<v-list-tile v-for="link in latest" :key="link.route" router :to="link.route" :ripple="{ class: 'grey--text' }">
						<v-list-tile-title class="white--text font-weight-light">{{ link.text }}</v-list-tile-title>
					</v-list-tile>
				</v-list-group>

			</v-list>
    </v-navigation-drawer>

		<v-dialog v-model="dialog" max-width="500">
			<v-card>
				<v-card-title primary-title>
					<h3 class="headline mb-0">Account</h3>
					<v-spacer></v-spacer>
					<v-btn icon @click="dialog = false" class="dialog-close-btn">
						<v-icon>close</v-icon>
					</v-btn>
				</v-card-title>

				<v-card-text>
					<v-form v-if="!userPresent">
						<v-text-field autocomplete="off" type="text" name="username" v-model="username" label="Username" :rules="usernameRules"></v-text-field>
						<v-text-field autocomplete="off" type="password" name="password" v-model="password" label="Password" :rules="passRules"></v-text-field>
					</v-form>

					<div v-if="userPresent">
						<p><strong>Status:</strong> Signed in</p>
						<p><strong>Username:</strong> {{ username }}</p>
						<p><strong>Last Sign In:</strong> {{ userInfo.metadata.lastSignInTime }}</p>
						<p><strong>Account Creation:</strong> {{ userInfo.metadata.creationTime }}</p>
						<p><strong>User ID:</strong> {{ userInfo.uid }}</p>
						<v-text-field v-model="newPassword" label="New password" :rules="passRules" autocomplete="off" type="password" name="newpass"></v-text-field>
					</div>
				</v-card-text>

				<v-card-actions>
					<v-btn v-if="!userPresent" @click="signIn" color="primary" >Sign In</v-btn>
					<v-btn v-if="userPresent" @click="signOut">Sign Out</v-btn>
					<v-btn v-if="userPresent" @click="changePass" flat color="warning">Change Password</v-btn>
					<v-btn v-if="userPresent" @click="deleteUser" flat color="error">Delete Account</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-content>
			<v-container fluid style="padding: 0;">
				<router-view v-if="userPresent"></router-view>
				<div class="noUser" v-if="!userPresent" style="text-align: center;">
					<h1 class="display-3 red--text font-weight-thin text-uppercase" style="margin: 100px 0px 25px 0px;">No User is Logged In</h1>
					<h3 class="headline font-weight-light" style="margin: 25px;">Please login to continue.</h3>
					<v-btn color="primary" @click="dialog = true">Login</v-btn>
				</div>
			</v-container>
		</v-content>

		<v-snackbar v-if="feedback" v-model="snackbar" bottom left :timeout="snackTO">
      {{ feedback }}
    </v-snackbar>

		<v-footer>
			<div><span class="pl-2" style="text-align: center;">&copy; {{ new Date().getFullYear() }} Paradigm Development. All Rights Reserved.</span></div>
		</v-footer>
	</v-app>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase/app'
import 'firebase/auth'
import moment from 'moment'

export default {
	name: 'Paradigm',
	data() {
		return {
			drawer: false,
			apps: [
				{ text: 'Home', route: '/home' },
				{ text: 'Flamechat', route: '/flamechat' },
				{ text: 'Hex', route: '/hex' },
				// { text: 'Drawer', route: '/drawer' },
				// { text: 'Launchpad', route: '/launchpad' },
				{ text: 'Bookshelf', route: '/bookshelf' },
				{ text: 'The Paradox', route: '/paradox' },
				// { text: 'Scorecard', route: '/scorecard' },
				{ text: 'Satellite', route: '/satellite'},
				{ text: 'Movies', route: '/movies' },
				{ text: 'Music', route: '/music' },
				{ text: 'Asteroid', route: '/asteroid' }
			],
			company: [
				{ text: 'Support', route: '/company/support' },
				{ text: 'Notice', route: '/company/notice' },
				{ text: 'Roadmap', route: '/company/roadmap' },
				{ text: 'Terms', route: '/company/terms' },
				{ text: 'Network Status', route: '/company/status' }
			],
			latest: [
				{ text: 'Memes', route: '/latest/memes' },
				{ text: 'Vines', route: '/latest/vines' }
			],
			version: '',
			username: '',
			password: '',
			userPresent: null,
			dialog: false,
			usernameRules: [
				value => value.length >= 3 || 'Minimum length is 3 characters',
			],
			passRules: [
				value => value.length >= 8 || 'Minimum length is 8 characters'
			],
			userInfo: null,
			newPassword: null,
			feedback: null,
			snackTO: 6000,
			snackbar: false
		}
	},
	methods: {
		refresh() {
			location.reload()
		},
		signIn() {
			if(this.username && this.password) {
				firebase.auth().signInWithEmailAndPassword(this.username + '@theparadigmdev.com', this.password).catch(error => {
					if(error.code == 'auth/invalid-email') {
						this.feedback = 'Do not use spaces or characters disallowed in an email address.'
						this.snackbar = true
					}
					if(error.code == 'auth/wrong-password') {
						this.feedback = 'Please check your password.'
						this.snackbar = true
					}
				})
			} else {
				this.feedback = 'Please fill in the required fields.'
				this.snackbar = true
			}
		},
		signUp() {
			if(this.username && this.password) {
				firebase.auth().createUserWithEmailAndPassword(this.username + '@theparadigmdev.com', this.password).catch(error => {
					if(error.code == 'auth/invalid-email') {
						this.feedback = 'Do not use spaces or characters disallowed in an email address.'
						this.snackbar = true
					}
					if(error.code == 'auth/wrong-password') {
						this.feedback = 'Please check your password.'
						this.snackbar = true
					}
				})
			} else {
				this.feedback = 'Please fill in the required fields.'
				this.snackbar = true
			}
		},
		signOut() {
			firebase.auth().signOut()
			this.feedback = 'Signed out successfully.'
			this.snackbar = true
		},
		changePass() {
			firebase.auth().currentUser.updatePassword(this.newPassword).then(function() {
				// Update successful.
			}).catch(function(error) {
				// An error happened.
				console.log(error)
			})
			this.newPassword = null
		},
		deleteUser() {
			firebase.auth().currentUser.delete().then(function() {
				// User deleted.
				this.username = null
				this.userInfo = null
				this.userPresent = false
			}).catch(function(error) {
				// An error happened.
				console.log(error)
			})
		}
	},
	created() {
		firebase.auth().onAuthStateChanged(firebaseUser => {
			if(firebaseUser) {
				this.feedback = 'Signed in successfully.'
				this.snackbar = true
				this.userPresent = true
				this.username = firebaseUser.email.substring(0, firebaseUser.email.lastIndexOf("@"))
				this.userInfo = firebaseUser
			} else {
				this.userPresent = false
				this.username = ''
				this.password = ''
			}
		})
	}
}
</script>

<style>
html {
	overflow-y: auto;
}

.clock {
	margin-top: auto;
	margin-bottom: auto;
}

/* Scrollbar */

/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: rgba(241, 241, 241, 0.25);
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.error-card {
	margin: auto;
	padding: 16px;
	text-align: center;
}

.error-card p {
	margin: 0;
	padding: 0;
}

.dialog-close-btn {
	margin-top: 0px !important;
}
</style>
