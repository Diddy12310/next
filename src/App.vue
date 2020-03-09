<template>
  <v-app>
    <v-app-bar app style="background: linear-gradient(135deg, #162fa1 0%, #50336e 100%); z-index: 100;">
      <v-app-bar-nav-icon v-if="$root.user" @click="$root.drawer = !$root.drawer"><v-icon>mdi-menu</v-icon></v-app-bar-nav-icon>
      <v-toolbar-title>
        <img :class="{ 'true': $root.user, 'false': !$root.user }" @click="$root.user ? $root.router = 'home' : $root.router = 'auth'" style="height: 45px; cursor: pointer;" src="./assets/paradigmlogo.png" class="logo">
      </v-toolbar-title>
      <v-spacer></v-spacer>
			<v-btn text icon v-if="$root.music.playing" class="mr-2"><v-icon>mdi-music-note</v-icon></v-btn>
      <p class="clock text-right font-weight-light hidden-xs-only">{{ clock.date }}<br>{{ clock.time }}</p>
    </v-app-bar>

    <v-navigation-drawer v-if="$root.user" app v-model="$root.drawer" style="z-index: 1000;">
      <template v-slot:prepend>
				<v-card-actions class="grey darken-4 elevation-4 ma-0 pa-0">
					<v-list shaped>
						<v-tooltip bottom open-delay="1000">
							<template v-slot:activator="{ on }">
								<v-list-item @click="$root.router = 'account'" v-model="$root.router == 'account'" value="account" v-on="on" two-line v-ripple="{ class: `${$root.user.color}--text` }" class="my-n2" style="cursor: pointer;">
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
							<v-btn @click="$root.router = 'terminal'" v-model="$root.router == 'terminal'" v-on="on" v-if="$root.user.rights.admin === true" icon class="mx-1" color="grey darken-2"><v-icon>mdi-console-line</v-icon></v-btn>
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

          <v-list-item v-if="$root.config.router[link.path]" :value="link.path" v-for="link in links" :key="link.path">
            <v-list-item-icon><v-icon>{{ link.icon }}</v-icon></v-list-item-icon>
            <v-list-item-title>{{ link.content }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <template v-slot:append>
				<p class="pl-2 ma-0 caption" style="padding-bottom: 5px;">v{{ $root.config.version }}</p>
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
								<v-icon>mdi-github-circle</v-icon>
							</v-btn>
						</template>
						<span>GitHub</span>
					</v-tooltip>
					<v-tooltip top open-delay="1000">
						<template v-slot:activator="{ on }">
							<v-btn small v-on="on" target="_blank" class="my-2 mr-2" icon color="#7CA5C6" href="https://relay.theparadigmdev.com">
								<v-icon>mdi-server-network</v-icon>
							</v-btn>
						</template>
						<span>Relay</span>
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
    </v-content>

		<!-- <v-bottom-sheet style="z-index: 1000000; height: 100vh;" v-model="$root.music.open">
			<music-player :autoPlay="true" :file="$root.music.file" />
		</v-bottom-sheet> -->

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
  </v-app>
</template>

<script>
import Router from '@/Router'
import MusicPlayer from '@/components/MusicPlayer.vue'
import Terms from '@/components/Terms.vue'
import moment from 'moment'

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
      this.$http.get(`https://relay.theparadigmdev.com/users/signout`).then(() => {
				this.$root.socket.emit('logout', this.$root.user)
        this.$root.user = false
				this.$root.router = 'auth'
      })
    },
    runClock() {
			var today = new Date()
			this.clock.date = moment(today).format('MMMM Do, YYYY')
			this.clock.time = moment(today).format('LTS')
			setTimeout(this.runClock, 500)
		}
  },
  created() {
    if (this.$root.user == null) this.$root.router = 'auth'
		this.runClock()
		this.$root.socket.on('connect', () => {
			if (this.$root.user) this.$root.socket.emit('login', this.$root.user)
			this.$root.socket.on('config', data => this.$root.config = data)
			this.$root.socket.on('kick', username => { if (username == this.$root.user.username) this.signOut() })
			this.$root.socket.on('kill', username => { if (username == this.$root.user.username) window.close() })
		})
  }
}
</script>

<style>
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
</style>