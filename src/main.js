import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import VueChatScroll from 'vue-chat-scroll'
import VueAnalytics from 'vue-analytics'
import store from './store'
import LogRocket from 'logrocket'
import { perf } from 'firebase'

Vue.use(VueAnalytics, {
	id: 'UA-52752236-3',
	router
})

Vue.config.productionTip = false

Vue.use(VueChatScroll)

Vue.mixin({
  data() {
    return {
      username: '',
      accountBio: null,
      accountColor: '#1565C0',
      isAdmin: false,
      isInnerCore: false,
      isAnalytics: false,
      userPresent: null,
      isAsteroid: false,
      isBanned: false,
      feedback: '',
      snackbar: false,
      isWriter: false,
      loadingBar: false
    }
  }
})

new Vue({
  router,
  store,
  render: function(h) { return h(App) }
}).$mount('div#app')    

LogRocket.init('uvh8hk/paradigm')
