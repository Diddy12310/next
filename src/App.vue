<template>
  <v-app style="background-color: #0f1e3c">
    <DefaultToolbar
      style="z-index: 100"
      v-if="$root.user && !$root.music && !$root.user.preflight"
    />
    <MusicToolbar
      style="z-index: 100"
      v-if="$root.user && $root.music && !$root.user.preflight"
    />
    <PreflightToolbar
      style="z-index: 100"
      v-if="$root.user && $root.user.preflight"
    />

    <v-main>
      <div
        v-if="!$root.config"
        style="max-width: 20rem; margin-top: 12rem"
        class="mx-auto text-center"
        key="loading"
      >
        <v-progress-circular
          indeterminate
          size="75"
          color="#1C3973"
        ></v-progress-circular>
        <p style="color: #1c3973" class="mt-5 text-h5">Loading...</p>
      </div>
      <Router
        key="router"
        style="background-color: #131313"
        :style="{
          height: $vuetify.breakpoint.mdAndUp
            ? 'calc(100vh - 64px)'
            : 'calc(100vh - 56px)',
        }"
        v-else-if="$root.config && !$root.config.shutdown"
      />
      <div v-else-if="$root.config && $root.config.shutdown" key="shutdown">
        <h1
          class="text-h3 font-weight-light text-uppercase text-center px-12 deep-purple--text text--lighten-1"
          style="margin-top: 100px"
        >
          A Connection Could not be Established
        </h1>
        <p class="text-center pt-6 title font-weight-light grey--text">
          Try refreshing your page.
        </p>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import Router from "./Router.vue";
import DefaultToolbar from "./components/DefaultToolbar.vue";
import MusicToolbar from "./components/MusicToolbar.vue";
import PreflightToolbar from "./components/PreflightToolbar.vue";
import io from "socket.io-client";

export default {
  name: "App",
  components: {
    Router,
    DefaultToolbar,
    MusicToolbar,
    PreflightToolbar,
  },
  methods: {
    signOut() {
      if (this.$root.user) {
        this.$root.router = "Landing";
        this.$root.profile = false;
        this.$root.music = false;
        this.$root.transmission = false;
        this.$root.user = false;
        this.$root.socket.emit("logout", {
          _id: this.$root.user._id,
          username: this.$root.user.username,
        });
        this.$http.get("/api/authentication/signout");
      }
    },
  },
  mounted() {
    if (this.$root.user == false) this.$root.router = "Landing";
    if (this.$getCookie("jwt")) {
      this.$http.get("/api/authentication/verify").then(async (response) => {
        if (response.data.valid) {
          this.$root.user = response.data.user;
          this.$root.router = "Home";
          this.$root.nav = [
            {
              icon: "mdi-home",
              content: "Home",
              disabled: false,
              rights: true,
            },
            {
              icon: "mdi-message",
              content: "Flamechat",
              disabled: false,
              rights: true,
            },
            {
              icon: "mdi-web",
              content: "Satellite",
              disabled: false,
              rights: true,
            },
            {
              icon: "mdi-newspaper",
              content: "The Paradox",
              disabled: false,
              rights: true,
            },
            {
              icon: "mdi-folder-multiple",
              content: "Drawer",
              disabled: false,
              rights: true,
            },
            {
              icon: "mdi-play",
              content: "Media",
              disabled: false,
              rights: true,
            },
            {
              icon: "mdi-account-group",
              content: "People",
              disabled: false,
              rights: true,
            },
            {
              icon: "mdi-satellite-uplink",
              content: "Broadcast",
              disabled: false,
              rights: true,
            },
            {
              icon: "mdi-download",
              content: "Downloads",
              disabled: false,
              rights: true,
            },
            {
              icon: "mdi-shield-lock",
              content: "Privacy",
              disabled: false,
              rights: true,
            },
            {
              icon: "mdi-feather",
              content: "Terms",
              disabled: false,
              rights: true,
            },
            {
              icon: "mdi-lifebuoy",
              content: "Support",
              disabled: false,
              rights: true,
            },
            {
              icon: "mdi-code-tags",
              content: "Developer",
              disabled: false,
              rights: response.data.user.rights.developer,
            },
            {
              icon: "mdi-console-line",
              content: "Terminal",
              disabled: false,
              rights: response.data.user.rights.admin,
            },
          ];
          response.data.preflight
            ? (this.$root.router = "Preflight")
            : (this.$root.router = "Home");
          this.$root.socket.emit("login", response.data.user.username);
          this.loading = false;

          const existsing_subscription = this.$root.user.notifications.find(
            (subscription) =>
              subscription._id == this.$getCookie("notification_id")
          );
          console.log(existsing_subscription);
          if (
            ((await this.$root.worker.pushManager.permissionState()) !=
              "granted" &&
              !existsing_subscription) ||
            ((await this.$root.worker.pushManager.permissionState()) ==
              "granted" &&
              !existsing_subscription)
          ) {
            navigator.serviceWorker.ready.then(async () => {
              console.log("Registering Push...");
              const subscription = await this.$root.worker.pushManager.subscribe(
                {
                  userVisibleOnly: true,
                  applicationServerKey: this.$urlBase64ToUint8Array(
                    this.$root.public_vapid_key
                  ),
                }
              );
              console.log("Push Registered...");
              console.log("Sending Push...");
              this.$http
                .post(
                  `https://www.theparadigmdev.com/api/notifications/${response.data._id}/subscribe`,
                  {
                    data: subscription,
                  }
                )
                .then((response) => {
                  console.log("Push Sent...");
                  console.log(response.data._id);
                  document.cookie = `notification_id=${response.data._id}; Secure`;
                })
                .catch((error) => console.error(error));
            });
          }
        } else {
          this.$root.router = "Landing";
        }
      });
    }
  },
  created() {
    this.$root.socket.on("connect", () => {});
    this.$root.socket.on("config", (data) => {
      this.$root.config = data;
      if (this.$root.config.banned.includes(this.$root.ip)) {
        if (this.$root.user)
          this.$root.socket.emit("logout", {
            _id: this.$root.user._id,
            username: this.$root.user.username,
          });
        this.$root.router = "Error";
        this.$root.user = false;
        this.$root.profile = false;
        this.$root.music = false;
        this.$root.transmission = false;
      }
    });
    this.$root.socket.on("kick", (username) => {
      if (username == this.$root.user.username) {
        this.signOut();
        this.$notify(
          "You were kicked out",
          "red--text",
          "mdi-alert-circle",
          2000
        );
      }
    });
    this.$root.socket.on("nuke", () => {
      this.$root.config.shutdown = true;
    });
    if (this.$root.user)
      this.$root.socket.emit("login", this.$root.user.username);
    this.$root.socket.on("user", (data) => {
      if (data.strikes != this.$root.user.strikes)
        this.$notify(
          `You have ${data.strikes} strikes!`,
          "orange--text",
          "mdi-gavel",
          3000
        );
      if (this.$root.router !== "error" && this.$root.user !== data)
        this.$root.user = data;
    });
    this.$root.socket.on("logout", () => {
      this.$root.socket.disconnect();
      this.$root.socket = io.connect("https://www.theparadigmdev.com");
      this.$root.user = false;
    });
    this.$root.socket.on("disconnect", () => {
      let reconnected = false;
      this.$root.socket.on("reconnect", () => (reconnected = true));
      setTimeout(() => {
        if (!reconnected) this.$lock();
      }, 10000);
    });
  },
};
</script>

<style>
body {
  background-color: #0f1e3c;
}

.centralize {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

input,
textarea {
  outline: none !important;
  color: white;
  width: 100%;
}

.moonrock-count {
  position: relative;
  bottom: 45px;
}

html {
  overflow: hidden !important;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: rgb(33, 33, 33);
}
::-webkit-scrollbar-thumb {
  background: rgb(100, 100, 100);
}
::-webkit-scrollbar-thumb:hover {
  background: rgb(60, 60, 60);
}
::-webkit-scrollbar-corner {
  background: rgb(33, 33, 33);
}
</style>
