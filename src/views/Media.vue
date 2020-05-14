<template>
  <div class="media">
    <v-toolbar dense color="cyan darken-2">
      <v-toolbar-title>Media</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field style="max-width: 500px;" disabled color="white" v-model="search" label="Search..." class="mt-7"></v-text-field>
    </v-toolbar>
    <v-tabs v-model="tab" centered background-color="cyan darken-2" color="white">
      <v-tab>Books</v-tab>
      <v-tab>Movies</v-tab>
      <v-tab>Music</v-tab>
      <v-tab>Podcasts</v-tab>
      <v-tab>Shows</v-tab>
      <v-tab>Live</v-tab>
    </v-tabs>

    <div class="scroll-container">
      <v-tabs-items v-model="tab" style="background: none;">
        <!-- Books -->
        <v-tab-item>
          <v-container fluid>
            <v-row>
              <v-col v-for="(book, index) in books" :key="index" xs="12" sm="6" md="4" lg="3" xl="2">
                <v-card class="book" ripple :disabled="!book.live" @click="openBook(book._id)">
                  <v-img max-height="400" :src="book.cover">
                    <v-card-title class="align-end fill-height" style="background-image: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 250px);">
                      <div style="width: 100%;">
                        <h3 class="headline mb-0">{{ book.title }}</h3>
                        <div class="d-flex">
                          <h4 class="body-2 grey--text">{{ book.author }}</h4>
                          <v-spacer></v-spacer>
                          <h4 class="body-2 red--text font-weight-medium" v-if="!book.live">UNAVAILABLE</h4>
                        </div>
                      </div>
                    </v-card-title>
                  </v-img>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>

        <!-- Movies -->
        <v-tab-item>
          <v-container fluid>
            <v-row>
              <v-col v-for="(movie, index) in movies" :key="index" xs="12" sm="6" md="4" lg="3" xl="2">
                <v-card class="movie" ripple :disabled="!movie.live" @click="openMovie(movie._id)">
                  <v-img max-height="400" :src="movie.cover">
                    <v-card-title class="align-end fill-height" style="background-image: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 250px);">
                      <div style="width: 100%;">
                        <h3 class="headline mb-0">{{ movie.title }}</h3>
                        <div class="d-flex">
                          <h4 class="body-2 grey--text">{{ movie.genre }}</h4>
                          <v-spacer></v-spacer>
                          <h4 class="body-2 red--text font-weight-medium" v-if="!movie.live">UNAVAILABLE</h4>
                        </div>
                      </div>
                    </v-card-title>
                  </v-img>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>

        <!-- Music -->
        <v-tab-item>
          <v-container fluid>
            <v-row>
              <v-col v-for="(item, index) in music" :key="index" xs="12" sm="6" md="4" lg="3" xl="2">
                <v-card class="music" ripple :disabled="!item.live" @click="openMusic(item._id)">
                  <v-img :src="item.cover">
                    <v-card-title class="align-end fill-height" style="background-image: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 250px);">
                      <div style="width: 100%;">
                        <h3 class="headline mb-0">{{ item.title }}</h3>
                        <div class="d-flex">
                          <h4 class="body-2 grey--text">{{ item.artist }}</h4>
                          <v-spacer></v-spacer>
                          <h4 class="body-2 red--text font-weight-medium" v-if="!item.live">UNAVAILABLE</h4>
                        </div>
                      </div>
                    </v-card-title>
                  </v-img>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>

        <v-tab-item>
          <v-container fluid class="text-center pt-0">
            <v-row>
              <v-col cols="12" sm="12" class="indigo darken-3 py-12 elevation-5">
                <h1 class="display-3 font-weight-thin white--text">Podcasts</h1>
              </v-col>
              <v-col cols="12" sm="12">
                <p class="title font-weight-regular px-6 pt-6">Listen to the news, talk shows, and more.</p>
                <v-btn color="indigo darken-3" disabled>Coming Soon</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>

        <v-tab-item>
          <v-container fluid class="text-center pt-0">
            <v-row>
              <v-col cols="12" sm="12" class="indigo darken-3 py-12 elevation-5">
                <h1 class="display-3 font-weight-thin white--text">TV Shows</h1>
              </v-col>
              <v-col cols="12" sm="12">
                <p class="title font-weight-regular px-6 pt-6">Watch your favorite TV shows, no matter where you are.</p>
                <v-btn color="indigo darken-3" disabled>Coming Soon</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>

        <v-tab-item>
          <v-container fluid class="text-center pt-0">
            <v-row>
              <v-col cols="12" sm="12" class="indigo darken-3 py-12 elevation-5">
                <h1 class="display-3 font-weight-thin white--text">Live TV</h1>
              </v-col>
              <v-col cols="12" sm="12">
                <p class="title font-weight-regular px-6 pt-6">Watch your favorite live TV channels, without a subscription.</p>
                <v-btn color="indigo darken-3" disabled>Coming Soon</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
      </v-tabs-items>
    </div>

    <v-dialog width="600" style="z-index: 99991;" v-model="current.open" @click:outside="current = {}">
      <v-card>
        <v-img :src="current.cover" style="height: 90vh;" v-if="current.type != 'music'">
          <v-card-title class="align-end fill-height" style="background-image: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 250px);">
            <div style="width: 100%;">
              <h3 class="headline mb-0">{{ current.title }}</h3>
              <div class="d-flex">
                <h4 v-if="current.type == 'book'" class="body-2 grey--text">{{ current.author }}</h4>
                <h4 v-if="current.type == 'movie'" class="body-2 grey--text">{{ current.genre }}</h4>
                <h4 v-if="current.type == 'music'" class="body-2 grey--text">{{ current.artist }}</h4>
                <v-spacer></v-spacer>
                <h4 class="body-2 red--text font-weight-medium" v-if="!current.live">UNAVAILABLE</h4>
              </div>
            </div>
          </v-card-title>
        </v-img>

        <v-img :src="current.cover" v-if="current.type == 'music'">
          <v-card-title class="align-end fill-height" style="background-image: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 250px);">
            <div style="width: 100%;">
              <h3 class="headline mb-0">{{ current.title }}</h3>
              <div class="d-flex">
                <h4 v-if="current.type == 'book'" class="body-2 grey--text">{{ current.author }}</h4>
                <h4 v-if="current.type == 'movie'" class="body-2 grey--text">{{ current.genre }}</h4>
                <h4 v-if="current.type == 'music'" class="body-2 grey--text">{{ current.artist }}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;{{ current.genre }}</h4>
                <v-spacer></v-spacer>
                <h4 class="body-2 red--text font-weight-medium" v-if="!current.live">UNAVAILABLE</h4>
              </div>
            </div>
          </v-card-title>
        </v-img>


        <v-card-text class="mt-6" v-if="current.type != 'music'">{{ current.summary }}</v-card-text>

        <v-card-text class="mt-6" v-else>
          <!-- <p class="text-right"> -->
          <v-card-actions class="pt-0">
            <v-spacer></v-spacer>
            <v-rating color="yellow darken-2" background-color="grey darken-3" @input="updateUserMusic()" v-model="current.rating"></v-rating>
            <v-btn color="pink lighten-1" icon @click="current.favorite = !current.favorite, updateUserMusic()"><v-icon>{{ current.favorite ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon></v-btn>
            <v-btn icon color="blue accent-1" class="mr-1"><v-icon>mdi-shuffle</v-icon></v-btn>
            <v-btn text color="blue accent-1"><v-icon left>mdi-play</v-icon>Play</v-btn>
          </v-card-actions>
          <!-- </p> -->
          <v-list nav>
            <v-list-item @click="playSong(song)" v-for="(song, index) in music_songs" :key="index">
              <v-list-item-icon>{{ song.track }}</v-list-item-icon>
              <v-list-item-title>
                <v-row>
                  <v-col sm="8">{{ song.title }}</v-col>
                  <v-col sm="4" class="grey--text">{{ song.length }}</v-col>
                </v-row>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions v-if="current.type == 'book'">
          <v-spacer></v-spacer>
          <v-rating color="yellow darken-2" background-color="grey darken-3" @input="updateUserBook()" v-model="current.rating"></v-rating>
          <v-btn color="pink lighten-1" icon @click="current.favorite = !current.favorite, updateUserBook()"><v-icon>{{ current.favorite ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon></v-btn>
          <!-- <v-btn color="blue" icon @click="downloadBook()"><v-icon>mdi-download</v-icon></v-btn> -->
          <v-btn text color="blue accent-1" @click="readBook()">Read</v-btn>
        </v-card-actions>

        <v-card-actions v-if="current.type == 'movie'">
          <v-spacer></v-spacer>
          <v-rating color="yellow darken-2" background-color="grey darken-3" @input="updateUserMovie()" v-model="current.rating"></v-rating>
          <v-btn color="pink lighten-1" icon @click="current.favorite = !current.favorite, updateUserMovie()"><v-icon>{{ current.favorite ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon></v-btn>
          <!-- <v-btn color="blue" icon @click="downloadBook()"><v-icon>mdi-download</v-icon></v-btn> -->
          <v-btn text color="blue accent-1" @click="watchMovie()">Watch</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'Media',
  data() {
    return {
      books: [],
      movies: [],
      music: [],
      search: '',
      tab: 0,
      current: {}
    }
  },
  computed: {
    music_songs() {
      if (this.current.songs) {
        return this.current.songs.sort((a, b) => (parseInt(a.track) > parseInt(b.track)) ? 1 : -1)
      }
    }
  },
  created() {
    this.$http.get('https://www.theparadigmdev.com/api/media/books/get').then(response => {
      this.books = response.data
    }).catch(error => console.error(error))
    this.$http.get('https://www.theparadigmdev.com/api/media/movies/get').then(response => {
      this.movies = response.data
    }).catch(error => console.error(error))
    this.$http.get('https://www.theparadigmdev.com/api/media/music/get').then(response => {
      this.music = response.data
    }).catch(error => console.error(error))
  },
  methods: {
    // Books
    openBook(book) {
      this.$http.get(`https://www.theparadigmdev.com/api/users/${this.$root.user.username}/media/books/${book}/get`).then(response => {
        this.current = response.data
        this.current.type = 'book'
        this.current.open = true
      }).catch(error => console.error(error))
    },
    updateUserBook() {
      this.$http.post(`https://www.theparadigmdev.com/api/users/${this.$root.user.username}/media/books/${this.current._id}/update`, {
        rating: this.current.rating,
        favorite: this.current.favorite
      }).then(response => {
        this.$root.user = response.data
      }).catch(error => console.error(error))
    },
    readBook() {
      window.open(this.current.link)
    },

    // Movies
    openMovie(movie) {
      this.$http.get(`https://www.theparadigmdev.com/api/users/${this.$root.user.username}/media/movies/${movie}/get`).then(response => {
        this.current = response.data
        this.current.type = 'movie'
        this.current.open = true
      }).catch(error => console.error(error))
    },
    updateUserMovie() {
      this.$http.post(`https://www.theparadigmdev.com/api/users/${this.$root.user.username}/media/movies/${this.current._id}/update`, {
        rating: this.current.rating,
        favorite: this.current.favorite
      }).then(response => {
        this.$root.user = response.data
      }).catch(error => console.error(error))
    },
    watchMovie() {
      window.open(this.current.link)
    },

    // Music
    openMusic(id) {
      this.$http.get(`https://www.theparadigmdev.com/api/users/${this.$root.user.username}/media/music/${id}/get`).then(response => {
        this.current = response.data
        this.current.type = 'music'
        this.current.open = true
      }).catch(error => console.error(error))
    },
    updateUserMusic() {
      this.$http.post(`https://www.theparadigmdev.com/api/users/${this.$root.user.username}/media/music/${this.current._id}/update`, {
        rating: this.current.rating,
        favorite: this.current.favorite
      }).then(response => {
        this.$root.user = response.data
      }).catch(error => console.error(error))
    },
    playSong(song) {
      var music = {
        artist: this.current.artist,
        cover: this.current.cover,
        title: song.title,
        genre: this.current.genre,
        album: this.current.title,
        open: true,
        file: song.file,
        playing: true
      }
      this.$root.music = music
    }
  }
}
</script>

<style scoped>
.scroll-container {
  height: calc(100vh - 160px);
  overflow-y: auto;
}

.v-slide-group__prev {
  display: none !important;
}
</style>