import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueChatScroll from 'vue-chat-scroll'
import io from 'socket.io-client'
import axios from 'axios'

Vue.prototype.$http = axios

Vue.use(VueChatScroll)

Vue.config.productionTip = false

var socket = io.connect('https://relay.theparadigmdev.com')

Vue.mixin({
  data() {
    return {
      $url: 'https://relay.theparadigmdev.com'
    }
  },
  methods: {
    $notify(type, text, button) {
      this.$root.alert.type = type
      this.$root.alert.text = text
      this.$root.alert.btn = button
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
      router: 'home',
      drawer: true,
      alert: {
        open: false,
        text: '',
        btn: false
      },
      music: {},
      view: {
        terms: false
      },
      socket: socket
    }
  },
  render: h => h(App)
}).$mount('#app')
