<template>
  <div style="background-color: #0F1E3C; height: 100vh;">
    <header
      style="height: 8rem;"
      class="d-flex align-center xl:max-w-screen-xl"
    >
      <img src="../assets/logo.png" style="height: 100%;" class="pa-4" />
      <h1
        class="font-weight-light grey--text text--lighten-2 text-uppercase text-4xl"
      >
        Paradigm
      </h1>
      <v-btn
        class="mr-12"
        style="position: absolute; right: 0px;"
        color="#182D57"
        depressed
        @click="$root.router = 'Authentication'"
        >Sign in</v-btn
      >
    </header>

    <main style="height: auto;" class="pt-12">
      <div class="xl:max-w-screen-xl d-flex mx-auto">
        <div style="width: 66.666667%; padding-right: 6rem;">
          <button class="d-flex align-center">
            <div
              v-ripple
              @click="window.open('https://github.com/Paradigm-Dev')"
              style="border-radius: 99999px; background-color: #182D57;"
              class="hover:bg-deep-blue-800 pa-1 pr-3 white--text d-flex flex-shrink align-center"
            >
              <div
                style="border-radius: 99999px;"
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
          <h1 class="font-weight-bold text-h3 deep-purple--text text--darken-3">
            built for the 21st century
          </h1>
          <p class="font-weight-light text-h6 grey--text mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <div style="max-width: 36rem;" class="d-flex align-center mt-4">
            <div
              style="width: 33.333333%;"
              class="d-flex text-h5 align-center grey--text"
            >
              <v-icon class="grey--text pr-2" size="50">mdi-check</v-icon>
              Easy
            </div>

            <div
              style="width: 33.333333%;"
              class="d-flex text-h5 align-center grey--text"
            >
              <v-icon class="grey--text pr-2" size="40">mdi-lock</v-icon>
              Secure
            </div>

            <div
              style="width: 33.333333%;"
              class="d-flex text-h5 align-center grey--text"
            >
              <v-icon class="grey--text pr-2" size="50"
                >mdi-fast-forward</v-icon
              >
              Fast
            </div>
          </div>
        </div>

        <div style="width: 33.33333%;">
          <v-card color="#333333" style="width: 100%; border: none !important;">
            <v-card-title class="text-h4 grey--text text--lighten-1"
              >Sign up</v-card-title
            >

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
                <a class="text-grey text--darken-4"> Terms and Conditions</a>
              </p>
            </v-card-actions>
          </v-card>
        </div>
      </div>
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
      };
      this.$root.router = "SignUp";
    },
  },
};
</script>

<style scoped></style>
