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
            <a
              class="text--grey text--darken-4"
              @click="
                ($root.router = 'Preflight'),
                  ($root.user = {
                    username: '',
                    password: '',
                    preflight: { creation: true },
                  })
              "
            >
              create an account</a
            >
          </p></v-card-title
        >

        <v-card-text>
          <v-text-field
            hide-details
            label="Username"
            class="mb-3"
            v-model="username"
            @keyup="checkIfUserExists()"
            autocomplete="off"
          ></v-text-field>
          <v-text-field
            hide-details="auto"
            label="Password"
            class="mb-6"
            type="password"
            @keypress.enter="signIn()"
            v-model="password"
            :disabled="!user_auth_info.exists && !user_auth_info.in"
            :error-messages="$root.notification.text"
          ></v-text-field>
          <v-btn
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
            Forgot your credentials?
            <a
              class="text--grey text--darken-4"
              @click="
                $root.user = {
                  preflight: { recovery: true },
                };
                $root.router = 'Preflight';
              "
            >
              Enter account recovery</a
            >
          </p>
        </v-card-actions>

        <v-progress-linear
          indeterminate
          color="deep-purple darken-4"
          v-if="loading"
        ></v-progress-linear>
      </v-card>
    </div>

    <v-dialog v-model="user_auth_info.in" v-if="authenticated" max-width="350">
      <v-card color="red">
        <v-card-title
          class="title text-center font-weight-medium text-uppercase"
          >Error</v-card-title
        >
        <v-card-text
          >You are logged in on another client. If you continue, that client's
          connection will be closed.</v-card-text
        >
        <v-card-actions>
          <v-btn
            text
            color="grey darken-1"
            @click="
              (username = ''),
                (password = ''),
                (user_auth_info.in = false),
                (user_auth_info.exists = false)
            "
            >Cancel</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn text color="white" @click="closeDupClient()">Continue</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "Authentication",
  data() {
    return {
      username: "",
      password: "",
      user_auth_info: {
        exists: false,
        in: false,
      },
      authenticated: false,
      loading: false,
    };
  },
  methods: {
    signIn() {
      this.loading = true;
      this.$http
        .post("https://www.theparadigmdev.com/api/users/signin", {
          username: this.username.toLowerCase(),
          password: this.password,
        })
        .then(async (response) => {
          if (!response.data.msg) {
            this.authenticated = true;
            if (!this.user_auth_info.in) {
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
                  rights: response.data.rights.developer,
                },
                {
                  icon: "mdi-console-line",
                  content: "Terminal",
                  disabled: false,
                  rights: response.data.rights.admin,
                },
              ];
              this.$root.user = response.data;
              response.data.preflight
                ? (this.$root.router = "Preflight")
                : (this.$root.router = "Home");
              this.$root.socket.emit("login", response.data);
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
            }
          } else {
            this.$notify(
              "Password is incorrect",
              "red--text",
              "mdi-lock",
              3000
            );
            this.loading = false;
          }
        });
    },
    checkIfUserExists() {
      if (this.username.length < 1) this.username_exists = false;
      else {
        this.$http
          .get(
            `https://www.theparadigmdev.com/api/users/check/${this.username.toLowerCase()}`
          )
          .then((response) => {
            this.user_auth_info = response.data;
          });
      }
    },
    closeDupClient() {
      this.$root.socket.emit("kick", this.username.toLowerCase());
      this.user_auth_info.in = false;
      this.signIn();
    },
  },
};
</script>

<style scoped></style>
