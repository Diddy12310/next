<template>
  <div>
    <v-toolbar dense color="indigo darken-2" style="z-index: 1">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Broadcast</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="get()"><v-icon>mdi-reload</v-icon></v-btn>
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
          <v-list-item-group mandatory v-model="page">
            <v-list-item
              v-for="item in pages"
              :key="item.value"
              :value="item.value"
            >
              <v-list-item-icon
                ><v-icon>{{ item.icon }}</v-icon></v-list-item-icon
              >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
            <v-list-item
              value="profile"
              @click="(page = 'profile'), (profile = $root.user)"
            >
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <section :style="{ 'margin-left': drawer ? '256px' : '56px' }">
        <New v-if="page === 'new'" />
        <Feed
          @get="get()"
          @feed="feed = $event"
          @person="(page = 'profile'), (profile = $event)"
          :feed="feed"
          :people="people"
          v-if="page === 'feed'"
        />
        <Find
          @get="get()"
          @person="(page = 'profile'), (profile = $event)"
          :feed="feed"
          :people="people"
          v-if="page === 'find'"
        />
        <Profile
          @get="get()"
          :profile="profile"
          v-if="page === 'profile'"
          @go="page = $event"
        />
      </section>
    </main>
  </div>
</template>

<script>
import New from "./New";
import Feed from "./Feed";
import Find from "./Find";
import Profile from "./Profile";

import moment from "moment";

export default {
  name: "Broadcast",
  components: {
    New,
    Feed,
    Find,
    Profile,
  },
  data() {
    return {
      drawer: true,
      feed: [],
      people: [],
      page: "feed",
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

      profile: false,

      uploader: false,
      loading: false,

      window,
    };
  },
  methods: {
    get() {
      this.loading = true;
      this.$http
        .get(`/api/broadcast/${this.$root.user._id}`)
        .then((response) => {
          this.feed = response.data;
          this.$http
            .get("/api/users/list")
            .then((response) => {
              this.people = response.data;
              if (this.profile)
                this.profile = response.data.find(
                  (person) => person._id == this.profile._id
                );
              this.loading = false;
            })
            .catch((error) => {
              console.error(error);
              this.loading = false;
            });
        })
        .catch((error) => {
          console.error(error);
          this.loading = false;
        });
    },
  },
  created() {
    this.get();
  },
};
</script>

<style scoped>
</style>