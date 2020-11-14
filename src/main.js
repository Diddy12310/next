import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import VueChatScroll from "vue-chat-scroll";
import io from "socket.io-client";
import "./assets/style.css";

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
        icon
      };
      setTimeout(() => (this.$root.notification = false), timeout);
    },
    $noFunc() {
      this.$root.notification = {
        class: "orange--text",
        text: "Function not available",
        icon: "mdi-alert"
      };
      setTimeout(() => (this.$root.notification = false), 2000);
    },
    $lock() {
      this.$root.user = false;
      this.$root.router = "Landing";
      this.$root.profile = false;
      this.$root.music = false;
      this.$root.transmission = false;
    },
    $urlBase64ToUint8Array(base64String) {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }
  }
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
      public_vapid_key:
        "BANy_l888yNEj3sW1ASQBEc3dKBq4MnOn9uu4x_gZteD8SNUYwUFbOPrFdGMiFS0zI16bie6vA-P6bNBXMXhAvc",
      worker: null
    };
  },
  render: h => h(App),
  created() {
    // Check for service worker
    if ("serviceWorker" in navigator) {
      registerServiceWorker().catch(err => console.error(err));
    }

    let that = this;
    // Register SW, Register Push, Send Push
    async function registerServiceWorker() {
      // Register Service Worker
      console.log("Registering service worker...");
      that.$root.worker = await navigator.serviceWorker.register(
        `${process.env.BASE_URL}worker.js`,
        {
          scope: "/"
        }
      );
      console.log("Service Worker Registered...");
    }
  }
}).$mount("#app");
