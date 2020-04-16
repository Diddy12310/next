import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueChatScroll from 'vue-chat-scroll'
import io from 'socket.io-client'
import axios from 'axios'

const version = require('./../package.json').version

Vue.prototype.$http = axios

Vue.use(VueChatScroll)

Vue.config.productionTip = false

var socket = io.connect('https://www.theparadigmdev.com')

Vue.mixin({
  data() {
    return {
      $url: 'https://www.theparadigmdev.com'
    }
  },
  methods: {
    $notify(type, text, button) {
      this.$root.alert.type = type
      this.$root.alert.text = text
      this.$root.alert.btn = button
      this.$root.alert.open = true
    },
    $getCookie(cname) {
			var name = cname + "="
			var decodedCookie = decodeURIComponent(document.cookie)
			var ca = decodedCookie.split(';')
			for(var i = 0; i <ca.length; i++) {
				var c = ca[i]
				while (c.charAt(0) == ' ') {
					c = c.substring(1)
				}
				if (c.indexOf(name) == 0) {
					return c.substring(name.length, c.length)
				}
			}
			return ""
    },
    $noFunc() {
      this.$root.alert.type = 'info'
      this.$root.alert.text = 'This function is not ready yet.'
      this.$root.alert.btn = false
      this.$root.alert.open = true
    }
  }
})

new Vue({
  vuetify,
  data() {
    return {
      user: null,
      config: {},
      version,
      router: 'home',
      drawer: true,
      alert: {
        open: false,
        text: '',
        btn: false
      },
      music: {},
      view: {
        terms: false,
        buggy_dialog: false,
        quote: false,
        corona: false
      },
      socket: socket
    }
  },
  render: h => h(App)
}).$mount('#app')
