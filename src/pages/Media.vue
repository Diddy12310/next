<template>
  <div class="media">
    <v-toolbar dense color="cyan darken-2">
      <v-toolbar-title>Media</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title class="grey--text text--lighten-1 font-weight-light">Rights to the items below are reserved for their owners.</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-tabs v-model="tab" centered icons-and-text class="elevation-5" color="white" background-color="cyan darken-2">
      <v-tabs-slider></v-tabs-slider>

      <v-tab>
        Books
        <v-icon>mdi-book</v-icon>
      </v-tab>

      <v-tab>
        Movies
        <v-icon>mdi-movie</v-icon>
      </v-tab>

      <v-tab>
        Music
        <v-icon>mdi-music-note</v-icon>
      </v-tab>

      <v-tab>
        TV Shows
        <v-icon>mdi-television</v-icon>
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <books />
      </v-tab-item>

      <v-tab-item>
        <movies />
      </v-tab-item>

      <v-tab-item>
        <music />
      </v-tab-item>

      <v-tab-item>
        <tv />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import Tv from './../components/TV'
import Music from './../components/Music'
import Movies from './../components/Movies'
import Books from './../components/Books'

export default {
  name: 'Media',
  components: {
    'tv': Tv,
    'music': Music,
    'movies': Movies,
    'books': Books
  },
  data() {
    return {
      tab: 0
    }
  }
}
</script>

<style scoped>
.v-tabs-items {
  background: none !important;
}
</style>