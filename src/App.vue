<template>
  <v-app style="background-color: #0f1e3c">
    <div v-if="$root.user">
      <DefaultToolbar
        style="z-index: 100"
        v-if="!$root.music && !$root.user.preflight && !$root.config.shutdown"
      />
      <MusicToolbar
        style="z-index: 100"
        v-if="$root.music && !$root.user.preflight && !$root.config.shutdown"
      />
      <PreflightToolbar
        style="z-index: 100"
        v-if="$root.user.preflight && !$root.config.shutdown"
      />
    </div>

    <v-main>
      <div
        v-if="!$root.config && !$root.timed_out"
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
      <v-fade-transition
        v-else-if="$root.config && !$root.config.shutdown"
        key="router"
      >
        <router-view
          class="router-view"
          :style="{
            height: $root.user
              ? $vuetify.breakpoint.mdAndUp
                ? 'calc(100vh - 64px)'
                : 'calc(100vh - 56px)'
              : '100vh',
          }"
          style="background-color: #131313; overflow-x: hidden !important"
        ></router-view>
      </v-fade-transition>
      <div
        v-else-if="($root.config && $root.config.shutdown) || $root.timed_out"
        key="shutdown"
        class="text-center"
        style="position: relative; height: 100vh"
      >
        <img src="./assets/logo.webp" height="125" style="margin-top: 100px" />
        <h1 class="text-h3 font-weight-light text-uppercase px-12 mt-12">
          An Error has Occurred
        </h1>
        <p class="pt-5 title font-weight-light grey--text">
          <span v-if="$root.timed_out">Reconnection timed out.</span>
          <span v-else-if="$root.config.shutdown">The server has crashed.</span>
          <br />Please try again later.
        </p>
        <p
          style="position: absolute; bottom: 0px; width: 100vw"
          class="font-weight-light grey--text text--darken-1 font-italic"
        >
          Since you're an administrator, maybe you should see why the server
          shit itself?
        </p>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import DefaultToolbar from "./components/DefaultToolbar.vue";
import MusicToolbar from "./components/MusicToolbar.vue";
import PreflightToolbar from "./components/PreflightToolbar.vue";
import io from "socket.io-client";

export default {
  name: "App",
  components: {
    DefaultToolbar,
    MusicToolbar,
    PreflightToolbar,
  },
  methods: {
    signOut() {
      if (this.$root.user) {
        this.$router.push("/");
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
    verifyJWT() {
      if (this.$getCookie("jwt")) {
        this.$http.get("/api/authentication/verify").then(async (response) => {
          if (response.data.valid) {
            this.$root.user._id
              ? ""
              : response.data.preflight
              ? this.$router.replace("/preflight")
              : this.$router.replace("/home");

            this.$root.user = response.data.user;
            this.$initAppMenu();
            this.$root.socket.emit("login", response.data.user.username);
            this.loading = false;

            const existing_subscription = this.$root.user.notifications.find(
              (subscription) =>
                subscription._id == this.$getCookie("notification_id")
            );
            if (
              ((await this.$root.worker.pushManager.permissionState()) !=
                "granted" &&
                !existing_subscription) ||
              ((await this.$root.worker.pushManager.permissionState()) ==
                "granted" &&
                !existing_subscription)
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
                    `https://www.theparadigmdev.com/api/notifications/${response.data.user._id}/subscribe`,
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
            this.$router.replace("/");
          }
        });
      }
    },
  },
  mounted() {
    if (this.$root.user == false) this.$router.replace("/");
  },
  created() {
    this.$root.socket.on("connect", () => {
      this.verifyJWT();
    });
    this.$root.socket.on("config", (data) => {
      if (this.$root.config != data) {
        this.$root.config = data;
        this.$initAppMenu();
      }

      if (this.$root.config.banned.includes(this.$root.ip)) {
        if (this.$root.user) this.$signOut();
        else this.$lock();
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
      if (data.preflight && this.$route.path !== "/preflight")
        this.$router.replace("/preflight");
      if (!data.preflight && this.$route.path == "/preflight")
        this.$router.replace("/home");
      if (data.strikes != this.$root.user.strikes)
        this.$notify(
          `You have ${data.strikes} strikes!`,
          "orange--text",
          "mdi-gavel",
          3000
        );
      if (this.$root.user !== data) this.$root.user = data;
    });
    this.$root.socket.on("logout", () => {
      this.$root.socket.disconnect();
      this.$root.socket = io.connect("https://www.theparadigmdev.com");
      this.$root.user = false;
    });
    this.$root.socket.on("disconnect", () => {
      let reconnected = false;
      this.$notify(
        "Lost connection to the server!",
        "orange--text",
        "mdi-server",
        3000
      );
      this.$root.socket.on("reconnect", () => {
        this.verifyJWT();
        reconnected = true;
        this.$notify("Reconnected!", "blue--text", "mdi-server", 3000);
      });
      setTimeout(() => {
        if (!reconnected) {
          this.$notify(
            "Reconnection timed out!",
            "red--text",
            "mdi-server",
            3000
          );
          this.$root.timed_out = true;
          this.$root.config = false;
          this.$lock();
        }
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
  bottom: 32.5px;
}
.moonrock-img {
  height: 75px;
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
  background: rgb(60, 60, 60);
}
::-webkit-scrollbar-thumb:hover {
  background: rgb(100, 100, 100);
}
::-webkit-scrollbar-corner {
  background: rgb(33, 33, 33);
}
</style>
