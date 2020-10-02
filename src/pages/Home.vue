<template>
  <div style="height: 100vh; overflow-y: auto;" class="bg-img">
    <div
      style="padding: 15vh 2rem 2rem 2rem; max-width: 72rem;"
      class="mx-auto"
    >
      <h6 class="grey--text text--darken-1 overline">
        January 1st, 2021 by Aidan Liddy
      </h6>
      <h1
        style="max-width: 56rem;"
        class="deep-purple--text text--darken-3 font-weight-bold text-h3"
      >
        Introducing a brand new interface!
      </h1>
      <p
        style="max-width: 36rem;"
        class="grey--text text--lighten-1 text-h6 mt-3 mb-12 font-weight-light"
      >
        Our old interface had gotten old and rotten. So we got to work on a
        complete rewrite with a fresh interface. As you can see, our beautiful
        new interface has been publicly released.
      </p>
      <button class="d-flex items-center">
        <div
          @click="$noFunc()"
          style="border-radius: 9999px;"
          class="deep-purple darken-3 hover:bg-purple-700 pa-1 pl-5 pr-2 white--text d-flex flex-shrink align-center font-weight-light"
          v-ripple
        >
          More articles
          <v-icon>mdi-chevron-right</v-icon>
        </div>
      </button>
    </div>

    <button
      style="position: absolute; bottom: 0px; right: 0px;"
      class="d-flex align-center mt-12 mb-6 mr-6 mx-auto"
      v-if="$vuetify.breakpoint.smAndUp"
    >
      <div
        @click="$root.router = 'Drawer'"
        style="border-radius: 9999px;"
        class="blue darken-4 hover:bg-blue-800 py-1 pl-5 pr-2 white--text d-flex flex-shrink align-center font-weight-light"
        v-ripple
      >
        Drawer is a secure cloud file storage service
        <v-icon>mdi-chevron-right</v-icon>
      </div>
    </button>
  </div>
</template>

<script>
export default {
  name: "Home",
};
</script>

<style scoped>
.bg-img {
  background: url("../assets/home_bg.jpg");
  background-attachment: fixed;
  background-position: center;
}
</style>
