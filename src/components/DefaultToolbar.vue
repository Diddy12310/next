<template>
  <v-app-bar app color="#0F1E3C">
    <v-slide-x-transition group>
      <div class="d-flex align-center" key="logo" v-if="!$root.notification">
        <v-btn icon text @click="$root.router = 'Home'">
          <v-img
            contain
            src="../assets/logo.webp"
            width="40"
            style="border-radius: 9999px"
            class="ma-2"
          />
        </v-btn>
      </div>

      <div class="d-flex" v-else key="notification">
        <v-icon :class="{ [`${$root.notification.class}`]: true }">{{
          $root.notification.icon
        }}</v-icon>
        <p
          class="mb-0 pb-0 ml-2"
          :class="{ [`${$root.notification.class}`]: true }"
        >
          {{ $root.notification.text }}
        </p>
      </div>
    </v-slide-x-transition>

    <v-spacer></v-spacer>

    <div
      class="centralize d-flex justify-center"
      v-if="$vuetify.breakpoint.mdAndUp"
    >
      <v-btn
        style="width: 10rem"
        class="mx-2 elevation-0"
        :class="{ 'elevation-24': $root.router == $root.config.apps[app].path }"
        :color="$root.config.apps[app].color"
        v-for="(app, index) in $root.user.pinned_apps"
        :key="index"
        :input-value="$root.router == $root.config.apps[app].path"
        @click="$root.router = $root.config.apps[app].path"
        >{{ $root.config.apps[app].title }}</v-btn
      >
    </div>

    <v-spacer></v-spacer>

    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon large class="mr-1" v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-grid</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item-group v-model="$root.router" mandatory>
          <v-list-item value="Account" style="z-index: 1">
            <v-list-item-avatar
              ><v-img
                :src="`https://www.theparadigmdev.com/relay/profile-pics/${$root.user._id}.png`"
            /></v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title
                style="font-size: 1rem !important"
                :style="{ color: $root.user.color }"
                >{{ $root.user.username }}</v-list-item-title
              >
              <v-list-item-subtitle style="font-weight-light"
                >Account</v-list-item-subtitle
              >
            </v-list-item-content>
            <v-list-item-action v-if="$vuetify.breakpoint.smAndUp">
              <v-btn @click="signOut()" color="grey" icon style="z-index: 2"
                ><v-icon>mdi-logout-variant</v-icon></v-btn
              >
            </v-list-item-action>
          </v-list-item>
          <v-list-item @click="signOut()" v-if="$vuetify.breakpoint.xsOnly">
            <v-list-item-icon
              ><v-icon>mdi-logout-variant</v-icon></v-list-item-icon
            >
            <v-list-item-title>Sign out</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>
          <v-list-item
            v-for="(item, index) in $root.nav"
            :key="index"
            :value="item.content"
            :disabled="item.disabled"
            v-show="item.rights"
          >
            <v-list-item-icon
              ><v-icon
                :class="{ 'grey--text text--darken-1': item.disabled }"
                >{{ item.icon }}</v-icon
              ></v-list-item-icon
            >
            <v-list-item-title>{{ item.content }}</v-list-item-title>
          </v-list-item>
          <v-list-item
            class="d-none"
            value="Patriot"
            v-if="$root.user.rights.patriot"
          >
            <v-list-item-icon
              ><v-icon>mdi-logout-variant</v-icon></v-list-item-icon
            >
            <v-list-item-title>Patriot</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
  name: "DefaultToolbar",
  methods: {
    signOut() {
      if (this.$root.user) {
        this.$root.user = false;
        this.$root.router = "Landing";
        this.$root.profile = false;
        this.$root.music = false;
        this.$root.transmission = false;
        this.$root.socket.emit("logout", {
          _id: this.$root.user._id,
          username: this.$root.user.username,
        });
      }
    },
  },
};
</script>

<style></style>
