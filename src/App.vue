<template>
	<v-app dark>
    <!-- Toolbar -->
		<v-toolbar app :class="{ 'toolbar-no-ld': !lockdown && !shutdown, 'red': lockdown && !shutdown, 'black': shutdown }">
			<v-toolbar-side-icon @click="drawer = !drawer" v-if="$root.userPresent && !lockdown && !global_pnf && !$root.isBanned"></v-toolbar-side-icon>
			<v-toolbar-title>
				<img style="height: 45px;" src="./assets/paradigmlogo.png" :class="{ 'logo': $root.userPresent, 'logo-nouser': !$root.userPresent, 'hidden-xs-only': $root.accountColor }">
				<img style="height: 45px;" src="./assets/plogo.png" :class="{ 'logo-sm': $root.userPresent, 'logo-sm-nouser': !$root.userPresent, 'hidden-sm-and-up': $root.accountColor }">
			</v-toolbar-title>
      <v-spacer></v-spacer>
      <p v-if="app_loaded && !shutdown" class="clock font-weight-light hidden-xs-only">{{ currentDate }}<br>{{ currentTime }}</p>
			<v-spacer></v-spacer>
			<v-toolbar-items v-if="$root.userPresent && !lockdown && !global_pnf && !$root.isBanned && !shutdown">
				<v-btn flat icon @click="$root.terminalOpen = true" slot="activator" v-if="$root.isAdmin">
					<v-icon>settings</v-icon>
				</v-btn>
				<v-btn icon @click="dialog = true">
					<v-icon>person</v-icon>
				</v-btn>
			</v-toolbar-items>
			<v-toolbar-items v-if="shutdown || lockdown || global_pnf && !$root.isBanned">
				<v-btn flat icon @click="$root.terminalOpen = true" slot="activator" v-if="$root.isAdmin">
					<v-icon>settings</v-icon>
				</v-btn>
			</v-toolbar-items>
		</v-toolbar>

		<!-- Navigation drawer -->
		<v-navigation-drawer v-model="drawer" app temporary floating>
			<v-toolbar>
				<v-toolbar-side-icon @click.prevent="drawer = false"><v-icon>close</v-icon></v-toolbar-side-icon>
				<v-toolbar-title>Menu</v-toolbar-title>
			</v-toolbar>

			<v-list>
				<v-list-tile @click="$root.switch = 'Home', drawer = false" :ripple="{ class: 'grey--text' }">
					<v-list-tile-content>
            <v-list-tile-title class="font-weight-light">Home</v-list-tile-title>
          </v-list-tile-content>
				</v-list-tile>

				<v-list-tile v-for="link in apps" :key="link.route" @click="$root.switch = link.route, drawer = false" :ripple="{ class: 'grey--text' }">
					<v-list-tile-content>
            <v-list-tile-title class="font-weight-light" v-html="link.app"></v-list-tile-title>
          </v-list-tile-content>
				</v-list-tile>

				<v-divider></v-divider>

				<v-list-group>
					<v-list-tile slot="activator">
						<v-list-tile-content>
							<v-list-tile-title>Company</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>

					<v-list-tile v-for="link in company" :key="link.route" @click="$root.switch = link.route, drawer = false" :ripple="{ class: 'grey--text' }">
						<v-list-tile-content>
							<v-list-tile-title class="font-weight-light" v-html="link.app"></v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
				</v-list-group>

				<v-list-group>
					<v-list-tile slot="activator">
						<v-list-tile-content>
							<v-list-tile-title>Latest</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>

					<v-list-tile v-for="link in latest" :key="link.route" @click="$root.switch = link.route, drawer = false" :ripple="{ class: 'grey--text' }">
						<v-list-tile-content>
							<v-list-tile-title class="font-weight-light" v-html="link.app"></v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
				</v-list-group>

				<v-list-group>
					<v-list-tile slot="activator">
						<v-list-tile-content>
							<v-list-tile-title>For developers</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>

					<v-list-tile v-for="link in developers" :key="link.route" @click="$root.switch = link.route, drawer = false" :ripple="{ class: 'grey--text' }">
						<v-list-tile-content>
							<v-list-tile-title class="font-weight-light" v-html="link.app"></v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
				</v-list-group>
			</v-list>
    </v-navigation-drawer>

		<!-- Account dialog -->
		<v-dialog v-model="dialog" max-width="500">
			<v-card>
				<v-card-title primary-title>
					<h3 v-if="!$root.userPresent" class="headline mb-0">Account</h3>
					<h3 v-if="$root.userPresent" class="headline mb-0 font-weight-medium text-uppercase" :style="{ color: $root.accountColor }">{{ $root.username }}</h3>
					<v-spacer></v-spacer>
					<v-btn icon @click="dialog = false" class="dialog-close-btn">
						<v-icon>close</v-icon>
					</v-btn>
				</v-card-title>

				<v-card-text>
					<v-tabs fixed-tabs v-if="!$root.userPresent && sign_up_enable">
						<v-tab>Sign In</v-tab>
						<v-tab-item>
							<v-form>
								<v-text-field clearable autocomplete="off" type="text" name="username" v-model="$root.username" label="Username"></v-text-field>
								<v-text-field clearable autocomplete="off" type="password" name="password" v-model="password" label="Password"></v-text-field>
								<v-btn @click="signIn" color="accent" flat>Sign In</v-btn>
							</v-form>
						</v-tab-item>
						<v-tab>Sign Up</v-tab>
						<v-tab-item>
							<v-form>
								<v-text-field clearable autocomplete="off" type="text" name="username" v-model="$root.username" label="Username"></v-text-field>
								<v-text-field clearable autocomplete="off" type="password" name="password" v-model="password" label="Password"></v-text-field>
								<v-text-field clearable autocomplete="off" type="text" name="bio" v-model="$root.accountBio" label="Bio"></v-text-field>
								<swatches style="width: 100%; height: 100%; background-color: #2E2E2E; overflow-y: hidden;" v-model="$root.accountColor" />
								<v-checkbox label="I have read and accept the Terms and Conditions" v-model="terms"></v-checkbox>
								<v-btn href="http://relay.theparadigmdev.com/terms.html" flat color="blue-grey lighten-2">View Terms</v-btn>
								<v-btn @click="signUp" color="accent" flat>Sign Up</v-btn>
							</v-form>
						</v-tab-item>
					</v-tabs>

					<v-form v-if="!$root.userPresent && !sign_up_enable">
						<v-text-field clearable autocomplete="off" type="text" name="username" v-model="$root.username" label="Username"></v-text-field>
						<v-text-field clearable autocomplete="off" type="password" name="password" v-model="password" label="Password"></v-text-field>
					</v-form>

					<div v-if="$root.userPresent">
						<p>{{ $root.accountBio }}</p>
						<img src="./assets/moonrocks.png" alt="Moonrocks" class="moonrock-img"><span class="moonrock-count font-weight-medium">{{ $root.moonrocks }}</span>
						<p><strong>Last Sign In:</strong> {{ userInfo.metadata.lastSignInTime }}</p>
						<p><strong>Account Creation:</strong> {{ userInfo.metadata.creationTime }}</p>
						<p><strong>User ID:</strong> {{ userInfo.uid }}</p>
						<v-divider></v-divider>
						<v-btn @click="newBioDialog = true" flat color="accent">Edit Bio</v-btn>
						<v-btn @click="newColorDialog = true" flat color="accent">Change Color</v-btn>
						<v-btn @click="newPasswordDialog = true" flat color="warning">Change Password</v-btn>
						<v-btn @click="deleteDialog = true" flat color="error">Delete Account</v-btn>
					</div>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-btn v-if="!$root.userPresent && !sign_up_enable" @click="signIn" color="accent" flat>Sign In</v-btn>
					<v-btn v-if="$root.userPresent" @click="signOut" color="accent" flat>Sign Out</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- Delete account dialog -->
		<v-dialog v-model="deleteDialog" max-width="400">
			<v-card>
				<v-card-title><h3 class="headline mb-0">Delete Account</h3></v-card-title>
				<v-card-text>Are you sure you want to delete your account?</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-btn @click="deleteUser" color="error" flat>Yes</v-btn>
					<v-btn @click="deleteDialog = false" color="green" flat>Cancel</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- New password dialog -->
		<v-dialog v-model="newPasswordDialog" max-width="400">
			<v-card>
				<v-card-title><h3 class="headline mb-0">Change Password</h3></v-card-title>
				<v-card-text>
					<v-text-field autocomplete="off" type="password" name="newPassword" v-model="newPassword" label="New Password"></v-text-field>
				</v-card-text>
				<v-divider></v-divider>
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
					<swatches style="width: 100%; height: 100%; background-color: #2E2E2E; overflow-y: hidden;" v-model="$root.accountColor" />
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-btn @click="changeColor($root.accountColor.hex)" color="warning" flat>Change Color</v-btn>
					<v-btn @click="newColorDialog = false" flat color="accent">Cancel</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- New bio dialog -->
		<v-dialog v-model="newBioDialog" max-width="400">
			<v-card>
				<v-card-title><h3 class="headline mb-0">Change Bio</h3></v-card-title>
				<v-card-text>
					<v-text-field autocomplete="off" type="text" name="bio" v-model="$root.accountBio" label="Bio"></v-text-field>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-btn @click="changeBio($root.accountBio)" color="warning" flat>Change Bio</v-btn>
					<v-btn @click="newBioDialog = false" flat color="accent">Cancel</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- Admin terminal -->
		<v-bottom-sheet v-model="$root.terminalOpen" v-if="$root.isAdmin">
			<Terminal />
    </v-bottom-sheet>

		<!-- <v-dialog v-model="$root.terminalOpen" max-width="500" v-if="$root.isAdmin">
			<v-card>
				<v-card-title>
					<h3 class="headline mb-0">Mission Control</h3>
					<v-spacer></v-spacer>
					<v-btn icon @click="$root.terminalOpen = false" class="dialog-close-btn">
						<v-icon>close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text>
					<v-switch @click="toggleSignUp" v-model="sign_up_enable" style="flex: none !important;" label="Sign up availability"></v-switch>
					<v-switch @click="lockdownToggle" v-model="lockdown" style="flex: none !important;" label="Lockdown" color="red"></v-switch>
					<v-switch @click="toggleShutdown" v-model="shutdown" style="flex: none !important;" label="Shutdown" color="black"></v-switch>
					<v-switch @click="global_pnfToggle" v-model="global_pnf" style="flex: none !important;" label="404" color="deep-purple"></v-switch>
					<v-switch @click="toggleFc" v-model="flamechat_enable" style="flex: none !important;" label="Flamechat" color="deep-orange"></v-switch>
					<v-switch @click="toggleFcHTML" v-model="flamechat_html_render" style="flex: none !important;" label="Flamechat HTML" color="deep-orange"></v-switch>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-btn flat color="deep-orange" href="https://console.firebase.google.com/project/paradigm-a1bc9/overview">Firebase</v-btn>
					<v-btn flat color="deep-purple lighten-1" href="https://app.logrocket.com/uvh8hk/paradigm">LogRocket</v-btn>
					<v-btn flat color="blue" href="https://search.google.com/search-console?resource_id=sc-domain:theparadigmdev.com">Search</v-btn>
					<v-btn flat color="deep-purple lighten-1" router to="/admin/inquiry" @click="$root.terminalOpen = false">Inquiry</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog> -->

		<!-- Site content -->
		<v-content v-if="app_loaded">
			<v-container fluid style="padding: 0;">
				<!-- <router-view v-if="$root.userPresent && !lockdown && !global_pnf && !$root.isBanned"></router-view> -->
				<Home v-if="$root.switch == 'Home' && $root.userPresent && !lockdown && !global_pnf && !$root.isBanned && !shutdown"/>
				<Flamechat v-if="$root.switch == 'Flamechat' && $root.userPresent && !lockdown && !global_pnf && !$root.isBanned && !shutdown"/>
				<Roadmap v-if="$root.switch == 'Roadmap' && $root.userPresent && !lockdown && !global_pnf && !$root.isBanned && !shutdown"/>
				<Terms v-if="$root.switch == 'Terms' && $root.userPresent && !lockdown && !global_pnf && !$root.isBanned && !shutdown"/>
				<Drawer v-if="$root.switch == 'Drawer' && $root.userPresent && !lockdown && !global_pnf && !$root.isBanned && !shutdown"/>
				<Scorecard v-if="$root.switch == 'Scorecard' && $root.userPresent && !lockdown && !global_pnf && !$root.isBanned && !shutdown"/>
				<Support v-if="$root.switch == 'Support' && $root.userPresent && !lockdown && !global_pnf && !$root.isBanned && !shutdown"/>
				<News v-if="$root.switch == 'News' && $root.userPresent && !lockdown && !global_pnf && !$root.isBanned && !shutdown"/>
				<Satellite v-if="$root.switch == 'Satellite' && $root.userPresent && !lockdown && !global_pnf && !$root.isBanned && !shutdown"/>
				<Asteroid v-if="$root.switch == 'Asteroid' && $root.userPresent && !lockdown && !global_pnf && !$root.isBanned && !shutdown"/>
				<NetworkStatus v-if="$root.switch == 'NetworkStatus' && $root.userPresent && !lockdown && !global_pnf && !$root.isBanned && !shutdown"/>
				<LatestMemes v-if="$root.switch == 'LatestMemes' && $root.userPresent && !lockdown && !global_pnf && !$root.isBanned && !shutdown"/>
				<LatestVines v-if="$root.switch == 'LatestVines' && $root.userPresent && !lockdown && !global_pnf && !$root.isBanned && !shutdown"/>
				<Contracts v-if="$root.switch == 'Contracts' && $root.userPresent && !lockdown && !global_pnf && !$root.isBanned && !shutdown"/>
				<Databank v-if="$root.switch == 'Databank' && $root.userPresent && !lockdown && !global_pnf && !$root.isBanned && !shutdown"/>
				<Relay v-if="$root.switch == 'Relay' && $root.userPresent && !lockdown && !global_pnf && !$root.isBanned && !shutdown"/>
				<Media v-if="$root.switch == 'Media' && $root.userPresent && !lockdown && !global_pnf && !$root.isBanned && !shutdown"/>
				<PageNotFound v-if="$root.switch == 'PageNotFound' && $root.userPresent && !lockdown && !global_pnf && !$root.isBanned && !shutdown"/>
				<div class="noUser" v-if="!$root.userPresent &&!lockdown && !global_pnf" style="text-align: center;">
					<h1 class="display-3 deep-purple--text font-weight-thin text-uppercase" style="margin: 100px 0px 25px 0px;">Welcome!</h1>
					<h3 class="headline font-weight-light" style="margin: 25px;">Please login to continue.</h3>
					<v-btn color="deep-purple" @click="dialog = true">Login</v-btn>
				</div>
				<div class="lockdown" v-if="lockdown && !shutdown" style="text-align: center;">
					<v-icon style="font-size: 75px; margin-top: 100px;" color="red">block</v-icon>
					<h1 class="display-3 red--text font-weight-thin text-uppercase" style="margin: 25px 0px 25px 0px;">Nope.</h1>
					<h3 class="headline font-weight-light" style="margin: 25px;">Entry is not permitted.</h3>
				</div>
				<div class="banned" v-if="$root.isBanned && !lockdown && !global_pnf && !shutdown" style="text-align: center;">
					<v-icon style="font-size: 75px; margin-top: 100px;" color="red">block</v-icon>
					<h1 class="display-3 red--text font-weight-thin text-uppercase" style="margin: 25px 0px 25px 0px;">Sorry!</h1>
					<h3 class="headline font-weight-light" style="margin: 25px;">But, you've been banned.</h3>
				</div>
				<div class="global_pnf" v-if="global_pnf && !lockdown && !shutdown" style="text-align: center;">
					<v-icon style="font-size: 75px; margin-top: 100px;" color="deep-purple darken-3">warning</v-icon>
					<h1 class="display-3 deep-purple--text darken-3 font-weight-thin text-uppercase" style="margin: 25px 0px 25px 0px;">404</h1>
					<h3 class="headline font-weight-light" style="margin: 25px;">Page not found.<br>There is probably an issue with the server.</h3>
				</div>
				<div class="global_pnf" v-if="shutdown" style="text-align: center;">
					<v-icon style="font-size: 75px; margin-top: 100px;" color="black">highlight_off</v-icon>
					<h1 class="display-3 black--text font-weight-thin text-uppercase" style="margin: 25px 0px 25px 0px;">Shutdown</h1>
					<h3 class="headline font-weight-light grey--text darken-4" style="margin: 25px;">Paradigm has been shut down.</h3>
				</div>
			</v-container>
			<v-progress-linear :indeterminate="true" v-if="$root.loadingBar" class="loading-bar"></v-progress-linear>
		</v-content>

		<!-- Snackbar -->
		<v-snackbar v-model="$root.snackbar" bottom left :timeout="2000">{{ $root.feedback }}</v-snackbar>

		<!-- Footer -->
		<v-footer v-if="!shutdown">
			<div><span class="pl-2" style="text-align: center;">&copy; {{ new Date().getFullYear() }} Paradigm</span></div>
		</v-footer>
	</v-app>
</template>

<script>
import { db, perf, auth } from './firebase'
import firebase from 'firebase/app'
import moment from 'moment'
import { Swatches } from 'vue-color'

// ------------------------------

import Home from './views/Home'
import Flamechat from './views/Flamechat'
import Roadmap from './views/Company/Roadmap'
import Terms from './views/Company/Terms'
import Drawer from './views/Drawer'
import Scorecard from './views/Scorecard'
import Support from './views/Company/Support'
import News from './views/News'
import Satellite from './views/Satellite'
import Asteroid from './views/Asteroid'
import NetworkStatus from './views/Company/NetworkStatus'
import LatestMemes from './views/Latest/Memes'
import LatestVines from './views/Latest/Vines'
import Contracts from './views/Devs/Contracts'
import Databank from './views/Devs/Databank'
import Relay from './views/Devs/Relay'
import About from './views/Company/About'
import Media from './views/Media'
import PageNotFound from './views/404'
import Terminal from './components/Terminal'

export default {
	name: 'Paradigm',
	components: {
		Swatches, Home, Flamechat, Roadmap, Terms, Drawer, Scorecard, Support, News, Satellite, Asteroid, NetworkStatus, LatestMemes,
		LatestVines, Contracts, Databank, Relay, Media, PageNotFound, Terminal
	},
	data() {
		return {
			drawer: false,
			apps: [
				{ text: 'Chat with a friend', route: 'Flamechat', app: 'Flamechat' },
				{ text: 'Read the news', route: 'News', app: 'The Paradox' },
				{ text: 'Browse the Internet', route: 'Satellite', app: 'Satellite' },
				{ text: 'Paradigm premium subscription', route: 'Asteroid', app: 'Asteroid' },
				{ text: 'See the latest scores', route: 'Scorecard', app: 'Scorecard' },
				{ text: 'Store your files', route: 'Drawer', app: 'Drawer' },
				{ text: 'Books, movies, music, and TV shows', route: 'Media', app: 'Media' },
			],
			company: [
				{ text: 'Get some help', route: 'Support', app: 'Support' },
				{ text: 'What&#39s coming soon', route: 'Roadmap', app: 'Roadmap' },
				{ text: 'Read it', route: 'Terms', app: 'Terms of Use, Service, and Privacy Policy' },
				{ text: 'Company status', route: 'NetworkStatus', app: 'Network Status' },
			],
			latest: [
				{ text: 'Have a laugh', route: 'LatestMemes', app: 'Latest Memes' },
			],
			developers: [
				{ text: 'Have us build you a website', route: 'Contracts', app: 'Contracting' },
				{ text: 'Host your website', route: 'Relay', app: 'Relay' },
				{ text: 'Add a database to your website', route: 'Databank', app: 'Databank' },
			],
			password: '',
			dialog: false,
			userInfo: null,
			newPassword: null,
			sign_up_enable: null,
			terms: false,
			deleteDialog: false,
			lockdown: null,
			flamechat_enable: true,
			global_pnf: null,
			flamechat_html_render: true,
			newPasswordDialog: false,
			newColorDialog: false,
			newBioDialog: false,
			currentTime: '',
			currentDate: '',
			app_loaded: false,
			shutdown: false,
		}
	},
	methods: {
		refresh() {
			location.reload()
		},
		signIn() {
			if(this.$root.username && this.password) {
				perf.trace('signIn').start()
				auth.signInWithEmailAndPassword(this.$root.username + '@theparadigmdev.com', this.password).then(() => {
					this.dialog = false
					db.collection('users').doc(this.$root.username).update({ isLoggedIn: true })
					perf.trace('signIn').stop()
				}).catch(error => {
					if(error.code == 'auth/invalid-email') {
						this.$root.feedback = 'Do not use spaces or characters disallowed in an email address.'
						this.$root.snackbar = true
					}
					if(error.code == 'auth/wrong-password') {
						this.$root.feedback = 'Please check your password.'
						this.$root.snackbar = true
					}
					if(error.code == 'auth/invalid-email' || 'auth/wrong-password') {
						this.$root.feedback = error.message
						this.$root.snackbar = true
					}
				})
			} else {
				this.$root.feedback = 'Please fill in the required fields.'
				this.$root.snackbar = true
			}
		},
		signUp() {
			if(this.$root.username && this.password && this.terms && this.$root.accountBio && this.$root.accountColor) {
				auth.createUserWithEmailAndPassword(this.$root.username + '@theparadigmdev.com', this.password).then(user => {
					this.$root.uid = user.user.uid
				}).catch(error => {
					if(error.code == 'auth/invalid-email') {
						this.$root.feedback = 'Do not use spaces or characters disallowed in an email address.'
						this.$root.snackbar = true
					}
					if(error.code == 'auth/wrong-password') {
						this.$root.feedback = 'Please check your password.'
						this.$root.snackbar = true
					}
					if(error.code != 'auth/invalid-email' || 'auth/wrong-password') {
						this.$root.feedback = error.message
						this.$root.snackbar = true
					}
				})
				db.collection('users').doc(this.$root.username).set({
					bio: this.$root.accountBio,
					color: this.$root.accountColor.hex,
					moonrocks: 0,
					isAdmin: false,
					isInnerCore: false,
					isAsteroid: false,
					isAnalytics: false,
					uid: this.$root.uid,
					isBanned: false,
					strikes: 0,
					isWriter: false,
					isLoggedIn: true
				})
				this.$root.accountColor = this.$root.accountColor.hex
				this.$ga.event(this.$root.username, 'signed up')
			} else {
				this.$root.feedback = 'Please fill in the required fields.'
				this.$root.snackbar = true
			}
		},
		signOut() {
			perf.trace('signOut').start()
			auth.signOut().then(() => {
				db.collection('users').doc(this.$root.username).update({ isLoggedIn: false })
				this.$root.feedback = 'Signed out successfully.'
				this.$root.snackbar = true
				this.$ga.event(this.$root.username, 'signed out')
				perf.trace('signOut').stop()
			})
		},
		changePass() {
			auth.currentUser.updatePassword(this.newPassword).then(() => {
				// Update successful.
				this.newPasswordDialog = false,
				this.$root.feedback = 'Password changed successfully.'
				this.$root.snackbar = true
				this.$ga.event(this.$root.username, 'changed their password')
			}).catch(error => {
				// An error happened.
				this.$root.feedback = 'Password changed unsuccessfully.'
				this.$root.snackbar = true
			})
			this.newPassword = null
		},
		deleteUser() {
			this.$ga.event(this.$root.username, 'deleted their account')
			auth.currentUser.delete().then(() => {
				// User deleted.
				db.collection('users').doc(this.$root.username).delete().then(() => {
					this.$root.username = null
					this.userInfo = null
					this.$root.userPresent = false
				})
				this.$root.feedback = 'Account deleted sucessfully.'
				this.$root.snackbar = true
			}).catch(error => {
				// An error happened.
				console.log(error)
			})
			this.deleteDialog = false
			this.dialog = false
		},
		changeColor(newColor) {
			db.collection('users').doc(this.$root.username).update({
				color: newColor
			}).then(() => {
				this.$root.accountColor = newColor
				this.newColorDialog = false
				this.$ga.event(this.$root.username, 'changed their color to ' + this.$root.accountColor)
			})
		},
		changeBio(newBio) {
			db.collection('users').doc(this.$root.username).update({
				bio: newBio
			}).then(() => {
				this.accountBio = newBio
				this.newBioDialog = false
				this.$ga.event(this.$root.username, 'changed their bio to ' + this.$root.accountBio)
			})
		},
		startTime() {
			var today = new Date()
			this.currentDate = moment(today).format('MMMM Do YYYY')
			this.currentTime = moment(today).format('LTS')
			setTimeout(this.startTime, 500)
		},
	},
	created() {
		this.app_loaded = false
		auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
		this.$root.loadingBar = true
		auth.onAuthStateChanged(firebaseUser => {
			this.app_loaded = true
			if(firebaseUser) {
				this.$root.feedback = 'Signed in successfully.'
				this.$root.snackbar = true
				this.$root.userPresent = true
				this.$root.username = firebaseUser.email.substring(0, firebaseUser.email.lastIndexOf("@"))
				this.userInfo = firebaseUser
				this.$ga.event(this.$root.username, 'signed in')

				var usersRef = db.collection('users')
				usersRef.doc(this.$root.username).get().then(doc => {
					this.$root.accountBio = doc.data().bio
					this.$root.accountColor = doc.data().color
					this.$root.moonrocks = doc.data().moonrocks
					this.$root.isAdmin = doc.data().isAdmin
					this.$root.isInnerCore = doc.data().isInnerCore
					this.$root.isAnalytics = doc.data().isAnalytics
					this.$root.isAsteroid = doc.data().isAsteroid
					this.$root.isBanned = doc.data().isBanned
					this.$root.strikes = doc.data().strikes
					this.$root.isWriter = doc.data().isWriter
					if (doc.data().strikes >= 3) {
						this.$root.isBanned = true
						if (db.collection('users').doc(this.$root.username).get().then(doc => doc.data().isBanned)) {
							db.collection('users').doc(this.$root.username).update({ isBanned: true })
						}
					} else {
						db.collection('users').doc(this.$root.username).update({ isBanned: false })
					}
				})

				usersRef.onSnapshot(snapshot => {
					snapshot.docChanges().forEach(change => {
						if(change.type === "modified" && change.doc.id == this.$root.username) {
							let doc = change.doc
							this.$root.accountBio = doc.data().bio
							this.$root.accountColor = doc.data().color
							this.$root.moonrocks = doc.data().moonrocks
							this.$root.isAdmin = doc.data().isAdmin
							this.$root.isInnerCore = doc.data().isInnerCore
							this.$root.isAnalytics = doc.data().isAnalytics
							this.$root.isAsteroid = doc.data().isAsteroid
							this.$root.isBanned = doc.data().isBanned
							this.$root.strikes = doc.data().strikes
							this.$root.isWriter = doc.data().isWriter
							if (doc.data().strikes >= 3) {
								this.$root.isBanned = true
								if (db.collection('users').doc(this.$root.username).get().then(doc => doc.data().isBanned)) {
									db.collection('users').doc(this.$root.username).update({ isBanned: true })
								}
							}
						}
					})
				})
			} else {
				this.$root.userPresent = false
				this.$root.username = ''
				this.password = ''
				this.$root.accountBio = ''
				this.terms = false
			}
		})

		var metaRef = db.collection('paradigm')
		metaRef.doc('config').get().then((doc) => {
			this.sign_up_enable = doc.data().sign_up_enable
			this.lockdown = doc.data().lockdown
			this.shutdown = doc.data().shutdown
			this.flamechat_enable = doc.data().flamechat_enable,
			this.global_pnf = doc.data().global_pnf,
			this.flamechat_html_render = doc.data().flamechat_html_render
		})

		metaRef.onSnapshot(snapshot => {
			snapshot.docChanges().forEach(change => {
				if(change.type === "modified") {
					let doc = change.doc
					this.sign_up_enable = doc.data().sign_up_enable
					this.lockdown = doc.data().lockdown
					this.shutdown = doc.data().shutdown
					this.flamechat_enable = doc.data().flamechat_enable,
					this.global_pnf = doc.data().global_pnf,
					this.flamechat_html_render = doc.data().flamechat_html_render
				}

				if (this.lockdown || this.global_pnf || this.shutdown) {
					this.newBioDialog = false
					this.newColorDialog = false
					this.newPasswordDialog = false
					this.deleteDialog = false
					this.dialog = false
				}
			})
		})
		this.startTime()
		this.$root.loadingBar = false
	}
}
</script>

<style>
html {
	overflow-y: auto;
	-webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
	-moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
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
	background: linear-gradient(135deg, #162fa1 0%, #50336e 100%);
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

.loading-bar {
	position: absolute;
	bottom: -14px;
}

.clock {
	margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
	text-align: center;
}

.logo {
	margin: 0;
  position: absolute;
  top: 50%;
  left: 150px;
  transform: translate(-50%, -50%);
}

.logo-nouser {
	margin: 0;
  position: absolute;
  top: 50%;
  left: 110px;
  transform: translate(-50%, -50%);
}

.logo-sm {
	margin: 0;
  position: absolute;
  top: 47%;
  left: 80px;
  transform: translate(-50%, -50%);
}

.logo-sm-nouser {
	margin: 0;
  position: absolute;
  top: 47%;
  left: 40px;
  transform: translate(-50%, -50%);
}
</style>
