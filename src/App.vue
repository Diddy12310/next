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
        this.$http
          .get(`https://www.theparadigmdev.com/api/users/signout`)
          .then(() => {
            this.$root.socket.emit("logout", this.$root.user);
            this.$root.user = false;
            this.$root.router = "Landing";
            this.$root.profile = false;
            this.$root.music = false;
            this.$root.transmission = false;
          });
      }
    },
  },
  created() {
    if (this.$root.user == false) this.$root.router = "Landing";

    this.$root.socket.on("connect", () => {
      this.$root.socket.on("config", (data) => {
        this.$root.config = data;
        if (this.$root.config.banned.includes(this.$root.ip)) {
          if (this.$root.user)
            this.$http.get("https://www.theparadigmdev.com/api/users/signout");
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
      if (this.$root.user) this.$root.socket.emit("login", this.$root.user);
      this.$root.socket.on("user", (data) => {
        if (data.strikes != this.$root.user.strikes)
          this.$notify(
            `You have ${data.strikes} strikes!`,
            "orange--text",
            "mdi-gavel",
            3000
          );
        if (this.$root.router != "error") this.$root.user = data;
      });
      this.$root.socket.on("logout", () => {
        this.$root.socket.disconnect();
        this.$root.socket = io.connect("https://www.theparadigmdev.com");
      });
      this.$root.socket.on("disconnect", () => {
        this.$lock();
      });
    });
  },
};
</script>

<style>
body {
  background-color: #0F1E3C;
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
