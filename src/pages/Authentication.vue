<template>
  <div
    style="
      background-color: #0f1e3c;
      height: 100vh;
      width: 100vw;
      overflow-x: hidden;
    "
  >
    <div
      style="max-width: 28rem"
      :style="{
        'padding-top': $vuetify.breakpoint.smAndUp ? '10rem' : '50px',
      }"
      class="mx-auto text-center"
    >
      <img style="height: 8rem; margin: auto" src="../assets/logo.webp" />

      <v-card
        style="border: none !important"
        class="ma-4 mt-10"
        color="#333333"
      >
        <v-card-title class="d-block text-left">
          <h1
            class="text-h4 grey--text text--lighten-1"
            v-if="$vuetify.breakpoint.smAndUp"
          >
            Sign in to your account
          </h1>
          <h1
            class="text-h4 grey--text text--lighten-1"
            v-if="$vuetify.breakpoint.xsOnly"
          >
            Sign in
          </h1>
          <p
            class="text--grey text--darken-4 font-weight-light ma-0 subtitle-2"
            v-if="$root.config.auth.sign_up"
          >
            Or
            <a class="text--grey text--darken-4" @click="signUp()">
              create an account</a
            >
          </p></v-card-title
        >

        <v-card-text>
          <v-text-field
            hide-details="auto"
            label="Username"
            class="mb-3"
            v-model="username"
            autocomplete="off"
            :error-messages="errors.username"
          ></v-text-field>
          <v-text-field
            hide-details="auto"
            label="Password"
            class="mb-6"
            type="password"
            @keyup.enter="signIn()"
            v-model="password"
            :error-messages="errors.password"
          ></v-text-field>
          <v-checkbox
            @keyup.enter="signIn()"
            label="Stay signed in"
            v-model="sticky"
          ></v-checkbox>
          <v-btn
            elevation="2"
            block
            color="deep-purple darken-4"
            @click="signIn()"
            :disabled="!username || !password"
            >Sign in</v-btn
          >
        </v-card-text>

        <v-card-actions class="grey darken-4 pa-7">
          <p
            class="ma-auto subtitle-2 text-center font-weight-light text--grey text--darken-4"
          >
            Forgot your credentials? Oh well, for now...
            <!-- <a
              class="text--grey text--darken-4"
              @click="
                $root.user = {
                  preflight: { recovery: true },
                };
                $router.push('/preflight');
              "
            >
              Enter account recovery</a
            > -->
          </p>
        </v-card-actions>

        <v-progress-linear
          indeterminate
          color="deep-purple darken-4"
          v-if="loading"
        ></v-progress-linear>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "Authentication",
  data() {
    return {
      username: "",
      password: "",
      sticky: true,
      authenticated: false,
      loading: false,
      errors: false,
    };
  },
  created() {
    if (this.$root.user && !this.$root.user.preflight)
      this.$router.replace("/home");
  },
  watch: {
    "$root.user": function () {
      if (this.$root.user && !this.$root.user.preflight)
        this.$router.replace("/home");
    },
  },
  methods: {
    signUp() {
      this.$root.user = {
        username: this.username,
        password: this.password,
        preflight: { creation: true },
      };
      this.$router.push("/preflight");
    },
    signIn() {
      this.loading = true;
      this.$http
        .post("/api/authentication/signin", {
          username: this.username.toLowerCase(),
          password: this.password,
          sticky: this.sticky,
        })
        .then(async (response) => {
          if (!response.data.errors) {
            this.authenticated = true;
            this.$root.user._id
              ? ""
              : response.data.preflight
              ? this.$router.replace("/preflight")
              : this.$router.push("home");
            this.$root.user = response.data.user;
            this.$initAppMenu();

            this.$root.socket.emit("login", response.data.user.username);
            this.loading = false;

            const existsing_subscription = this.$root.user.notifications.find(
              (subscription) =>
                subscription._id == this.$getCookie("notification_id")
            );
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
                    `https://www.theparadigmdev.com/api/notifications/${response.data.user._id}/subscribe`,
                    {
                      data: subscription,
                    }
                  )
                  .then((response) => {
                    console.log("Push Sent...");
                    document.cookie = `notification_id=${response.data._id}; Secure`;
                  })
                  .catch((error) => console.error(error));
              });
            }
          } else {
            this.errors = response.data.errors;
            this.loading = false;
          }
        });
    },
  },
};
</script>

<style scoped>
.router-view {
  background-color: #0f1e3c !important;
}
</style>
