<template>
  <div style="height: 100vh">
    <header style="height: 8rem; max-width: 1185px; margin: auto" class="px-4">
      <v-container class="d-flex align-center pa-0" style="width: 100%">
        <img
          src="../assets/logo.webp"
          style="height: 128px; width: 112px"
          class="py-4 pr-4"
          alt="Paradigm logo"
        />
        <h1
          v-if="$vuetify.breakpoint.smAndUp"
          class="font-weight-light grey--text text--lighten-2 text-uppercase text-4xl"
        >
          Paradigm
        </h1>

        <v-spacer></v-spacer>
        <v-btn
          color="#182D57"
          depressed
          @click="$router.push('/authentication')"
          >Sign in</v-btn
        >
      </v-container>
    </header>

    <main
      style="
        height: calc(100vh - 128px);
        overflow-y: auto;
        overflow-x: hidden;
        max-width: 1185px;
        margin: auto;
      "
      class="pt-12 px-4"
    >
      <v-container class="pa-0">
        <v-row class="ma-0" no-gutters>
          <v-col
            sm="12"
            md="8"
            :class="{
              'text-left': $vuetify.breakpoint.mdAndUp,
              'text-center': $vuetify.breakpoint.smAndDown,
            }"
          >
            <button
              :class="{ 'mx-auto': $vuetify.breakpoint.smAndDown }"
              class="d-flex align-center"
              v-if="$vuetify.breakpoint.smAndUp"
            >
              <div
                v-ripple
                @click="window.open('https://github.com/Paradigm-Dev')"
                style="border-radius: 99999px; background-color: #182d57"
                class="hover:bg-deep-blue-800 pa-1 pr-3 white--text d-flex flex-shrink align-center"
              >
                <div
                  style="border-radius: 99999px"
                  class="deep-purple darken-4 px-3 mr-2 font-weight-bold uppercase"
                >
                  WE'RE OPEN SOURCE
                </div>
                View our source code
                <v-icon>mdi-chevron-right</v-icon>
              </div>
            </button>
            <h1 class="font-weight-bold text-white mt-4 text-h3">
              Applications and services
            </h1>
            <h1
              class="font-weight-bold text-h3 deep-purple--text text--darken-3"
            >
              built for the people
            </h1>
            <p class="font-weight-light text-h6 grey--text mt-4 pr-4">
              Paradigm is a suite of lightweight, secure, and performant
              applications on the web for a free society. Our apps promote the
              freedoms enshrined in the Constitution of the United States. User
              privacy and security are our number one priority.
            </p>

            <v-row class="align-center">
              <v-col xs="12" sm="4" class="text-h5 grey--text">
                <v-icon class="grey--text pr-2" size="50">mdi-check</v-icon>
                Easy
              </v-col>

              <v-col xs="12" sm="4" class="text-h5 grey--text">
                <v-icon class="grey--text pr-2" size="50">mdi-lock</v-icon>
                Secure
              </v-col>

              <v-col xs="12" sm="4" class="text-h5 grey--text">
                <v-icon class="grey--text pr-2" size="50"
                  >mdi-fast-forward</v-icon
                >
                Fast
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" md="4" v-if="$root.config.auth.sign_up">
            <v-card
              color="#333333"
              class="my-4 mx-auto"
              style="outline: none; max-width: 25rem"
            >
              <v-card-title class="text-h4 grey--text text--lighten-1">
                Sign up
              </v-card-title>

              <v-card-text>
                <v-text-field
                  hide-details
                  label="Username"
                  class="mb-3"
                  v-model="username"
                ></v-text-field>
                <v-text-field
                  hide-details
                  label="Password"
                  class="mb-6"
                  type="password"
                  v-model="password"
                  @keypress.enter="signUp()"
                ></v-text-field>
                <v-btn block color="deep-purple darken-4" @click="signUp()"
                  >Continue</v-btn
                >
              </v-card-text>

              <v-card-actions class="grey darken-4 pa-7">
                <p
                  class="ma-auto subtitle-2 text-center font-weight-light text--grey text--darken-4"
                >
                  Already have an account?
                  <a to="/authentication" class="text-grey text--darken-4">
                    Sign in here</a
                  >
                </p>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </main>
  </div>
</template>

<script>
export default {
  name: "Landing",
  data() {
    return {
      window,
      username: "",
      password: "",
    };
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
  },
  watch: {
    "$root.user": function () {
      if (!this.$root.user.preflight) this.$router.push("/home");
    },
  },
};
</script>

<style scoped>
.router-view {
  background-color: #0f1e3c !important;
}
</style>
