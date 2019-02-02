<template>
	<v-app dark>

		<v-toolbar app style="background: linear-gradient(to right, #542478 0%, #011949 100%);">
			<v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
			<v-toolbar-title><img style="height: 55px; top: 5px; position: relative;" src="./assets/paradigmlogo.png"></v-toolbar-title>
			<v-spacer></v-spacer>
			<v-toolbar-items>
				<h6 class="clock title font-weight-light">{{ time }}</h6>
			</v-toolbar-items>
		</v-toolbar>

		<v-navigation-drawer v-model="drawer" app temporary floating>
			<v-toolbar>
				<v-toolbar-side-icon @click="drawer = !drawer"><v-icon>close</v-icon></v-toolbar-side-icon>
				<v-toolbar-title>Menu</v-toolbar-title>
			</v-toolbar>

      <v-list>

        <v-list-tile v-for="link in links" :key="link.route" router :to="link.route" :ripple="{ class: 'white--text' }">
          <v-list-tile-title class="white--text font-weight-light">{{ link.text }}</v-list-tile-title>
        </v-list-tile>

				<v-list-group value="true">
          <v-list-tile slot="activator">
            <v-list-tile-title class="font-weight-black">Company</v-list-tile-title>
          </v-list-tile>

					<v-list-tile router to="/support" :ripple="{ class: 'white--text' }">
						<v-list-tile-title class="white--text font-weight-light">Support</v-list-tile-title>
					</v-list-tile>

					<v-list-tile router to="/notice" :ripple="{ class: 'white--text' }">
						<v-list-tile-title class="white--text font-weight-light">Notice</v-list-tile-title>
					</v-list-tile>

					<v-list-tile router to="/changelog" :ripple="{ class: 'white--text' }">
						<v-list-tile-title class="white--text font-weight-light">Changelog</v-list-tile-title>
					</v-list-tile>

					<v-list-tile router to="/terms" :ripple="{ class: 'white--text' }">
						<v-list-tile-title class="white--text font-weight-light">Terms</v-list-tile-title>
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


</style>
