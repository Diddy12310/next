<template>
  <div>
    <v-toolbar dense color="indigo darken-2" style="z-index: 1">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Broadcast</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn icon @click="get()"><v-icon>mdi-reload</v-icon></v-btn> -->
      <v-progress-linear
        :active="loading"
        indeterminate
        absolute
        bottom
        color="indigo darken-4"
      ></v-progress-linear>
    </v-toolbar>

    <main
      :style="{
        height: $vuetify.breakpoint.mdAndUp
          ? 'calc(100vh - 112px)'
          : 'calc(100vh - 104px)',
      }"
      style="overflow-y: auto"
      class="pa-4"
    >
      <v-navigation-drawer
        style="margin-top: 48px"
        :style="{
          width: drawer ? '256px !important' : '56px !important',
          height: $vuetify.breakpoint.mdAndUp
            ? 'calc(100vh - 112px)'
            : 'calc(100vh - 104px)',
        }"
        class="grey darken-4"
        absolute
        permanent
        :mini-variant="!drawer"
        v-model="drawer"
      >
        <v-list>
          <v-list-item
            v-for="item in pages"
            :key="item.value"
            :to="`/broadcast/${item.value}`"
          >
            <v-list-item-icon
              ><v-icon>{{ item.icon }}</v-icon></v-list-item-icon
            >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
          <v-list-item
            value="profile"
            @click="
              $route.path == `/broadcast/profile/${$root.user.username}`
                ? ''
                : $router.push(`/broadcast/profile/${$root.user.username}`)
            "
            :input-value="$route.path.includes('/profile')"
          >
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <section :style="{ 'margin-left': drawer ? '256px' : '56px' }">
        <router-view></router-view>
      </section>
    </main>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "Broadcast",
  data() {
    return {
      drawer: true,
      pages: [
        {
          value: "new",
          title: "New",
          icon: "mdi-plus",
        },
        {
          value: "feed",
          title: "Feed",
          icon: "mdi-rss",
        },
        {
          value: "find",
          title: "Find",
          icon: "mdi-magnify",
        },
      ],

      uploader: false,
      loading: false,

      window,
    };
  },
  created() {
    if (this.$route.path == "/broadcast")
      this.$router.replace("/broadcast/feed");
  },
};
</script>

<style scoped>
</style>