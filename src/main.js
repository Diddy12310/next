import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import VueChatScroll from 'vue-chat-scroll'
import VueFriendlyIframe from 'vue-friendly-iframe';
import VueAnalytics from 'vue-analytics'
import store from './store'
import firebase from 'firebase'
import LogRocket from 'logrocket'

LogRocket.init('uvh8hk/paradigm', {
  dom: {
    baseHref: 'https://theparadigmdev.com/',
  },
  rootHostname: 'theparadigmdev.com',
})

Vue.use(VueAnalytics, {
	id: 'UA-52752236-3',
	router
})

Vue.component('vue-friendly-iframe', VueFriendlyIframe);
Vue.config.productionTip = false

Vue.use(VueChatScroll)

let app = null
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    new Vue({
      router,
      store,
      render: function (h) { return h(App) }
    }).$mount('div#app')    
  }
})
