<template>
	<v-app class="hidden-print-only">
    <!-- Toolbar -->
		<v-app-bar app :class="{ 'toolbar-no-ld': !lockdown && !shutdown, 'red': lockdown && !shutdown, 'black': shutdown }" v-if="app_loaded">
			<v-app-bar-nav-icon @click="drawer = !drawer" v-if="$root.userPresent && !lockdown && !global_pnf && !$root.isBanned" style="margin: 0px;"><v-icon>menu</v-icon></v-app-bar-nav-icon>
			<v-toolbar-title>
				<img @click="$root.switch = 'Home'" style="height: 45px; cursor: pointer;" src="./assets/paradigmlogo.png" :class="{ 'logo': $root.userPresent, 'logo-nouser': !$root.userPresent, 'hidden-xs-only': $root.accountColor }">
				<img @click="$root.switch = 'Home'" style="height: 45px; cursor: pointer;" src="./assets/plogo.png" :class="{ 'logo-sm': $root.userPresent, 'logo-sm-nouser': !$root.userPresent, 'hidden-sm-and-up': $root.accountColor }">
			</v-toolbar-title>
			<v-spacer></v-spacer>
      <p v-if="app_loaded && !shutdown" class="clock text-xs-right font-weight-light hidden-xs-only">{{ currentDate }}<br>{{ currentTime }}</p>
		</v-app-bar>

		<!-- Navigation drawer -->
		<v-navigation-drawer v-model="drawer" app>
			<template v-slot:prepend>
				<v-card-actions class="grey darken-4 elevation-4 ma-0 pa-0">
					<v-tooltip bottom open-delay="1000">
						<template v-slot:activator="{ on }">
							<v-list-item v-on="on" two-line v-ripple="{ class: `${$root.accountColor}--text` }" style="cursor: pointer;" @click="$root.account_dialog = true">
								<v-list-item-avatar class="my-0">
									<img :src="$root.accountPic">
								</v-list-item-avatar>
								<v-list-item-content style="position: relative; left: -14px;">
									<v-list-item-title class="text-uppercase font-weight-medium" :style="{ 'color': $root.accountColor }">{{ $root.username }}</v-list-item-title>
									<v-list-item-subtitle>Logged in</v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>
						</template>
						<span>Account</span>
					</v-tooltip>
					<v-spacer></v-spacer>
					<v-tooltip bottom open-delay="1000">
						<template v-slot:activator="{ on }">
							<v-btn v-on="on" v-if="$root.isAdmin" @click="$root.terminalOpen = true" icon class="mx-3" color="grey"><v-icon>mdi-console-line</v-icon></v-btn>
						</template>
						<span>Terminal</span>
					</v-tooltip>
				</v-card-actions>
			</template>

			<v-list dense nav>
				<v-list-item @click="$root.switch = 'Home'">
					<v-list-item-icon>
            <v-icon>home</v-icon>
          </v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>Home</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
        <v-list-item v-for="link in apps" :key="link.route" link @click="$root.switch = `${link.route}`">
					<v-list-item-icon>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ link.app }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
				<v-divider></v-divider>
				<v-list-group>
          <template v-slot:activator>
						<v-list-item-icon>
							<v-icon>mdi-domain</v-icon>
						</v-list-item-icon>
            <v-list-item>
              <v-list-item-title style="position: relative; left: -8px;">Company</v-list-item-title>
            </v-list-item>
          </template>

					<v-list-item v-for="link in company" :key="link.route" link @click="$root.switch = `${link.route}`">
						<v-list-item-content>
							<v-list-item-title>{{ link.app }}</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</v-list-group>
				<v-list-group>
          <template v-slot:activator>
            <v-list-item-icon>
							<v-icon>mdi-history</v-icon>
						</v-list-item-icon>
            <v-list-item>
              <v-list-item-title style="position: relative; left: -8px;">Latest</v-list-item-title>
            </v-list-item>
          </template>

					<v-list-item v-for="link in latest" :key="link.route" link @click="$root.switch = `${link.route}`">
						<v-list-item-content>
							<v-list-item-title>{{ link.app }}</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</v-list-group>
				<v-list-group>
          <template v-slot:activator>
            <v-list-item-icon>
							<v-icon>mdi-code-tags</v-icon>
						</v-list-item-icon>
            <v-list-item>
              <v-list-item-title style="position: relative; left: -8px;">Developers</v-list-item-title>
            </v-list-item>
          </template>

					<v-list-item v-for="link in developers" :key="link.route" link @click="$root.switch = `${link.route}`">
						<v-list-item-content>
							<v-list-item-title>{{ link.app }}</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</v-list-group>
      </v-list>
			<template v-slot:append>
				<div class="grey darken-4 elevation-14">
					<v-divider></v-divider>
					<v-tooltip top open-delay="1000">
						<template v-slot:activator="{ on }">
							<v-btn v-on="on" class="ma-2" icon color="#7289DA" href="https://discord.gg/cA9dpRM">
								<v-icon>mdi-discord</v-icon>
							</v-btn>
						</template>
						<span>Discord</span>
					</v-tooltip>
					<v-tooltip top open-delay="1000">
						<template v-slot:activator="{ on }">
							<v-btn v-on="on" class="my-2 mr-2" icon color="grey darken-1" href="https://github.com/Paradigm-Dev">
								<v-icon>mdi-github-circle</v-icon>
							</v-btn>
						</template>
						<span>Github</span>
					</v-tooltip>
					<v-tooltip top open-delay="1000">
						<template v-slot:activator="{ on }">
							<v-btn v-on="on" class="my-2 mr-2" icon color="#7CA5C6" href="https://relay.theparadigmdev.com">
								<v-icon>mdi-server-network</v-icon>
							</v-btn>
						</template>
						<span>Relay</span>
					</v-tooltip>
					<v-tooltip top open-delay="1000">
						<template v-slot:activator="{ on }">
							<v-btn v-on="on" class="my-2 mr-2" icon color="red" @click="$root.switch = 'Support'">
								<v-icon>mdi-lifebuoy</v-icon>
							</v-btn>
						</template>
						<span>Support</span>
					</v-tooltip>
					<v-tooltip top open-delay="1000">
						<template v-slot:activator="{ on }">
							<v-btn v-on="on" class="my-2 mr-2" icon color="lime" @click="$root.bugreport_dialog = true">
								<v-icon>mdi-bug</v-icon>
							</v-btn>
						</template>
						<span>Report a bug</span>
					</v-tooltip>
				</div>
      </template>
    </v-navigation-drawer>

		<!-- Account dialog -->
		<v-dialog v-model="$root.account_dialog" max-width="530px">
			<v-card>
				<v-list-item v-if="$root.userPresent">
					<v-list-item-avatar>
						<img :src="$root.accountPic">
					</v-list-item-avatar>
					<v-list-item-content style="position: relative; left: -10px;">
						<v-list-item-title class="headline font-weight-medium text-uppercase" :style="{ 'color': $root.accountColor }">{{ $root.username }}</v-list-item-title>
						<v-list-item-subtitle>{{ $root.accountBio }}</v-list-item-subtitle>
					</v-list-item-content>
					<v-btn icon @click="$root.account_dialog = false" class="dialog-close-btn">
						<v-icon>close</v-icon>
					</v-btn>
				</v-list-item>
				<v-card-title primary-title v-if="!$root.userPresent">
					<h3 class="headline mb-0">Account</h3>
					<v-spacer></v-spacer>
					<v-btn icon @click="$root.account_dialog = false" class="dialog-close-btn">
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
								<v-btn @click="signIn" color="accent" text>Sign In</v-btn>
							</v-form>
						</v-tab-item>
						<v-tab>Sign Up</v-tab>
						<v-tab-item>
							<Signup />
						</v-tab-item>
					</v-tabs>

					<v-form v-if="!$root.userPresent && !sign_up_enable">
						<v-text-field clearable autocomplete="off" type="text" name="username" v-model="$root.username" label="Username"></v-text-field>
						<v-text-field clearable autocomplete="off" type="password" name="password" v-model="password" label="Password"></v-text-field>
					</v-form>

					<div v-if="$root.userPresent">
						<p><strong>Last Sign In:</strong> {{ userInfo.metadata.lastSignInTime }}</p>
						<p><strong>Account Creation:</strong> {{ userInfo.metadata.creationTime }}</p>
						<p><strong>User ID:</strong> {{ userInfo.uid }}</p>
						<img src="./assets/moonrocks.png" alt="Moonrocks" class="moonrock-img"><span class="moonrock-count font-weight-medium">{{ $root.moonrocks }}</span>
						<v-divider></v-divider>
						<div class="pt-2">
							<v-btn @click="newBioDialog = true" text color="accent">Edit Bio</v-btn>
							<v-btn @click="newColorDialog = true" text color="accent">Edit Color</v-btn>
							<v-btn @click="changePicDialog = true" text color="accent">Change Picture</v-btn>
							<v-btn @click="newPasswordDialog = true" text color="warning">New Password</v-btn>
							<v-btn @click="deleteDialog = true" text color="error">Delete Account</v-btn>
						</div>
					</div>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-btn v-if="!$root.userPresent && !sign_up_enable" @click="signIn" color="accent" text>Sign In</v-btn>
					<v-btn v-if="$root.userPresent" @click="signOut" color="accent" text>Sign Out</v-btn>
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
					<v-btn @click="deleteUser" color="error" text>Yes</v-btn>
					<v-btn @click="deleteDialog = false" color="green" text>Cancel</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- New password dialog -->
		<v-dialog v-model="newPasswordDialog" max-width="400">
			<v-card>
				<v-card-title><h3 class="headline mb-0">New Password</h3></v-card-title>
				<v-card-text>
					<v-text-field autocomplete="off" type="password" name="newPassword" v-model="newPassword" label="New Password"></v-text-field>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-btn @click="changePass" color="warning" text>Save</v-btn>
					<v-btn @click="newPasswordDialog = false" text color="accent">Cancel</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- New color dialog -->
		<v-dialog v-model="newColorDialog" max-width="335">
			<v-card>
				<v-card-title><h3 class="headline mb-0">Edit Color</h3></v-card-title>
				<v-card-text>
					<v-layout justify-center>
						<v-color-picker mode="hexa" hide-mode-switch style="background-color: #2E2E2E;" v-model="$root.accountColor"></v-color-picker>
					</v-layout>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-btn @click="changeColor($root.accountColor)" color="warning" text>Save</v-btn>
					<v-btn @click="newColorDialog = false" text color="accent">Cancel</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- Change pic dialog -->
		<v-dialog v-model="changePicDialog" max-width="530px">
			<v-card>
				<v-card-title><h3 class="headline mb-0">Change Profile Pic</h3></v-card-title>
				<v-card-text>
					<v-container fluid>
						<v-layout row wrap>
							<v-flex v-for="pic in $root.avail_profile_pics" :key="pic" xs4>
								<v-card @click="change_pic == pic ? change_pic = null : change_pic = pic" v-ripple flat tile>
									<v-img :src="`https://relay.theparadigmdev.com/profile-pics/${pic}.jpg`" width="150px" height="150px"></v-img>
									<v-fade-transition>
										<v-overlay v-if="change_pic == pic" absolute color="grey">
											<v-icon>check</v-icon>
										</v-overlay>
									</v-fade-transition>
								</v-card>
							</v-flex>
						</v-layout>
					</v-container>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-btn @click="changePic(change_pic)" color="warning" text>Save</v-btn>
					<v-btn @click="changePicDialog = false" text color="accent">Cancel</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- New bio dialog -->
		<v-dialog v-model="newBioDialog" max-width="400">
			<v-card>
				<v-card-title><h3 class="headline mb-0">Edit Bio</h3></v-card-title>
				<v-card-text>
					<v-text-field autocomplete="off" type="text" name="bio" v-model="$root.accountBio" label="Bio"></v-text-field>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-btn @click="changeBio($root.accountBio)" color="warning" text>Save</v-btn>
					<v-btn @click="newBioDialog = false" text color="accent">Cancel</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- Account dialog -->
		<v-dialog v-model="$root.bugreport_dialog" max-width="500">
			<BugReport />
		</v-dialog>

		<!-- Admin terminal -->
		<v-bottom-sheet v-model="$root.terminalOpen">
			<Terminal />
    </v-bottom-sheet>

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
				<Weather v-if="$root.switch == 'Weather' && $root.userPresent && !lockdown && !global_pnf && !$root.isBanned && !shutdown"/>
				<Notice v-if="$root.switch == 'Notice' && $root.userPresent && !lockdown && !global_pnf && !$root.isBanned && !shutdown"/>
				<PageNotFound v-if="$root.switch == 'PageNotFound' && $root.userPresent && !lockdown && !global_pnf && !$root.isBanned && !shutdown"/>
				<div class="noUser" v-if="!$root.userPresent &&!lockdown && !global_pnf" style="text-align: center;">
					<h1 class="display-3 deep-purple--text font-weight-thin text-uppercase" style="margin: 100px 0px 25px 0px;">Welcome!</h1>
					<h3 class="headline font-weight-light" style="margin: 25px;">Please login to continue.</h3>
					<v-btn color="deep-purple" @click="$root.account_dialog = true">Login</v-btn>
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
		</v-content>

		<!-- Snackbar -->
		<v-snackbar v-model="$root.snackbar" bottom right :timeout="2000">{{ $root.feedback }}</v-snackbar>

		<!-- Footer -->
		<v-footer app inset v-if="!shutdown && app_loaded">
			<v-progress-linear :active="$root.loadingBar" indeterminate absolute top color="deep-purple accent-4"></v-progress-linear>
			<span class="caption text-uppercase">&copy; {{ new Date().getFullYear() }} Paradigm</span>
		</v-footer>

		<p class="hidden-screen-only" style="margin: auto auto auto auto;">Paradigm cannot be printed!</p>
	</v-app>
</template>

<script>
import { db, perf, auth, msg } from './firebase'
import firebase from 'firebase/app'
import moment from 'moment'
import Signup from './components/Signup'
import BugReport from './components/BugReport'

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
import Weather from './views/Weather'
import Notice from './views/Company/Notice'

export default {
	name: 'Paradigm',
	components: {
		Home, Flamechat, Roadmap, Terms, Drawer, Scorecard, Support, News, Satellite, Asteroid, NetworkStatus, LatestMemes,
		LatestVines, Contracts, Databank, Relay, Media, PageNotFound, Terminal, Weather, Notice, Signup, BugReport
	},
	data() {
		return {
			drawer: false,
			apps: [
				{ icon: 'mdi-message', route: 'Flamechat', app: 'Flamechat' },
				{ icon: 'mdi-newspaper', route: 'News', app: 'The Paradox' },
				{ icon: 'mdi-web', route: 'Satellite', app: 'Satellite' },
				{ icon: 'mdi-professional-hexagon', route: 'Asteroid', app: 'Asteroid' },
				{ icon: 'mdi-counter', route: 'Scorecard', app: 'Scorecard' },
				{ icon: 'mdi-folder-multiple', route: 'Drawer', app: 'Drawer' },
				{ icon: 'mdi-play-network', route: 'Media', app: 'Media' },
				{ icon: 'mdi-weather-pouring', route: 'Weather', app: 'Weather' },
			],
			company: [
				{ route: 'Roadmap', app: 'Roadmap' },
				{ route: 'Terms', app: 'Terms of Use, Service, and Privacy Policy' },
				{ route: 'NetworkStatus', app: 'Network Status' },
			],
			latest: [
				{ route: 'LatestMemes', app: 'Memes' },
			],
			developers: [
				{ route: 'Contracts', app: 'Contracting' },
				{ route: 'Relay', app: 'Relay' },
				{ route: 'Databank', app: 'Databank' },
			],
			password: '',
			userInfo: null,
			newPassword: null,
			sign_up_enable: null,
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
			shutdown: null,
			changePicDialog: false,
			avail_profile_pics: ['paradigm', 'barn-owl', 'chipmunk', 'dart-frog', 'deer', 'giraffe', 'hedgehog', 'hermit-crab', 'panther', 'polar-bear', 'sea-lion', 'sting-ray'],
			change_pic: ''
		}
	},
	methods: {
		signIn() {
			if(this.$root.username && this.password) {
				perf.trace('signIn').start()
				auth.signInWithEmailAndPassword(this.$root.username + '@theparadigmdev.com', this.password).then(() => {
					this.$root.account_dialog = false
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
			db.collection('users').doc(this.$root.username).delete().then(() => {
				this.$root.username = null
				this.userInfo = null
				this.$root.userPresent = false
				auth.currentUser.delete().then(() => {
					this.$root.feedback = 'Account deleted sucessfully.'
					this.$root.snackbar = true
				}).catch(error => {
					// An error happened.
					console.log(error)
				})
			})
			this.$ga.event(this.$root.username, 'deleted their account')
			this.deleteDialog = false
			this.$root.account_dialog = false
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
		changePic(newPic) {
			db.collection('users').doc(this.$root.username).update({
				pic: newPic
			}).then(() => {
				this.$root.accountPic = `https://relay.theparadigmdev.com/profile-pics/${newPic}.jpg`
				this.changePicDialog = false
				this.change_pic = ''
				this.$ga.event(this.$root.username, 'changed their pic to ' + this.$root.accountPic)
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
			this.currentDate = moment(today).format('MMMM Do, YYYY')
			this.currentTime = moment(today).format('LTS')
			setTimeout(this.startTime, 500)
		},
		requestNotificationsPermissions() {
			console.log('Requesting notifications permission...');
			Notification.requestPermission().then(() => {
				// Notification permission granted.
				this.saveMessagingDeviceToken();
			}).catch(error => {
				console.error('Unable to get permission to notify.', error);
			});
		},
		saveMessagingDeviceToken() {
			msg.getToken().then(currentToken => {
				if (currentToken) {
					console.log('Got FCM device token:', currentToken)
					// Saving the Device Token to the datastore.
					db.collection('paradigm').doc('fcm_keys').update({
						values: firebase.firestore.FieldValue.arrayUnion(currentToken)
					})
				} else {
					// Need to request permissions to show notifications.
					this.requestNotificationsPermissions()
				}
			}).catch(error => {
				console.error('Unable to get messaging token.', error)
			})
		}
	},
	created() {
		this.app_loaded = false
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
					this.$root.accountPic = 'https://relay.theparadigmdev.com/profile-pics/' + doc.data().pic + '.jpg'
					if (doc.data().strikes >= 3) {
						this.$root.isBanned = true
						db.collection('users').doc(this.$root.username).update({ isBanned: true })
					} else {
						this.$root.isBanned = false
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
							this.$root.accountPic = 'https://relay.theparadigmdev.com/profile-pics/' + doc.data().pic + '.jpg'
							if (doc.data().strikes >= 3) {
								this.$root.isBanned = true
								db.collection('users').doc(this.$root.username).update({ isBanned: true })
							} else {
								this.$root.isBanned = false
								db.collection('users').doc(this.$root.username).update({ isBanned: false })
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
				this.drawer = false
				this.$root.terminalOpen = false
			}
		})

		var metaRef = db.collection('paradigm')
		metaRef.onSnapshot(snapshot => {
			snapshot.docChanges().forEach(change => {
				if(change.type === "modified") {
					let doc = change.doc
					this.sign_up_enable = doc.data().sign_up_enable
					this.lockdown = doc.data().lockdown
					this.shutdown = doc.data().shutdown
					this.flamechat_enable = doc.data().flamechat_enable
					this.global_pnf = doc.data().global_pnf
					this.flamechat_html_render = doc.data().flamechat_html_render
				}

				if(change.type === "added") {
					let doc = change.doc
					this.sign_up_enable = doc.data().sign_up_enable
					this.lockdown = doc.data().lockdown
					this.shutdown = doc.data().shutdown
					this.flamechat_enable = doc.data().flamechat_enable
					this.global_pnf = doc.data().global_pnf
					this.flamechat_html_render = doc.data().flamechat_html_render
				}

				if (this.lockdown || this.global_pnf || this.shutdown) {
					this.newBioDialog = false
					this.newColorDialog = false
					this.newPasswordDialog = false
					this.deleteDialog = false
					this.$root.account_dialog = false
				}
			})
		})
		this.requestNotificationsPermissions()
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

.moonrock-img {
	height: 50px;
	margin-bottom: 16px;
}

.moonrock-count {
	position: relative;
	bottom: +36px;
	padding-left: 5px;
}

.clock {
	margin: 0;
  top: 50%;
	text-align: right;
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
