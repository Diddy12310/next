<template>
  <v-app style="overflow: auto;">
		<v-app-bar app style="background: linear-gradient(135deg, #162fa1 0%, #50336e 100%); z-index: 100;" v-if="$root.user">
			<v-app-bar-nav-icon v-if="!$root.user.banned" @click="$root.drawer = !$root.drawer"><v-icon>mdi-menu</v-icon></v-app-bar-nav-icon>
			<v-toolbar-title>
				<img :class="{ 'true': $root.user, 'false': $root.user.banned }" @click="$root.user ? $root.router = 'home' : $root.router = 'auth'" style="height: 45px; cursor: pointer;" src="./assets/paradigmlogo.png" class="logo">
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn text icon v-if="$root.music.playing" class="mr-2"><v-icon>mdi-music-note</v-icon></v-btn>
			<p class="clock text-right font-weight-light hidden-xs-only">{{ clock.date }}<br>{{ clock.time }}</p>
		</v-app-bar>

		<v-navigation-drawer v-if="$root.user && !$root.user.banned && !$root.config.shutdown" app v-model="$root.drawer" style="z-index: 1000;">
			<template v-slot:prepend>
				<v-card-actions class="grey darken-4 elevation-4 ma-0 pa-0">
					<v-list shaped>
						<v-tooltip bottom open-delay="1000">
							<template v-slot:activator="{ on }">
								<v-list-item @click="$root.router = 'account'" :input-value="$root.router == 'account'" value="account" v-on="on" two-line v-ripple="{ class: `${$root.user.color}--text` }" class="my-n2" style="cursor: pointer;">
									<v-list-item-avatar class="my-0">
										<img :src="$root.user.pic">
									</v-list-item-avatar>
									<v-list-item-content>
										<v-list-item-title class="text-uppercase font-weight-medium" :style="{ 'color': $root.user.color }">{{ $root.user.username }}</v-list-item-title>
										<v-list-item-subtitle>Logged in</v-list-item-subtitle>
									</v-list-item-content>
								</v-list-item>
							</template>
							<span>Account</span>
						</v-tooltip>
					</v-list>

					<v-spacer></v-spacer>

					<v-tooltip bottom open-delay="1000">
						<template v-slot:activator="{ on }">
							<v-btn v-on="on" @click="signOut()" icon color="grey darken-2" class="ml-1"><v-icon>mdi-lock</v-icon></v-btn>
						</template>
						<span>Sign out</span>
					</v-tooltip>

					<v-tooltip bottom open-delay="1000">
						<template v-slot:activator="{ on }">
							<v-btn @click="$root.router = 'terminal'" :input-value="$root.router == 'terminal'" v-on="on" v-if="$root.user.rights.admin === true" icon class="mx-1" color="grey darken-2"><v-icon>mdi-console-line</v-icon></v-btn>
						</template>
						<span>Terminal</span>
					</v-tooltip>
				</v-card-actions>
			</template>

			<v-list dense nav>
				<v-list-item-group mandatory v-model="$root.router">
					<v-list-item value="account" class="d-none">
						<v-list-item-title>Account</v-list-item-title>
					</v-list-item>
					<v-list-item value="terminal" class="d-none" v-if="$root.user.rights.admin">
						<v-list-item-title>Terminal</v-list-item-title>
					</v-list-item>
					<v-list-item value="patriot" class="d-none" v-if="$root.user.rights.patriot">
						<v-list-item-title>Patriot</v-list-item-title>
					</v-list-item>

					<v-list-item v-if="$root.config.router[link.path]" :value="link.path" v-for="link in links" :key="link.path">
						<v-list-item-icon><v-icon>{{ link.icon }}</v-icon></v-list-item-icon>
						<v-list-item-title>{{ link.content }}</v-list-item-title>
					</v-list-item>
				</v-list-item-group>
			</v-list>

			<template v-slot:append>
				<p class="pl-2 ma-0 caption" style="padding-bottom: 5px; cursor: pointer;" @click="window.open(`https://github.com/Paradigm-Dev/paradigm/releases/tag/v${$root.version}`)">v{{ $root.version }}</p>
				<div class="grey darken-4">
					<v-divider></v-divider>
					<v-tooltip top open-delay="1000">
						<template v-slot:activator="{ on }">
							<v-btn small v-on="on" target="_blank" class="ma-2" icon color="#7289DA" href="https://discord.gg/cA9dpRM">
								<v-icon>mdi-discord</v-icon>
							</v-btn>
						</template>
						<span>Discord</span>
					</v-tooltip>
					<v-tooltip top open-delay="1000">
						<template v-slot:activator="{ on }">
							<v-btn small v-on="on" target="_blank" class="my-2 mr-2" icon color="grey darken-1" href="https://github.com/Paradigm-Dev">
								<v-icon>mdi-github</v-icon>
							</v-btn>
						</template>
						<span>GitHub</span>
					</v-tooltip>
					<v-tooltip top open-delay="1000">
						<template v-slot:activator="{ on }">
							<v-btn small v-on="on" class="my-2 mr-2" icon color="red" @click="window.open('mailto:paradigmdevelop@gmail.com')">
								<v-icon>mdi-lifebuoy</v-icon>
							</v-btn>
						</template>
						<span>Support</span>
					</v-tooltip>
					<v-tooltip top open-delay="1000">
						<template v-slot:activator="{ on }">
							<v-btn small v-on="on" class="my-2 mr-2" icon color="lime" @click="window.open('https://github.com/Paradigm-Dev/paradigm/issues/new')">
								<v-icon>mdi-bug</v-icon>
							</v-btn>
						</template>
						<span>Report a bug</span>
					</v-tooltip>
					<v-tooltip top open-delay="1000">
						<template v-slot:activator="{ on }">
							<v-btn small v-on="on" class="my-2 mr-2" icon color="light-blue darken-3" @click="$root.view.terms = true">
								<v-icon>mdi-feather</v-icon>
							</v-btn>
						</template>
						<span>Terms of Service</span>
					</v-tooltip>
					<v-tooltip top open-delay="1000">
						<template v-slot:activator="{ on }">
							<v-btn small v-on="on" class="my-2 mr-2" icon color="grey darken-2" @click="$root.view.quote = true">
								<v-icon>mdi-format-quote-close</v-icon>
							</v-btn>
						</template>
						<span>Here's to the crazy ones...</span>
					</v-tooltip>
				</div>
			</template>

		</v-navigation-drawer>

		<v-snackbar v-model="$root.alert.open" :color="$root.alert.type">
			<span v-html="$root.alert.text"></span>
			<v-btn v-if="$root.alert.btn" icon @click="$root.alert.open = false">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-snackbar>

		<v-content>
			<router v-if="!$root.config.shutdown" />
			<div v-else>
				<h1 class="display-2 font-weight-thin text-uppercase text-center px-12 deep-purple--text text--lighten-1" style="margin-top: 100px;">A Connection Could not be Established</h1>
				<p class="text-center pt-6 title font-weight-light grey--text">Try refreshing your page.</p>
			</div>
		</v-content>

		<v-slide-y-reverse-transition>
			<v-footer app style="z-index: 1001;" class="pa-0" v-show="$root.music.open" v-if="$root.music.playing">
				<music-player style="width: 100vw;" :autoPlay="true" :file="$root.music.file" />
			</v-footer>
		</v-slide-y-reverse-transition>

		<v-dialog v-model="$root.view.terms" fullscreen hide-overlay transition="dialog-bottom-transition" style="z-index: 1000;">
			<v-card>
				<terms />

				<v-btn fab top right fixed color="blue-grey" style="z-index: 100;" @click="$root.view.terms = false"><v-icon>mdi-close</v-icon></v-btn>
			</v-card>
		</v-dialog>

		<v-dialog v-model="$root.view.buggy_dialog" max-width="350">
			<v-card color="red">
				<v-card-title class="title text-center font-weight-medium text-uppercase">Warning</v-card-title>
				<v-card-text>This is experimental software. By continuing, you acknowledge the risk involved. If you have any questions or concerns, please contact support.</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn text color="white" @click="saveBuggyDialog()">Continue</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog fullscreen v-model="$root.view.quote" style="z-index: 1000;">
			<v-card class="quote">
				<v-btn fab fixed top right text @click="$root.view.quote = false"><v-icon>mdi-close</v-icon></v-btn>
			</v-card>
		</v-dialog>

		<!-- <v-snackbar bottom right :timeout="0" v-model="$root.view.corona"><v-icon left color="red">mdi-hospital</v-icon> Get the facts about the COVID-19 outbreak<v-btn text color="red" @click="$root.router = 'corona'">Go<v-icon right>mdi-arrow-right</v-icon></v-btn></v-snackbar> -->
  </v-app>
</template>

<script>
import Router from '@/Router'
import MusicPlayer from '@/components/MusicPlayer.vue'
import Terms from '@/components/Terms.vue'
import moment from 'moment'
import io from 'socket.io-client'

export default {
  name: 'App',
  components: {
    'router': Router,
    'music-player': MusicPlayer,
    'terms': Terms
  },
  data() {
    return {
      links: [
        { icon: 'mdi-home', content: 'Home', path: 'home' },
        { icon: 'mdi-message', content: 'Flamechat', path: 'flamechat' },
        { icon: 'mdi-web', content: 'Satellite', path: 'satellite' },
        { icon: 'mdi-newspaper', content: 'The Paradox', path: 'paradox' },
        { icon: 'mdi-folder-multiple', content: 'Drawer', path: 'drawer' },
        { icon: 'mdi-play', content: 'Media', path: 'media' },
        // { icon: 'mdi-hospital', content: 'Coronavirus', path: 'corona' }
      ],
      clock: {
        date: '',
        time: ''
			},
			window: window
    }
  },
  methods: {
    signOut() {
			if (this.$root.user) {
				this.$http.get(`https://www.theparadigmdev.com/users/signout`).then(() => {
					this.$root.socket.emit('logout', this.$root.user)
					this.$root.user = false
					this.$root.router = 'auth'
					this.$root.view = {
						terms: false,
						buggy_dialog: false
					}
				})
			}
    },
    runClock() {
			var today = new Date()
			this.clock.date = moment(today).format('MMMM Do, YYYY')
			this.clock.time = moment(today).format('LTS')
			setTimeout(this.runClock, 500)
		},
		saveBuggyDialog() {
			document.cookie = 'buggy_dialog=true'
			this.$root.view.buggy_dialog = false
		}
  },
  created() {
    if (this.$root.user == null) this.$root.router = 'auth'
		this.runClock()
		this.$root.socket.on('connect', () => {
			this.$root.socket.on('nuke', () => {
				this.$root.config.shutdown = true
			})
			if (this.$root.user) this.$root.socket.emit('login', this.$root.user)
			this.$root.socket.on('user', data => {
				if (data.strikes != this.$root.user.strikes) this.$notify('warning', `You have ${data.strikes} strikes!`)
				this.$root.user = data
			})
			this.$root.socket.on('logout', () => {
				this.$root.socket.disconnect()
				this.$root.socket = io.connect('https://www.theparadigmdev.com')
			})
			this.$root.socket.on('config', data => this.$root.config = data)
			this.$root.socket.on('kick', username => { if (username == this.$root.user.username) this.signOut() })
			this.$root.socket.on('kill', username => { if (username == this.$root.user.username) window.close() })
			this.$root.socket.on('disconnect', () => {
				this.signOut()
			})
			this.$root.socket.on('connect_error', error => this.signOut())
			this.$root.socket.on('connect_timeout', timeout => this.signOut())
			this.$root.socket.on('reconnect_error', error => this.signOut())
			this.$root.socket.on('reconnect_failed', () => this.signOut())
		})
  }
}
</script>

<style>
html { overflow: hidden !important; }

.logo.true {
	margin: 0;
  position: absolute;
  top: 50%;
  left: 135px;
  transform: translate(-50%, -50%);
}

.logo.false {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 95px;
  transform: translate(-50%, -50%);
}

/* * {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
} */

.clock { margin: 0px !important; }

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track { background: rgb(33, 33, 33); }
::-webkit-scrollbar-thumb { background: rgb(100, 100, 100); }
::-webkit-scrollbar-thumb:hover { background: rgb(60, 60, 60); }
::-webkit-scrollbar-corner { background: rgb(33, 33, 33); }

.centralize {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
	text-align: center;
}

.quote {
	background: url('./assets/quote.jpg');
	background-attachment: fixed;
	background-position: right;
	background-size: auto 100vh;
	background-repeat: no-repeat;
}
</style>