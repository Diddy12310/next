<template>
  <div>
    <v-toolbar dense color="purple darken-4">
      <v-toolbar-title>Downloads</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-text-field hide-details="auto" style="max-width: 500px;" color="white" label="Search..." class="mt-4" v-model="search"></v-text-field> -->
    </v-toolbar>

    <div
      :style="{
        height: $vuetify.breakpoint.mdAndUp
          ? 'calc(100vh - 112px)'
          : 'calc(100vh - 104px)',
      }"
      style="overflow-y: auto"
    >
      <v-container>
        <v-card
          max-width="750"
          class="ma-auto mt-3"
          v-for="app in $root.config.downloads"
          :key="app._id"
        >
          <v-card-title class="py-2">
            <v-list-item class="pa-0">
              <v-list-item-avatar tile
                ><v-img :src="app.icon"></v-img
              ></v-list-item-avatar>
              <v-list-item-title class="text-h5">{{
                app.title
              }}</v-list-item-title>
            </v-list-item>
          </v-card-title>

          <v-card-text>
            {{ app.description }}
          </v-card-text>

          <v-card-actions>
            <v-btn icon color="grey darken-3" @click="window.open(app.github)"
              ><v-icon>mdi-github</v-icon></v-btn
            >
            <v-spacer></v-spacer>
            <v-btn @click="window.open(app.win)" color="blue accent-1" text
              ><v-icon left>mdi-microsoft</v-icon>Windows</v-btn
            >
            <v-btn @click="window.open(app.mac)" color="blue accent-1" text
              ><v-icon left>mdi-apple</v-icon>macOS</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  name: "Downloads",
  data() {
    return {
      search: "",
      window,
    };
  },
};
</script>

<style scoped></style>
