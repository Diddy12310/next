<template>
  <div class="h-full bg-img">
    <div class="max-w-6xl mx-auto">
      <h2 class="pt-40 text-6xl font-light text-gray-300">
        Hello,
        <span :style="{ color: $root.user.color }">{{
          $root.user.username
        }}</span
        >!
      </h2>
      <h6 class="pt-20 text-gray-600 leading-tight">
        January 1st, 2021 by Aidan Liddy
      </h6>
      <h1 class="text-purple-800 font-bold text-5xl leading-tight max-w-4xl">
        Introducing a brand new interface!
      </h1>
      <p class="text-gray-400 text-xl mt-3 max-w-xl mb-12">
        Our old interface had gotten old and rotten. So we got to work on a
        complete rewrite with a fresh interface. As you can see, our beautiful
        new interface has been publicly released.
      </p>
      <button class="flex items-center">
        <div
          @click="$noFunc()"
          class="rounded-full bg-purple-800 hover:bg-purple-700 p-1 pl-5 pr-2 text-white flex flex-shrink items-center font-light"
          v-ripple
        >
          More articles
          <v-icon>mdi-chevron-right</v-icon>
        </div>
      </button>
    </div>

    <button
      class="flex items-center absolute bottom-0 right-0 mt-12 mb-6 mr-6 mx-auto"
    >
      <div
        @click="$root.router = 'Drawer'"
        class="group rounded-full bg-blue-900 hover:bg-blue-800 py-1 pl-5 pr-2 text-white flex flex-shrink items-center font-light opacity-75"
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
