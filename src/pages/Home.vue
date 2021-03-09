<template>
  <div
    :style="{
      height: $vuetify.breakpoint.mdAndUp
        ? 'calc(100vh - 64px)'
        : 'calc(100vh - 56px)',
    }"
    style="overflow-y: auto"
    class="bg-img"
  >
    <!-- <div
      :style="{
        padding: $vuetify.breakpoint.smAndUp ? '15vh 2rem 2rem 2rem' : '2rem',
      }"
      style="max-width: 72rem"
      class="mx-auto"
    > -->
    <div
      :style="{
        padding: $vuetify.breakpoint.smAndUp ? '5vh 2rem 2rem 2rem' : '2rem',
      }"
      style="max-width: 72rem"
      class="mx-auto"
    >
      <h1 class="display-3 font-weight-light mt-6">
        Welcome,
        <span
          class="font-weight-regular"
          :style="{ color: $root.user.color }"
          >{{ $root.user.username }}</span
        >!
      </h1>

      <h6 class="grey--text text--darken-1 overline mt-8">
        {{ $root.config.landing.date }}
      </h6>
      <h1
        style="max-width: 56rem"
        class="font-weight-medium text-h3"
        v-html="$root.config.landing.title"
      ></h1>
      <p
        style="max-width: 36rem"
        class="grey--text text--lighten-1 text-h6 mt-3 mb-12 font-weight-light"
        v-html="$root.config.landing.body"
      ></p>
      <!-- <button class="d-flex items-center">
        <div
          @click="$noFunc()"
          style="border-radius: 9999px"
          class="deep-purple darken-3 hover:bg-purple-700 pa-1 pl-5 pr-2 white--text d-flex flex-shrink align-center font-weight-light"
          v-ripple
        >
          More articles
          <v-icon>mdi-chevron-right</v-icon>
        </div>
      </button> -->
    </div>

    <!-- <button
      style="position: absolute; bottom: 0px; right: 0px"
      class="d-flex align-center mb-6 mr-6 mx-auto"
      v-if="$vuetify.breakpoint.smAndUp"
    >
      <div
        @click="$root.router = 'Drawer'"
        style="border-radius: 9999px"
        class="teal darken-4 hover:bg-blue-800 py-1 pl-5 pr-2 white--text d-flex flex-shrink align-center font-weight-light"
        v-ripple
      >
        Drawer is a secure cloud file storage service
        <v-icon>mdi-chevron-right</v-icon>
      </div>
    </button> -->
    <p
      class="caption mb-2 mr-3 grey--text"
      style="position: absolute; bottom: 0px; right: 0px; cursor: pointer"
      @click="
        window.open(
          `https://github.com/Paradigm-Dev/paradigm/releases/tag/v${$root.version}`
        )
      "
    >
      v{{ $root.version }}
    </p>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      window,
    };
  },
};
</script>

<style scoped>
.bg-img {
  background: url("../assets/home_bg.jpg");
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
}
</style>
