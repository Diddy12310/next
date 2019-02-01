<template>
	<v-app dark>

		<v-toolbar app>
			<v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
			<v-toolbar-title><img style="height: 55px; top: 5px; position: relative;" src="./assets/paradigmlogo.png"></v-toolbar-title>
			<v-spacer></v-spacer>
			<v-toolbar-items>
				<h6 class="clock title">{{ time }}</h6>
			</v-toolbar-items>
		</v-toolbar>

		<v-navigation-drawer v-model="drawer" app temporary floating>
			<v-toolbar>
				<v-toolbar-side-icon @click="drawer = !drawer"><v-icon>close</v-icon></v-toolbar-side-icon>
				<v-toolbar-title>Apps</v-toolbar-title>
			</v-toolbar>

      <v-list>

        <v-list-tile v-for="link in links" :key="link.route" router :to="link.route" :ripple="{ class: 'white--text' }">
					<v-list-tile-action>
						<v-icon>{{ link.icon }}</v-icon>
					</v-list-tile-action>
          <v-list-tile-title class="white--text">{{ link.text }}</v-list-tile-title>
        </v-list-tile>



				<v-list-group prepend-icon="business" value="true">
          <v-list-tile slot="activator">
            <v-list-tile-title>Company</v-list-tile-title>
          </v-list-tile>

					<v-list-tile router to="/support" :ripple="{ class: 'white--text' }">
						<v-list-tile-action>
							<v-icon>help</v-icon>
						</v-list-tile-action>
						<v-list-tile-title class="white--text">Support</v-list-tile-title>
					</v-list-tile>

					<v-list-tile router to="/notice" :ripple="{ class: 'white--text' }">
						<v-list-tile-action>
							<v-icon>announcement</v-icon>
						</v-list-tile-action>
						<v-list-tile-title class="white--text">Notice</v-list-tile-title>
					</v-list-tile>

					<v-list-tile router to="/changelog" :ripple="{ class: 'white--text' }">
						<v-list-tile-action>
							<v-icon>track_changes</v-icon>
						</v-list-tile-action>
						<v-list-tile-title class="white--text">Changelog</v-list-tile-title>
					</v-list-tile>

					<v-list-tile router to="/terms" :ripple="{ class: 'white--text' }">
						<v-list-tile-action>
							<v-icon>info</v-icon>
						</v-list-tile-action>
						<v-list-tile-title class="white--text">Terms</v-list-tile-title>
					</v-list-tile>

        </v-list-group>
      </v-list>
    </v-navigation-drawer>

		<v-content>
			<v-container fluid style="padding: 0;">
				<router-view></router-view>
			</v-container>
		</v-content>

		<v-footer>
			<div><span class="pl-2" style="text-align: center;">&copy; {{ new Date().getFullYear() }} Paradigm Development. All Rights Reserved.</span></div>
		</v-footer>
	</v-app>
</template>

<script>
import moment from 'moment'

export default {
	data() {
		return {
			drawer: false,
			time: null,
			links: [
				{ text: 'Home', route: '/home', icon: 'home' },
				{ text: 'Flamechat', route: '/flamechat', icon: 'forum' },
				{ text: 'Hex', route: '/hex', icon: 'folder_shared' },
				{ text: 'Drawer', route: '/drawer', icon: 'folder' },
				{ text: 'Launchpad', route: '/launchpad', icon: 'account_circle' },
				{ text: 'Bookshelf', route: '/bookshelf', icon: 'book' },
				{ text: 'The Paradox', route: '/paradox', icon: 'language' },
				{ text: 'Scorecard', route: '/scorecard', icon: 'live_tv' }
			]
		}
	},
	created() {
		this.time = moment(Date.now()).format('LL')
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

.blank {
	width: 500px;
	margin: 100px auto;
	text-align: center;
}

.blank * {
	padding-bottom: 10px;
}

</style>
