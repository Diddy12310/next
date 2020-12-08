<template>
  <div style="background-color: #0f1e3c; height: 100vh">
    <header style="height: 8rem" class="px-4">
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
          @click="$root.router = 'Authentication'"
          >Sign in</v-btn
        >
      </v-container>
    </header>

    <main
      style="height: calc(100vh - 128px); overflow-y: auto; overflow-x: hidden"
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
            <p class="font-weight-light text-h6 grey--text mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
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

          <v-col sm="12" md="4" v-if="$root.config.auth.sign_up">
            <v-card
              color="#333333"
              class="my-4 ml-4"
              :class="{ 'mx-auto': $vuetify.breakpoint.smAndDown }"
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
                  >Create my account</v-btn
                >
              </v-card-text>

              <v-card-actions class="grey darken-4 pa-7">
                <p
                  class="ma-auto subtitle-2 text-center font-weight-light text--grey text--darken-4"
                >
                  By signing up, you agree to the
                  <span @click="" class="text-grey text--darken-4">
                    Terms and Conditions</span
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
      this.$root.router = "Preflight";
    },
  },
};
</script>

<style scoped></style>
