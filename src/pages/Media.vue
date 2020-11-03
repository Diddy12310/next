<template>
  <div class="media">
    <v-toolbar dense color="cyan darken-2">
      <v-toolbar-title>Media</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        hide-details="auto"
        style="max-width: 500px"
        color="white"
        v-model="search"
        label="Search..."
        class="mt-3"
      ></v-text-field>
    </v-toolbar>
    <v-tabs
      v-model="tab"
      centered
      background-color="cyan darken-2"
      color="white"
    >
      <v-tab>Books</v-tab>
      <v-tab>Movies</v-tab>
      <v-tab>Music</v-tab>
      <!-- <v-tab>Podcasts</v-tab>
      <v-tab>Shows</v-tab>
      <v-tab>Live</v-tab> -->
    </v-tabs>

    <div
      :style="{
        height: `calc(100vh - ${$root.music.open ? '240px' : '160px'})`,
        overflowY: 'auto',
      }"
    >
      <v-tabs-items v-model="tab" style="background: none">
        <!-- Books -->
        <v-tab-item>
          <v-container fluid>
            <v-row>
              <v-col
                v-for="(book, index) in filteredBooks"
                :key="index"
                xs="12"
                sm="6"
                md="4"
                lg="3"
                xl="2"
              >
                <v-card
                  class="book"
                  ripple
                  :disabled="!book.live"
                  @click="openBook(index)"
                >
                  <v-img max-height="400" loading="lazy" :src="book.cover">
                    <!-- <v-card-title
                      
                      style="background-image: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 250px);"
                    > -->
                    <div
                      style="
                        background-image: linear-gradient(
                          to top,
                          rgba(0, 0, 0, 0.8) 0%,
                          transparent 250px
                        );
                        width: 100%;
                      "
                      class="align-baseline fill-height pa-4"
                    >
                      <div style="position: absolute; bottom: 16px">
                        <h3 class="text-h5 mb-0">{{ book.title }}</h3>
                        <div class="d-flex">
                          <h4 class="text-body-2 grey--text">
                            {{ book.author }}
                          </h4>
                          <v-spacer></v-spacer>
                          <h4
                            class="text-body-2 red--text font-weight-medium"
                            v-if="!book.live"
                          >
                            UNAVAILABLE
                          </h4>
                        </div>
                      </div>
                    </div>
                    <!-- </v-card-title> -->
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
              <v-col
                v-for="(movie, index) in filteredMovies"
                :key="index"
                xs="12"
                sm="6"
                md="4"
                lg="3"
                xl="2"
              >
                <v-card
                  class="movie"
                  ripple
                  :disabled="!movie.live"
                  @click="openMovie(index)"
                >
                  <v-img max-height="400" loading="lazy" :src="movie.cover">
                    <div
                      style="
                        background-image: linear-gradient(
                          to top,
                          rgba(0, 0, 0, 0.8) 0%,
                          transparent 250px
                        );
                        width: 100%;
                      "
                      class="align-baseline fill-height pa-4"
                    >
                      <div style="position: absolute; bottom: 16px">
                        <div style="width: 100%">
                          <h3 class="text-h5 mb-0">{{ movie.title }}</h3>
                          <div class="d-flex">
                            <h4 class="text-body-2 grey--text">
                              {{ movie.genre }}
                            </h4>
                            <v-spacer></v-spacer>
                            <h4
                              class="text-body-2 red--text font-weight-medium"
                              v-if="!movie.live"
                            >
                              UNAVAILABLE
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>
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
              <v-col
                v-for="(item, index) in filteredMusic"
                :key="index"
                xs="12"
                sm="6"
                md="4"
                lg="3"
                xl="2"
              >
                <v-card
                  class="music"
                  ripple
                  :disabled="!item.live"
                  @click="openMusic(index)"
                >
                  <v-img :src="item.cover" loading="lazy">
                    <div
                      style="
                        background-image: linear-gradient(
                          to top,
                          rgba(0, 0, 0, 0.8) 0%,
                          transparent 250px
                        );
                        width: 100%;
                      "
                      class="align-baseline fill-height pa-4"
                    >
                      <div style="position: absolute; bottom: 16px">
                        <div style="width: 100%">
                          <h3 class="text-h5 mb-0">{{ item.title }}</h3>
                          <div class="d-flex">
                            <h4 class="text-body-2 grey--text">
                              {{ item.artist }}
                            </h4>
                            <v-spacer></v-spacer>
                            <h4
                              class="text-body-2 red--text font-weight-medium"
                              v-if="!item.live"
                            >
                              UNAVAILABLE
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </v-img>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>

        <v-tab-item>
          <v-container fluid class="text-center pt-0">
            <v-row>
              <v-col
                cols="12"
                sm="12"
                class="indigo darken-3 py-12 elevation-5"
              >
                <h1 class="text-h2 font-weight-thin white--text">Podcasts</h1>
              </v-col>
              <v-col cols="12" sm="12">
                <p class="title font-weight-regular px-6 pt-6">
                  Listen to the news, talk shows, and more.
                </p>
                <v-btn color="indigo darken-3" disabled>Coming Soon</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>

        <v-tab-item>
          <v-container fluid class="text-center pt-0">
            <v-row>
              <v-col
                cols="12"
                sm="12"
                class="indigo darken-3 py-12 elevation-5"
              >
                <h1 class="text-h2 font-weight-thin white--text">TV Shows</h1>
              </v-col>
              <v-col cols="12" sm="12">
                <p class="title font-weight-regular px-6 pt-6">
                  Watch your favorite TV shows, no matter where you are.
                </p>
                <v-btn color="indigo darken-3" disabled>Coming Soon</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>

        <v-tab-item>
          <v-container fluid class="text-center pt-0">
            <v-row>
              <v-col
                cols="12"
                sm="12"
                class="indigo darken-3 py-12 elevation-5"
              >
                <h1 class="text-h2 font-weight-thin white--text">Live TV</h1>
              </v-col>
              <v-col cols="12" sm="12">
                <p class="title font-weight-regular px-6 pt-6">
                  Watch your favorite live TV channels, without a subscription.
                </p>
                <v-btn color="indigo darken-3" disabled>Coming Soon</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
      </v-tabs-items>
    </div>

    <v-dialog
      width="600"
      style="z-index: 99991"
      v-model="current.open"
      @click:outside="current = {}"
    >
      <v-card>
        <v-img
          :src="current.cover"
          loading="lazy"
          style="height: 90vh"
          v-if="current.type != 'music'"
        >
          <v-card-title
            class="align-end fill-height"
            style="
              background-image: linear-gradient(
                to top,
                rgba(0, 0, 0, 0.8) 0%,
                transparent 250px
              );
            "
          >
            <div style="width: 100%">
              <h3 class="text-h5 mb-0">{{ current.title }}</h3>
              <div class="d-flex">
                <h4
                  v-if="current.type == 'book'"
                  class="text-body-2 grey--text"
                >
                  {{ current.author }}
                </h4>
                <h4
                  v-if="current.type == 'movie'"
                  class="text-body-2 grey--text"
                >
                  {{ current.genre }}
                </h4>
                <h4
                  v-if="current.type == 'music'"
                  class="text-body-2 grey--text"
                >
                  {{ current.artist }}
                </h4>
                <v-spacer></v-spacer>
                <h4
                  class="text-body-2 red--text font-weight-medium"
                  v-if="!current.live"
                >
                  UNAVAILABLE
                </h4>
              </div>
            </div>
          </v-card-title>
        </v-img>

        <v-img
          :src="current.cover"
          v-if="current.type == 'music'"
          loading="lazy"
        >
          <v-card-title
            class="align-end fill-height"
            style="
              background-image: linear-gradient(
                to top,
                rgba(0, 0, 0, 0.8) 0%,
                transparent 250px
              );
            "
          >
            <div style="width: 100%">
              <h3 class="text-h5 mb-0">{{ current.title }}</h3>
              <div class="d-flex">
                <h4
                  v-if="current.type == 'book'"
                  class="text-body-2 grey--text"
                >
                  {{ current.author }}
                </h4>
                <h4
                  v-if="current.type == 'movie'"
                  class="text-body-2 grey--text"
                >
                  {{ current.genre }}
                </h4>
                <h4
                  v-if="current.type == 'music'"
                  class="text-body-2 grey--text"
                >
                  {{ current.artist }}&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;{{
                    current.genre
                  }}
                </h4>
                <v-spacer></v-spacer>
                <h4
                  class="text-body-2 red--text font-weight-medium"
                  v-if="!current.live"
                >
                  UNAVAILABLE
                </h4>
              </div>
            </div>
          </v-card-title>
        </v-img>

        <v-card-text class="mt-6" v-if="current.type != 'music'">{{
          current.summary
        }}</v-card-text>
        <v-card-text v-else>
          <v-card-actions class="mt-2">
            <v-spacer></v-spacer>
            <v-rating
              color="yellow darken-2"
              background-color="grey darken-3"
              @input="updateUserMusic()"
              v-model="current.rating"
            ></v-rating>
            <v-btn
              color="pink lighten-1"
              icon
              @click="(current.favorite = !current.favorite), updateUserMusic()"
              ><v-icon>{{
                current.favorite ? "mdi-heart" : "mdi-heart-outline"
              }}</v-icon></v-btn
            >
            <v-btn
              icon
              color="blue accent-1"
              class="mr-1"
              @click="playShuffle()"
              ><v-icon>mdi-shuffle</v-icon></v-btn
            >
            <v-btn text color="blue accent-1" @click="playAlbum()"
              ><v-icon left>mdi-play</v-icon>Play</v-btn
            >
          </v-card-actions>
          <v-list nav>
            <v-list-item
              @click="playSong(song)"
              v-for="(song, index) in music_songs"
              :key="index"
            >
              <v-list-item-icon>{{ song.track }}</v-list-item-icon>
              <v-list-item-title>
                <v-row>
                  <v-col sm="8">{{ song.title }}</v-col>
                  <v-col sm="2" class="grey--text">{{ song.length }}</v-col>
                  <v-col sm="2" class="py-2 text-right" v-if="song.lyrics"
                    ><v-icon
                      class="grey--text text--darken-1"
                      style="padding-top: 1px"
                      >mdi-closed-caption</v-icon
                    ></v-col
                  >
                </v-row>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions v-if="current.type == 'book'">
          <v-spacer></v-spacer>
          <v-rating
            color="yellow darken-2"
            background-color="grey darken-3"
            @input="updateUserBook()"
            v-model="current.rating"
          ></v-rating>
          <v-btn
            color="pink lighten-1"
            icon
            @click="(current.favorite = !current.favorite), updateUserBook()"
            ><v-icon>{{
              current.favorite ? "mdi-heart" : "mdi-heart-outline"
            }}</v-icon></v-btn
          >
          <v-btn text color="blue accent-1" @click="readBook()">Read</v-btn>
        </v-card-actions>

        <v-card-actions v-if="current.type == 'movie'">
          <v-spacer></v-spacer>
          <v-rating
            color="yellow darken-2"
            background-color="grey darken-3"
            @input="updateUserMovie()"
            v-model="current.rating"
          ></v-rating>
          <v-btn
            color="pink lighten-1"
            icon
            @click="(current.favorite = !current.favorite), updateUserMovie()"
            ><v-icon>{{
              current.favorite ? "mdi-heart" : "mdi-heart-outline"
            }}</v-icon></v-btn
          >
          <v-btn text color="blue accent-1" @click="watchMovie()">Watch</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Upload dialog -->
    <v-dialog
      width="600"
      style="z-index: 99991"
      v-model="add_dialog"
      @click:outside="cancelUpload()"
    >
      <v-card style="x-overflow: hidden">
        <v-img
          :src="upload.cover"
          style="height: 90vh"
          v-if="tab != 2"
          loading="lazy"
        >
          <v-card-title
            @click.self="add_dialog_uploader = true"
            class="align-end fill-height"
            style="
              background-image: linear-gradient(
                to top,
                rgba(0, 0, 0, 0.8) 0%,
                transparent 250px
              );
            "
          >
            <div style="width: 100%">
              <h3 class="text-h5 mb-0">
                <input v-model="upload.title" type="text" placeholder="Title" />
              </h3>
              <div class="d-flex">
                <h4 v-if="tab == 0" class="text-body-2 grey--text">
                  <input
                    v-model="upload.author"
                    type="text"
                    placeholder="Author"
                  />
                </h4>
                <h4 v-if="tab == 1" class="text-body-2 grey--text">
                  <input
                    v-model="upload.genre"
                    type="text"
                    placeholder="Genre"
                  />
                </h4>
              </div>
            </div>
          </v-card-title>

          <h1
            v-if="!upload.cover"
            @click="add_dialog_uploader = true"
            class="text-h3 centralize"
          >
            <v-icon class="grey--text" style="font-size: inherit"
              >mdi-image-plus</v-icon
            >
          </h1>
        </v-img>

        <v-img :src="upload.cover" v-if="tab == 2" loading="lazy">
          <v-responsive :aspect-ratio="1 / 1">
            <v-card-title
              @click.self="add_dialog_uploader = true"
              class="align-end fill-height"
              style="
                background-image: linear-gradient(
                  to top,
                  rgba(0, 0, 0, 0.8) 0%,
                  transparent 250px
                );
              "
            >
              <div style="width: 100%">
                <h3 class="text-h5 mb-0">
                  <input
                    type="text"
                    placeholder="Title"
                    v-model="upload.title"
                  />
                </h3>
                <div class="d-flex">
                  <h4 class="text-body-2 grey--text">
                    <input
                      style="width: 150px"
                      type="text"
                      placeholder="Artist"
                      v-model="upload.artist"
                    />&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;<input
                      style="width: 150px"
                      type="text"
                      placeholder="Genre"
                      v-model="upload.genre"
                    />
                  </h4>
                </div>
              </div>
            </v-card-title>

            <h1
              v-if="!upload.cover"
              @click="add_dialog_uploader = true"
              class="text-h3 centralize"
            >
              <v-icon class="grey--text" style="font-size: inherit"
                >mdi-image-plus</v-icon
              >
            </h1>
          </v-responsive>
        </v-img>

        <v-card-text class="mt-6 pb-0" v-if="tab != 2">
          <textarea
            v-model="upload.summary"
            placeholder="Summary"
            style="width: 100%"
            rows="5"
          ></textarea>
          <v-file-input v-model="upload.file" label="Upload..."></v-file-input>
        </v-card-text>

        <v-card-text class="mt-4 pb-0" v-else>
          <v-btn
            text
            color="blue accent-1"
            class="mb-3"
            @click="
              upload.songs.push({
                title: '',
                length: '',
                track: upload.songs.length + 1,
                lyrics: {},
                upload: null,
              })
            "
            ><v-icon left>mdi-plus</v-icon>Song</v-btn
          >
          <v-expansion-panels flat hover>
            <v-expansion-panel
              v-for="(song, index) in upload.songs"
              :key="index"
            >
              <v-expansion-panel-header>
                <v-row no-gutters>
                  <v-col sm="2"
                    ><input
                      type="text"
                      v-model="song.track"
                      placeholder="Track"
                  /></v-col>
                  <v-col sm="8"
                    ><input
                      type="text"
                      v-model="song.title"
                      placeholder="Title"
                  /></v-col>
                  <v-col sm="2" class="grey--text"
                    ><input
                      type="text"
                      v-model="song.length"
                      placeholder="Length"
                      style="width: 100%"
                  /></v-col>
                </v-row>
              </v-expansion-panel-header>

              <v-expansion-panel-content class="pb-0">
                <v-row>
                  <v-col sm="6" class="pl-0 pb-0">
                    <p class="my-2">Audio</p>
                    <audio
                      :id="`audio-${index}`"
                      style="max-width: 256px"
                      v-if="song.upload"
                      :src="URL.createObjectURL(song.upload)"
                      controls
                    ></audio>
                    <v-file-input
                      v-model="song.upload"
                      label="File"
                      accept="audio/*"
                      prepend-icon="mdi-music-note-plus"
                    ></v-file-input>
                  </v-col>

                  <v-col sm="6" class="pr-0 pb-0">
                    <v-row>
                      <v-col sm="10" class="pa-0"
                        ><p class="my-2">Lyrics</p></v-col
                      >
                      <v-col sm="2" class="pa-0">
                        <v-btn
                          :disabled="!song.upload"
                          icon
                          @click="addLyricKeyframe(index)"
                          ><v-icon>mdi-clock-check</v-icon></v-btn
                        >
                      </v-col>
                    </v-row>
                    <v-simple-table
                      v-if="song.upload"
                      style="max-height: 300px; overflow-y: auto"
                    >
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left">
                              <v-icon>mdi-clock</v-icon>
                            </th>
                            <th class="text-left">Content</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(lyric, timestamp) in song.lyrics"
                            :key="timestamp"
                          >
                            <td>{{ timestamp }}</td>
                            <td>
                              <input
                                type="text"
                                v-model="song.lyrics[timestamp]"
                                placeholder="Lyric"
                                style="width: 100%"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>

        <v-card-actions>
          <v-btn text color="grey darken-1" @click="cancelUpload()"
            >Cancel</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn text color="blue accent-1" @click="save()" :disabled="false"
            >Upload</v-btn
          >
        </v-card-actions>
        <v-progress-linear
          :active="add_dialog_loading"
          :indeterminate="true"
          absolute
          bottom
          color="deep-purple accent-4"
        ></v-progress-linear>
      </v-card>
    </v-dialog>

    <v-dialog v-model="add_dialog_uploader" max-width="350">
      <v-card>
        <v-card-title class="text-h5 font-weight-medium"
          >UPLOAD IMAGE</v-card-title
        >
        <v-card-text
          ><v-file-input
            accept="image/*"
            prepend-icon=""
            id="file"
            ref="file"
            v-model="upload.cover_file"
            multiple
            label="Upload..."
          ></v-file-input
        ></v-card-text>
        <v-card-actions>
          <v-btn
            @click="
              add_dialog_uploader = false;
              file = null;
            "
            color="grey darken-1"
            text
            >Cancel</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn @click="displayImg()" color="blue accent-1" text>Upload</v-btn>
        </v-card-actions>
        <v-progress-linear
          :active="upload_file_loading"
          :indeterminate="true"
          absolute
          bottom
          color="deep-purple accent-4"
        ></v-progress-linear>
      </v-card>
    </v-dialog>

    <v-btn
      color="deep-purple"
      fab
      fixed
      bottom
      right
      @click="add_dialog = true"
      v-if="tab < 3"
      ><v-icon>mdi-plus</v-icon></v-btn
    >
  </div>
</template>

<script>
export default {
  name: "Media",
  data() {
    return {
      books: [],
      movies: [],
      music: [],
      search: "",
      tab: 0,
      current: {},
      add_dialog: false,
      add_dialog_uploader: false,
      upload_file_loading: false,
      add_dialog_loading: false,
      upload: {
        title: "",
        author: "",
        genre: "",
        file: null,
        cover: "",
        cover_file: null,
        summary: "",
        type: null,
        songs: [],
      },
      new_song: {
        track: "",
        title: "",
        length: "",
        lyrics: [],
        files: [],
      },
      URL,
      Object,
    };
  },
  computed: {
    music_songs() {
      if (this.current.songs) {
        return this.current.songs.sort((a, b) =>
          parseInt(a.track) > parseInt(b.track) ? 1 : -1
        );
      }
    },
    filteredBooks() {
      var books = this.books.filter((book) => {
        return (
          book.title.toLowerCase().includes(this.search.toLowerCase()) ||
          book.author.toLowerCase().includes(this.search.toLowerCase())
        );
      });

      var sorted = books.sort((a, b) => {
        var nameA = a.title.toLowerCase();
        var nameB = b.title.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });

      return sorted;
    },
    filteredMovies() {
      var movies = this.movies.filter((movie) => {
        return (
          movie.title.toLowerCase().includes(this.search.toLowerCase()) ||
          movie.genre.toLowerCase().includes(this.search.toLowerCase())
        );
      });

      var sorted = movies.sort((a, b) => {
        var nameA = a.title.toLowerCase();
        var nameB = b.title.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });

      return sorted;
    },
    filteredMusic() {
      var music = this.music.filter((item) => {
        var isSong = false;
        item.songs.forEach((song) => {
          if (song.title.toLowerCase().includes(this.search.toLowerCase()))
            isSong = true;
        });
        return (
          item.title.toLowerCase().includes(this.search.toLowerCase()) ||
          item.artist.toLowerCase().includes(this.search.toLowerCase()) ||
          item.genre.toLowerCase().includes(this.search.toLowerCase()) ||
          isSong
        );
      });

      var sorted = music.sort((a, b) => {
        var nameA = a.title.toLowerCase();
        var nameB = b.title.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });

      return sorted;
    },
  },
  async created() {
    await this.$http
      .get("https://www.theparadigmdev.com/api/media/books/get")
      .then((response) => {
        this.books = response.data;
      })
      .catch((error) => console.error(error));
    await this.$http
      .get("https://www.theparadigmdev.com/api/media/movies/get")
      .then((response) => {
        this.movies = response.data;
      })
      .catch((error) => console.error(error));
    await this.$http
      .get("https://www.theparadigmdev.com/api/media/music/get")
      .then((response) => {
        this.music = response.data;
      })
      .catch((error) => console.error(error));

    if (this.$root.url[1] == "media") {
      switch (this.$root.url[2]) {
        case "books":
          await this.books.forEach(async (book) => {
            if (this.$root.url[3] == book._id) {
              this.tab = 0;
              await this.openBook(book._id);
            }
          });
          break;
        case "movies":
          await this.movies.forEach(async (movie) => {
            if (this.$root.url[3] == movie._id) {
              this.tab = 1;
              await this.openMovie(movie._id);
            }
          });
          break;
        case "music":
          await this.music.forEach(async (item) => {
            if (this.$root.url[3] == item._id) {
              this.tab = 2;
              await this.openMusic(item._id);
            }
          });
          break;
      }
    }
  },
  methods: {
    // Books
    openBook(index) {
      this.current = this.filteredBooks[index];
      const savedIndex = this.$root.user.books.findIndex(
        (book) => this.current._id === book.book_id
      );
      if (savedIndex > -1)
        this.current.favorite = this.$root.user.books[savedIndex].favorite;
      if (savedIndex > -1)
        this.current.rating = this.$root.user.books[savedIndex].rating;
      this.current.type = "book";
      this.current.open = true;
    },
    updateUserBook() {
      this.$http
        .post(
          `https://www.theparadigmdev.com/api/users/${this.$root.user._id}/media/books/${this.current._id}/update`,
          {
            rating: this.current.rating,
            favorite: this.current.favorite,
          }
        )
        .then((response) => {
          this.$root.user = response.data;
        })
        .catch((error) => console.error(error));
    },
    readBook() {
      window.open(this.current.link);
    },

    // Movies
    openMovie(index) {
      this.current = this.filteredMovies[index];
      const savedIndex = this.$root.user.movies.findIndex(
        (movie) => this.current._id === movie.movie_id
      );
      if (savedIndex > -1)
        this.current.favorite = this.$root.user.movies[savedIndex].favorite;
      if (savedIndex > -1)
        this.current.rating = this.$root.user.movies[savedIndex].rating;
      this.current.type = "movie";
      this.current.open = true;
    },
    updateUserMovie() {
      this.$http
        .post(
          `https://www.theparadigmdev.com/api/users/${this.$root.user._id}/media/movies/${this.current._id}/update`,
          {
            rating: this.current.rating,
            favorite: this.current.favorite,
          }
        )
        .then((response) => {
          this.$root.user = response.data;
        })
        .catch((error) => console.error(error));
    },
    watchMovie() {
      window.open(this.current.link);
    },

    // Music
    openMusic(index) {
      this.current = this.filteredMusic[index];
      const savedIndex = this.$root.user.music.findIndex(
        (music) => this.current._id === music.music_id
      );
      if (savedIndex > -1)
        this.current.favorite = this.$root.user.music[savedIndex].favorite;
      if (savedIndex > -1)
        this.current.rating = this.$root.user.music[savedIndex].rating;
      this.current.type = "music";
      this.current.open = true;
    },
    updateUserMusic() {
      this.$http
        .post(
          `https://www.theparadigmdev.com/api/users/${this.$root.user._id}/media/music/${this.current._id}/update`,
          {
            rating: this.current.rating,
            favorite: this.current.favorite,
          }
        )
        .then((response) => {
          this.$root.user = response.data;
        })
        .catch((error) => console.error(error));
    },
    playSong(song) {
      this.$root.music = [
        {
          artist: this.current.artist,
          cover: this.current.cover,
          song_title: song.title,
          genre: this.current.genre,
          album_title: this.current.title,
          lyrics: song.lyrics,
          file: song.file,
          track: song.track,
        },
      ];
    },
    playAlbum() {
      let list = [];
      this.current.songs.forEach((song) => {
        list.push({
          artist: this.current.artist,
          cover: this.current.cover,
          song_title: song.title,
          genre: this.current.genre,
          album_title: this.current.title,
          lyrics: song.lyrics,
          file: song.file,
          track: song.track,
        });
      });

      this.$root.music = list;
    },
    playShuffle() {
      let new_array = [];
      let new_temp_array = JSON.parse(JSON.stringify(this.current.songs));
      new_temp_array.forEach((song) => {
        new_array.push({
          artist: this.current.artist,
          cover: this.current.cover,
          song_title: song.title,
          genre: this.current.genre,
          album_title: this.current.title,
          lyrics: song.lyrics,
          file: song.file,
          track: song.track,
        });
      });

      function shuffle(array) {
        var currentIndex = array.length,
          temporaryValue,
          randomIndex;

        while (0 !== currentIndex) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;

          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }

        return array;
      }

      shuffle(new_array);

      this.$root.music = new_array;
    },

    // Uploading
    displayImg() {
      this.upload.cover = URL.createObjectURL(this.upload.cover_file[0]);
      this.add_dialog_uploader = false;
    },
    addLyricKeyframe(index) {
      const audio = document.querySelector(`#audio-${index}`);
      this.upload.songs[index].lyrics[Math.round(audio.currentTime)] = "";
      const oldTimeStamp = audio.currentTime;
      this.$forceUpdate();
      this.$nextTick(() => {
        audio.currentTime = oldTimeStamp;
        audio.play();
        console.log(audio.currentTime);
      });
    },
    save() {
      this.add_dialog_loading = true;
      // switch (this.tab) {
      //   case 0: this.upload.type = 'book'
      //   case 1: this.upload.type = 'movie'
      //   case 2: this.upload.type = 'music'
      // }
      if (this.tab == 0) this.upload.type = "book";
      if (this.tab == 1) this.upload.type = "movie";
      if (this.tab == 2) this.upload.type = "music";
      this.$http
        .post(
          `https://www.theparadigmdev.com/api/media/create/data`,
          this.upload
        )
        .then((response) => {
          console.log(response);
          let formData = new FormData();
          formData.append("cover", this.upload.cover_file[0]);
          if (this.upload.type != "music")
            formData.append("file", this.upload.file);
          else {
            this.upload.songs.forEach((song, index) => {
              formData.append(song.track, song.upload);
            });
          }
          this.$http
            .post(
              `https://www.theparadigmdev.com/api/media/create/${response.data._id}/files/${this.upload.type}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            )
            .then((response) => {
              this.add_dialog = false;
              this.add_dialog_loading = false;
              this.upload = {
                title: "",
                author: "",
                genre: "",
                file: null,
                cover: "",
                cover_file: null,
                summary: "",
                type: null,
                songs: [],
              };
            });
        })
        .catch((error) => console.error(error));
    },
    cancelUpload() {
      this.add_dialog = false;
      this.add_dialog_loading = false;
      this.upload = {
        title: "",
        author: "",
        genre: "",
        file: null,
        cover: "",
        cover_file: null,
        summary: "",
        type: null,
        songs: [],
      };
    },
  },
};
</script>

<style scoped>
.scroll-container {
  height: calc(100vh - 160px);
  overflow-y: auto;
}

.v-slide-group__prev {
  display: none !important;
}

.v-card.v-sheet {
  border: none !important;
}
</style>
