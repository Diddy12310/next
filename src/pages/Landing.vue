<template>
  <div style="background-color: #0F1E3C;" class="h-screen">
    <header class="h-32 flex items-center xl:max-w-screen-xl">
      <img src="../assets/logo.png" class="h-full p-4" />
      <h1 class="font-thin text-gray-300 uppercase text-4xl">Paradigm</h1>
      <v-btn
        class="absolute right-0 mr-12"
        color="#182D57"
        depressed
        @click="$root.router = 'Authentication'"
        >Sign in</v-btn
      >
    </header>

    <main class="h-auto pt-12">
      <div class="xl:max-w-screen-xl flex mx-auto">
        <div class="w-2/3 pr-24">
          <button class="flex items-center">
            <div
              v-ripple
              @click="window.open('https://github.com/Paradigm-Dev')"
              class="rounded-full bg-blue-gray-900 hover:bg-deep-blue-800 p-1 pr-3 text-white flex flex-shrink items-center"
            >
              <div
                class="rounded-full bg-purple-800 px-3 mr-2 font-bold uppercase"
              >
                WE'RE OPEN SOURCE
              </div>
              View our source code
              <v-icon>mdi-chevron-right</v-icon>
            </div>
          </button>
          <h1 class="font-bold text-6xl text-white leading-tight mt-4">
            Applications and services
          </h1>
          <h1 class="font-bold text-6xl text-purple-800 leading-tight">
            built for the 21st century
          </h1>
          <p class="font-light text-xl text-gray-400 mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <div class="flex items-center mt-4 max-w-xl">
            <div class="w-1/3 flex text-2xl items-center text-gray-500">
              <v-icon class="grey--text pr-2" size="50">mdi-check</v-icon>
              Easy
            </div>

            <div class="w-1/3 flex text-2xl items-center text-gray-500">
              <v-icon class="grey--text pr-2" size="35">mdi-lock</v-icon> Secure
            </div>

            <div class="w-1/3 flex text-2xl items-center text-gray-500">
              <v-icon class="grey--text pr-2" size="50"
                >mdi-fast-forward</v-icon
              >
              Fast
            </div>
          </div>
        </div>

        <div class="w-1/3">
          <v-card
            class="w-full"
            color="#333333"
            style="border: none !important;"
          >
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
