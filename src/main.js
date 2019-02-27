import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/vuetify'
import VueChatScroll from 'vue-chat-scroll'
import VueFriendlyIframe from 'vue-friendly-iframe';

Vue.component('vue-friendly-iframe', VueFriendlyIframe);
Vue.config.productionTip = false

Vue.use(VueChatScroll)

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
