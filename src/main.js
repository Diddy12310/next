import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import vuetify from "./plugins/vuetify";
import "./assets/tailwind.css";
import axios from "axios";
import VueChatScroll from "vue-chat-scroll";
import io from "socket.io-client";

let socket = io.connect("https://www.theparadigmdev.com");

Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.use(VueChatScroll);

Vue.mixin({
  methods: {
    $notify(text, style, icon, timeout) {
      this.$root.notification = {
        class: style,
        text,
        icon,
      };
      setTimeout(() => this.$root.notification = false, timeout);
    },
    $noFunc() {
      this.$root.notification = {
        class: "orange--text",
        text: "Function not available",
        icon: "mdi-alert",
      };
      setTimeout(() => this.$root.notification = false, 2000);
    },
    $lock() {
      this.$root.user = false;
      this.$root.router = "Landing";
      this.$root.profile = false;
      this.$root.music = false;
      this.$root.transmission = false;
    },
  },
});

new Vue({
  vuetify,
  data() {
    return {
      user: false,
      music: false,
      router: "Landing",
      url: false,
      profile: false,
      nav: [],
      notification: false,
      config: false,
      socket,
    };
  },
  render: (h) => h(App),
}).$mount("#app");
