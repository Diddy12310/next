import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import VueChatScroll from "vue-chat-scroll";
import io from "socket.io-client";
import "./assets/style.css";

let socket = io.connect("https://www.theparadigmdev.com");
const version = require("./../package.json").version;

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
    $getCookie(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
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
    },
    $initAppMenu() {
      this.$root.nav = [
        {
          icon: "mdi-home",
          content: "Home",
          rights: this.$root.config.router.home
        },
        {
          icon: "mdi-chat",
          content: "Wire",
          rights: this.$root.config.router.wire
        },
        {
          icon: "mdi-web",
          content: "Satellite",
          rights: this.$root.config.router.satellite
        },
        {
          icon: "mdi-newspaper",
          content: "The Paradox",
          rights: this.$root.config.router.paradox
        },
        {
          icon: "mdi-folder-multiple",
          content: "Drawer",
          rights: this.$root.config.router.drawer
        },
        {
          icon: "mdi-play",
          content: "Media",
          rights: this.$root.config.router.media
        },
        // {
        //   icon: "mdi-account-group",
        //   content: "People",
        //   rights: this.$root.config.router.people
        // },
        {
          icon: "mdi-satellite-uplink",
          content: "Broadcast",
          rights: this.$root.config.router.broadcast
        },
        {
          icon: "mdi-forum",
          content: "Parlay",
          rights: this.$root.config.router.parlay
        },
        {
          icon: "mdi-download",
          content: "Downloads",
          rights: this.$root.config.router.downloads
        },
        {
          icon: "mdi-shield-lock",
          content: "Privacy",
          rights: this.$root.config.router.privacy
        },
        {
          icon: "mdi-feather",
          content: "Terms",
          rights: this.$root.config.router.terms
        },
        {
          icon: "mdi-lifebuoy",
          content: "Support",
          rights: this.$root.config.router.support
        },
        {
          icon: "mdi-code-tags",
          content: "Developer",
          rights:
            this.$root.config.router.developer &&
            this.$root.user.rights.developer
        },
        {
          icon: "mdi-console-line",
          content: "Terminal",
          rights:
            this.$root.config.router.terminal && this.$root.user.rights.admin
        }
      ];
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
      worker: null,
      online: true,
      timed_out: false,
      version
    };
  },
  render: h => h(App),
  created() {
    let timeOut = setTimeout(() => {
      if (!this.$root.config) this.$root.timed_out = true;
    }, 15000);
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

      window.addEventListener("offline", e => (this.$root.online = false));
      window.addEventListener("online", e => (this.$root.online = true));
    }
  }
}).$mount("#app");
