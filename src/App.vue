<template>
	<v-app dark>
		<!-- Toolbar -->
		<v-toolbar app :class="{ 'toolbar-no-ld': !lockdown, 'red': lockdown }">
			<v-toolbar-side-icon @click="drawer = !drawer" v-if="userPresent && !lockdown && !fourofour"></v-toolbar-side-icon>
			<v-toolbar-title>
				<img style="height: 45px; top: 5px; position: relative;" src="./assets/paradigmlogo.png" class="hidden-xs-only">
				<img style="height: 45px; top: 3.65px; position: relative;" src="./assets/plogo.png" class="hidden-sm-and-up">
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-toolbar-items v-if="userPresent && !lockdown && !fourofour">
				<v-btn flat icon @click="adminDialog = true" slot="activator" v-if="isAdmin">
					<v-icon>settings</v-icon>
				</v-btn>
				<v-btn icon @click="dialog = true">
					<v-icon>person</v-icon>
				</v-btn>
				<v-btn icon @click="refresh">
          <v-icon>refresh</v-icon>
        </v-btn>
			</v-toolbar-items>
			<v-toolbar-items v-if="username == 'diddy12310' && lockdown">
				<v-switch @click="lockdownToggle" v-model="lockdown" style="flex: none !important; top: +16px;"></v-switch>
			</v-toolbar-items>
			<v-toolbar-items v-if="username == 'diddy12310' && fourofour">
				<v-switch @click="fourofourToggle" v-model="fourofour" style="flex: none !important; top: +16px;"></v-switch>
			</v-toolbar-items>
		</v-toolbar>

		<!-- Navigation drawer -->
		<v-navigation-drawer v-model="drawer" app temporary floating>
			<v-toolbar>
				<v-toolbar-side-icon @click.prevent="drawer = false"><v-icon>close</v-icon></v-toolbar-side-icon>
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

		<!-- Account dialog -->
		<v-dialog v-model="dialog" max-width="500">
			<v-card>
				<v-card-title primary-title>
					<h3 v-if="!userPresent" class="headline mb-0">Account</h3>
					<h3 v-if="userPresent" class="headline mb-0 font-weight-medium text-uppercase" :style="{ color: accountColor }">{{ username }}</h3>
					<v-spacer></v-spacer>
					<v-btn icon @click="dialog = false" class="dialog-close-btn">
						<v-icon>close</v-icon>
					</v-btn>
				</v-card-title>

				<v-card-text>
					<v-tabs fixed-tabs v-if="!userPresent && signUpAvail">
						<v-tab>Sign In</v-tab>
						<v-tab-item>
							<v-form>
								<v-text-field autocomplete="off" type="text" name="username" v-model="username" label="Username" :rules="usernameRules"></v-text-field>
								<v-text-field autocomplete="off" type="password" name="password" v-model="password" label="Password" :rules="passRules"></v-text-field>
								<v-btn @click="signIn" color="primary">Sign In</v-btn>
							</v-form>
						</v-tab-item>
						<v-tab>Sign Up</v-tab>
						<v-tab-item>
							<v-form>
								<v-text-field autocomplete="off" type="text" name="username" v-model="username" label="Username" :rules="usernameRules"></v-text-field>
								<v-text-field autocomplete="off" type="password" name="password" v-model="password" label="Password" :rules="passRules"></v-text-field>
								<v-text-field autocomplete="off" type="text" name="bio" v-model="accountBio" label="Bio"></v-text-field>
								<swatches style="width: 100%; height: 100%; background-color: #2E2E2E;" v-model="accountColor" />
								<v-checkbox label="I have read and accept the Terms and Conditions" v-model="terms"></v-checkbox>
								<v-btn href="http://relay.theparadigmdev.com/terms.html">View Terms</v-btn>
								<v-btn @click="signUp" color="primary">Sign Up</v-btn>
							</v-form>
						</v-tab-item>
					</v-tabs>

					<v-form v-if="!userPresent && !signUpAvail">
						<v-text-field autocomplete="off" type="text" name="username" v-model="username" label="Username" :rules="usernameRules"></v-text-field>
						<v-text-field autocomplete="off" type="password" name="password" v-model="password" label="Password" :rules="passRules"></v-text-field>
					</v-form>

					<div v-if="userPresent">
						<p>{{ accountBio }}</p>
						<img src="@/assets/moonrocks.png" alt="Moonrocks" class="moonrock-img"><span class="moonrock-count font-weight-medium">{{ moonrocks }}</span>
						<p><strong>Last Sign In:</strong> {{ userInfo.metadata.lastSignInTime }}</p>
						<p><strong>Account Creation:</strong> {{ userInfo.metadata.creationTime }}</p>
						<p><strong>User ID:</strong> {{ userInfo.uid }}</p>
						<v-divider></v-divider>
						<v-btn @click="newPasswordDialog = true" flat color="warning">Change Password</v-btn>
						<v-btn @click="deleteDialog = true" flat color="error">Delete Account</v-btn>
						<v-btn @click="newBioDialog = true" flat color="accent">Edit Bio</v-btn>
						<v-btn @click="newColorDialog = true" flat color="accent">Change Color</v-btn>
					</div>
				</v-card-text>

				<v-card-actions>
					<v-btn v-if="!userPresent && !signUpAvail" @click="signIn" color="primary">Sign In</v-btn>
					<v-btn v-if="userPresent" @click="signOut">Sign Out</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- Delete account dialog -->
		<v-dialog v-model="deleteDialog" max-width="400">
			<v-card>
				<v-card-title><h3 class="headline mb-0">Delete Account</h3></v-card-title>
				<v-card-text>Are you sure you want to delete your account?</v-card-text>
				<v-card-actions>
					<v-btn @click="deleteUser" color="error" flat>Yes</v-btn>
					<v-btn @click="deleteDialog = false" color="green">Cancel</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- New password dialog -->
		<v-dialog v-model="newPasswordDialog" max-width="400">
			<v-card>
				<v-card-title><h3 class="headline mb-0">Change Password</h3></v-card-title>
				<v-card-text>
					<v-text-field autocomplete="off" type="password" name="newPassword" v-model="newPassword" label="New Password" :rules="passRules"></v-text-field>
				</v-card-text>
				<v-card-actions>
					<v-btn @click="changePass" color="warning" flat>Change Password</v-btn>
					<v-btn @click="newPasswordDialog = false" flat color="accent">Cancel</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- New color dialog -->
		<v-dialog v-model="newColorDialog" max-width="400">
			<v-card>
				<v-card-title><h3 class="headline mb-0">Change Color</h3></v-card-title>
				<v-card-text>
					<swatches style="width: 100%; height: 100%; background-color: #2E2E2E;" v-model="accountColor" />
				</v-card-text>
				<v-card-actions>
					<v-btn @click="changeColor(accountColor.hex)" color="warning" flat>Change Color</v-btn>
					<v-btn @click="newColorDialog = false" flat color="accent">Cancel</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- New bio dialog -->
		<v-dialog v-model="newBioDialog" max-width="400">
			<v-card>
				<v-card-title><h3 class="headline mb-0">Change Bio</h3></v-card-title>
				<v-card-text>
					<v-text-field autocomplete="off" type="text" name="bio" v-model="accountBio" label="Bio"></v-text-field>
				</v-card-text>
				<v-card-actions>
					<v-btn @click="changeBio(accountBio)" color="warning" flat>Change Bio</v-btn>
					<v-btn @click="newBioDialog = false" flat color="accent">Cancel</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- Admin dialog -->
		<v-dialog v-model="adminDialog" max-width="500" v-if="isAdmin">
			<v-card>
				<v-card-title>
					<h3 class="headline mb-0">Admin Panel</h3>
					<v-spacer></v-spacer>
					<v-btn icon @click="adminDialog = false" class="dialog-close-btn">
						<v-icon>close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text>
					<v-switch @click="toggleSignUp" v-model="signUpAvail" style="flex: none !important;" label="Sign up availability"></v-switch>
					<v-switch @click="lockdownToggle" v-model="lockdown" style="flex: none !important;" label="Lockdown" color="red"></v-switch>
					<v-switch @click="fourofourToggle" v-model="fourofour" style="flex: none !important;" label="404" color="deep-purple"></v-switch>
					<v-switch @click="toggleFc" v-model="flamechatEnable" style="flex: none !important;" label="Flamechat" color="deep-orange"></v-switch>
					<v-switch @click="toggleFcHTML" v-model="flamechatHTML" style="flex: none !important;" label="Flamechat HTML" color="deep-orange"></v-switch>
				</v-card-text>
				<v-card-actions></v-card-actions>
			</v-card>
		</v-dialog>

		<!-- Site content -->
		<v-content>
			<v-container fluid style="padding: 0;">
				<router-view v-if="userPresent && !lockdown && !fourofour"></router-view>
				<div class="noUser" v-if="!userPresent &&!lockdown && !fourofour" style="text-align: center;">
					<h1 class="display-3 red--text font-weight-thin text-uppercase" style="margin: 100px 0px 25px 0px;">No User is Logged In</h1>
					<h3 class="headline font-weight-light" style="margin: 25px;">Please login to continue.</h3>
					<v-btn color="primary" @click="dialog = true">Login</v-btn>
				</div>
				<div class="lockdown" v-if="lockdown" style="text-align: center;">
					<v-icon style="font-size: 75px; margin-top: 100px;" color="red">block</v-icon>
					<h1 class="display-3 red--text font-weight-thin text-uppercase" style="margin: 25px 0px 25px 0px;">Lockdown</h1>
					<h3 class="headline font-weight-light" style="margin: 25px;">No users logged in.</h3>
				</div>
				<div class="fourofour" v-if="fourofour" style="text-align: center;">
					<v-icon style="font-size: 75px; margin-top: 100px;" color="deep-purple darken-3">warning</v-icon>
					<h1 class="display-3 deep-purple--text darken-3 font-weight-thin text-uppercase" style="margin: 25px 0px 25px 0px;">404</h1>
					<h3 class="headline font-weight-light" style="margin: 25px;">Page not found.<br>There is probably an issue with the server.</h3>
				</div>
			</v-container>
		</v-content>

		<!-- Snackbar -->
		<v-snackbar v-if="feedback" v-model="snackbar" bottom left :timeout="2000">{{ feedback }}</v-snackbar>

		<!-- Footer -->
		<v-footer>
			<div><span class="pl-2" style="text-align: center;">&copy; {{ new Date().getFullYear() }} Paradigm Development.</span></div>
		</v-footer>
	</v-app>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase/app'
import 'firebase/auth'
import moment from 'moment'
import { Swatches } from 'vue-color'

export default {
	name: 'Paradigm',
	components: {
		Swatches
	},
	data() {
		return {
			drawer: false,
			apps: [
				{ text: 'Home', route: '/home' },
				{ text: 'Flamechat', route: '/flame' },
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
			snackbar: false,
			signUpAvail: null,
			terms: false,
			deleteDialog: false,
			lockdown: null,
			flamechatEnable: null,
			fourofour: null,
			flamechatHTML: null,
			newPasswordDialog: false,
			adminDialog: false,
			accountBio: '',
			accountColor: '',
			moonrocks: '',
			colors: [],
			isAdmin: false,
			isInnerCore: false,
			newColorDialog: false,
			newBioDialog: false
		}
	},
	methods: {
		refresh() {
			location.reload()
		},
		signIn() {
			if(this.username && this.password) {
				firebase.auth().signInWithEmailAndPassword(this.username + '@theparadigmdev.com', this.password).then(() => {
					
				}).catch(error => {
					if(error.code == 'auth/invalid-email') {
						this.feedback = 'Do not use spaces or characters disallowed in an email address.'
						this.snackbar = true
					}
					if(error.code == 'auth/wrong-password') {
						this.feedback = 'Please check your password.'
						this.snackbar = true
					}
					if(error.code == 'auth/invalid-email' || 'auth/wrong-password') {
						this.feedback = error.message
						this.snackbar = true
					}
				})
			} else {
				this.feedback = 'Please fill in the required fields.'
				this.snackbar = true
			}
		},
		signUp() {
			if(this.username && this.password && this.terms && this.accountColor && this.accountBio) {
				firebase.auth().createUserWithEmailAndPassword(this.username + '@theparadigmdev.com', this.password).then(user => {
					db.collection('users').doc(this.username).set({
						// uid: user.uid,
						bio: this.accountBio,
						color: this.accountColor.hex,
						moonrocks: 1,
						isAdmin: false,
						isInnerCore: false,
						isAsteroid: false
					})
					this.$ga.event(this.username, 'signed up')
				}).catch(error => {
					if(error.code == 'auth/invalid-email') {
						this.feedback = 'Do not use spaces or characters disallowed in an email address.'
						this.snackbar = true
					}
					if(error.code == 'auth/wrong-password') {
						this.feedback = 'Please check your password.'
						this.snackbar = true
					}
					if(error.code != 'auth/invalid-email' || 'auth/wrong-password') {
						this.feedback = error.message
						this.snackbar = true
					}
				})
			} else {
				this.feedback = 'Please fill in the required fields.'
				this.snackbar = true
			}
		},
		signOut() {
			this.$ga.event(this.username, 'signed out')
			firebase.auth().signOut().then(() => {
				this.feedback = 'Signed out successfully.'
				this.snackbar = true
				this.$ga.event(this.username, 'signed out')
			})
		},
		changePass() {
			firebase.auth().currentUser.updatePassword(this.newPassword).then(function() {
				// Update successful.
				this.newPasswordDialog = false,
				this.feedback = 'Password changed successfully.'
				this.snackbar = true
				this.$ga.event(this.username, 'changed their password')
			}).catch(function(error) {
				// An error happened.
				this.feedback = 'Password changed unsuccessfully.'
				this.snackbar = true
			})
			this.newPassword = null
		},
		deleteUser() {
			this.$ga.event(this.username, 'deleted their account')
			firebase.auth().currentUser.delete().then(() => {
				// User deleted.
				db.collection('users').doc(this.username).delete().then(() => {
					this.username = null
					this.userInfo = null
					this.userPresent = false
				})
				this.feedback = 'Account deleted sucessfully.'
				this.snackbar = true
			}).catch(function(error) {
				// An error happened.
				console.log(error)
			})
			this.deleteDialog = false
			this.dialog = false
		},
		toggleSignUp() {
			db.collection('meta').doc('auth').update({
				signUpAvail: !this.signUpAvail
			}).then(() => {
				if(this.signUpAvail == true) {
					this.$ga.event(this.username, 'enabled sign ups')
				} else {
					this.$ga.event(this.username, 'disabled sign ups')
				}
			})
		},
		toggleFcHTML() {
			db.collection('meta').doc('auth').update({
				flamechatHTML: !this.flamechatHTML
			}).then(() => {
				if(this.flamechatHTML == true) {
					this.$ga.event(this.username, 'enabled Flamechat HTML')
				} else {
					this.$ga.event(this.username, 'disabled Flamechat HTML')
				}
			})
		},
		lockdownToggle() {
			db.collection('meta').doc('auth').update({
				lockdown: !this.lockdown
			}).then(() => {
				if (this.lockdown == true) {
					this.$ga.event(this.username, 'locked down')
					this.feedback = 'Locked down successfully.'
					this.snackbar = true
				} else {
					this.$ga.event(this.username, 'ended the lockdown')
					this.feedback = 'Lockdown ended successfully.'
					this.snackbar = true
				}
			})
		},
		fourofourToggle() {
			db.collection('meta').doc('auth').update({
				fourofour: !this.fourofour
			}).then(() => {
				if (this.fourofour == true) {
					this.$ga.event(this.username, '404ed')
					this.feedback = '404 successfully.'
					this.snackbar = true
				} else {
					this.$ga.event(this.username, 'ended the 404')
					this.feedback = '404 ended successfully.'
					this.snackbar = true
				}
			})
		},
		toggleFc() {
			db.collection('meta').doc('auth').update({
				flamechatEnable: !this.flamechatEnable
			}).then(() => {
				if (this.flamechatEnable) {
					this.$ga.event(this.username, 'enabled Flamechat')
				}
				if (!this.flamechatEnable) {
					this.$ga.event(this.username, 'disabled Flamechat')
				}
			})
		},
		changeColor(newColor) {
			db.collection('users').doc(this.username).update({
				color: newColor
			}).then(() => {
				this.accountColor = newColor
				this.newColorDialog = false
				this.$ga.event(this.username, 'changed their color to ' + this.accountColor)
			})
		},
		changeBio(newBio) {
			db.collection('users').doc(this.username).update({
				bio: newBio
			}).then(() => {
				this.accountBio = newBio
				this.newBioDialog = false
				this.$ga.event(this.username, 'changed their bio to ' + this.accountBio)
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
				this.$ga.event(this.username, 'signed in')

				var usersRef = db.collection('users')
				usersRef.doc(this.username).get().then((doc) => {
					this.accountBio = doc.data().bio
					this.accountColor = doc.data().color
					this.moonrocks = doc.data().moonrocks
					this.isAdmin = doc.data().isAdmin
					this.isInnerCore = doc.data().isInnerCore
				})

				usersRef.onSnapshot(snapshot => {
					snapshot.docChanges().forEach(change => {
						if(change.type === "modified") {
							let doc = change.doc
							this.accountBio = doc.data().bio
							this.accountColor = doc.data().color
							this.moonrocks = doc.data().moonrocks
							this.isAdmin = doc.data().isAdmin
							this.isInnerCore = doc.data().isInnerCore
						}
					})
				})
			} else {
				this.userPresent = false
				this.username = ''
				this.password = ''
			}
		})

		var metaRef = db.collection('meta')
		metaRef.doc('auth').get().then((doc) => {
			this.signUpAvail = doc.data().signUpAvail
			this.lockdown = doc.data().lockdown
			this.flamechatEnable = doc.data().flamechatEnable,
			this.fourofour = doc.data().fourofour,
			this.flamechatHTML = doc.data().flamechatHTML
		})

		metaRef.onSnapshot(snapshot => {
			snapshot.docChanges().forEach(change => {
				if(change.type === "modified") {
					let doc = change.doc
					this.signUpAvail = doc.data().signUpAvail
					this.lockdown = doc.data().lockdown
					this.flamechatEnable = doc.data().flamechatEnable,
					this.fourofour = doc.data().fourofour,
					this.flamechatHTML = doc.data().flamechatHTML
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

.toolbar-no-ld {
	background: linear-gradient(to right, #542478 0%, #011949 100%);
}

.v-input--switch {
	flex: none !important;
	position: relative;
	height: 30px;
}

.moonrock-img {
	height: 50px;
	margin-bottom: 16px;
}

.moonrock-count {
	position: relative;
	bottom: +36px;
	padding-left: 5px;
}
</style>
