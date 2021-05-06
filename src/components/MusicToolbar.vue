<template>
  <v-app-bar app color="#0F1E3C" class="pa-0">
    <v-row class="fill-height align-center pa-0 mt-n2 ml-n4" no-gutters>
      <v-col cols="2" lg="4" class="pa-0">
        <v-slide-x-transition group hide-on-leave leave-absolute>
          <div
            :class="{
              'd-flex': $vuetify.breakpoint.lgAndUp,
              'align-center': true,
            }"
            v-if="!$root.notification"
            key="album"
          >
            <img
              :style="{
                height: $vuetify.breakpoint.smAndDown ? '56px' : '64px',
              }"
              :src="$root.music[0].cover"
            />
            <div
              v-if="$vuetify.breakpoint.lgAndUp"
              :class="{ 'ml-3': $vuetify.breakpoint.lgAndUp }"
              style="width: 100%"
            >
              <h3
                class="text-h5 mb-0 leading-none"
                style="
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  overflow: hidden;
                "
              >
                {{ $root.music[0].song_title }}
              </h3>
              <h4
                class="text-body-1 font-weight-regular grey--text leading-tight"
              >
                {{
                  $root.music[0].artist
                }}&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;{{
                  $root.music[0].album_title
                }}
              </h4>
            </div>
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
      </v-col>

      <v-col sm="4" v-if="$vuetify.breakpoint.lgAndUp">
        <div class="align-center">
          <v-scroll-y-reverse-transition group mode="in-out" hide-on-leave>
            <p
              class="text-h6 text-center my-0"
              v-if="lyrics && $root.music[0].lyrics"
              :key="lyricTime"
            >
              {{ $root.music[0].lyrics[lyricTime] }}
            </p>
          </v-scroll-y-reverse-transition>
        </div>
      </v-col>

      <v-col sm="1" class="content-center" v-if="$vuetify.breakpoint.lgAndUp">
        <span>{{ currentTime }}</span>
        <span class="font-weight-light"> / {{ duration }}</span>
      </v-col>

      <v-col
        cols="10"
        lg="3"
        class="w-full"
        :class="{ centralize: $vuetify.breakpoint.mdAndDown }"
      >
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              large
              icon
              class="primary--text"
              :loading="!loaded"
              v-on="on"
              v-bind="attrs"
              @click.native="loaded ? (playing ? pause() : play()) : reload()"
            >
              <v-icon v-if="playing === false || paused === true"
                >mdi-play</v-icon
              >
              <v-icon v-else>mdi-pause</v-icon>
            </v-btn>
          </template>
          <span>{{ playing ? "Pause (k)" : "Play (k)" }}</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              large
              icon
              class="primary--text"
              @click.native="mute()"
              v-on="on"
              v-bind="attrs"
            >
              <v-icon v-if="isMuted === false">mdi-volume-high</v-icon>
              <v-icon v-else>mdi-volume-off</v-icon>
            </v-btn>
          </template>
          <span>{{ isMuted ? "Unmute (m)" : "Mute (m)" }}</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              large
              icon
              class="primary--text"
              v-model="repeat"
              v-on="on"
              v-bind="attrs"
              @click.native="repeat = !repeat"
            >
              <v-icon>mdi-repeat</v-icon>
            </v-btn>
          </template>
          <span>{{ repeat ? "Stop repeating (r)" : "Repeat (r)" }}</span>
        </v-tooltip>

        <v-tooltip
          bottom
          v-if="$root.user.rights.asteroid && $vuetify.breakpoint.lgAndUp"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              large
              icon
              class="primary--text"
              @click.native="download()"
              v-on="on"
              v-bind="attrs"
            >
              <v-icon>mdi-download</v-icon>
            </v-btn>
          </template>
          <span>Download</span>
        </v-tooltip>

        <v-tooltip
          bottom
          v-if="$root.music[0].lyrics && $vuetify.breakpoint.lgAndUp"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              large
              class="primary--text"
              :input-value="lyrics"
              @click.native="lyrics = !lyrics"
              v-on="on"
              v-bind="attrs"
            >
              <v-icon>mdi-closed-caption</v-icon>
            </v-btn>
          </template>
          <span>{{ lyrics ? "Hide lyrics (l)" : "Show lyrics (l)" }}</span>
        </v-tooltip>

        <v-menu
          offset-y
          style="background-color: #1e1e1e"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on: menu, attrs }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on: tooltip }">
                <v-btn
                  icon
                  large
                  v-bind="attrs"
                  v-on="{ ...menu, ...tooltip }"
                  class="primary--text"
                >
                  <v-icon>mdi-playlist-music</v-icon>
                </v-btn>
              </template>
              <span>Playlist</span>
            </v-tooltip>
          </template>
          <v-list dense class="pa-0 ma-0">
            <v-list-item
              v-for="(song, index) in $root.music"
              :key="index"
              class="pl-0"
            >
              <v-list-item-avatar
                tile
                class="my-0"
                style="height: 64px; width: 78.35px"
                ><v-img tile :src="song.cover"></v-img
              ></v-list-item-avatar>
              <v-list-item-title>
                <v-row no-gutters align="center">
                  <v-col cols="10">{{ song.song_title }}</v-col>
                  <v-col cols="2" class="text-right"
                    ><v-btn
                      icon
                      color="red"
                      @click="
                        $root.music[1]
                          ? $root.music.splice(index, 1)
                          : clearSession()
                      "
                      ><v-icon>mdi-close</v-icon></v-btn
                    ></v-col
                  >
                </v-row>
              </v-list-item-title>
            </v-list-item>
            <!-- <v-btn
              class="mx-auto text-center"
              color="blue accent-1"
              @click="clearSession()"
              text
              >Clear All</v-btn
            > -->
          </v-list>
        </v-menu>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              large
              icon
              class="primary--text"
              @click.native="clearSession()"
              v-on="on"
              v-bind="attrs"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <span>Close (x)</span>
        </v-tooltip>

        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              large
              :style="{
                right: $vuetify.breakpoint.lgAndUp ? '20px' : '-10.5px',
              }"
              style="position: absolute"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-dots-grid</v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item
              @click="$route.path == '/account' ? '' : $router.push('/account')"
              style="z-index: 1"
            >
              <v-list-item-avatar
                ><v-img
                  :src="`https://www.theparadigm.ga/relay/profile-pics/${$root.user._id}.png`"
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
              :to="item.path"
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
          </v-list>
        </v-menu>
      </v-col>

      <v-slider
        fluid
        :height="2"
        :class="{ 'mt-n3': $vuetify.breakpoint.mdAndDown }"
        class="pa-0 my-0 ml-n2 mr-2 relative bottom-0 w-full"
        style="width: 100vw"
        dense
        hide-details
        ref="slider"
        @click.native="setPosition()"
        v-on:change="setPosition()"
        v-model="percentage"
      ></v-slider>
    </v-row>

    <audio
      id="player"
      ref="player"
      @pause="paused = true"
      @play="paused = false"
      @volumechange="_handleVolumeChange"
      :src="$root.music[0].file"
    ></audio>
  </v-app-bar>
</template>

<script>
const formatTime = (second) => {
  return new Date(second * 1000).toISOString().substr(14, 5);
};

export default {
  name: "MusicToolbar",
  data() {
    return {
      isMuted: false,
      loaded: false,
      playing: false,
      paused: false,
      percentage: 0,
      currentTime: "00:00",
      lyricTime: "0",
      audio: undefined,
      totalDuration: 0,
      repeat: false,
      lyrics: false,
    };
  },
  methods: {
    signOut() {
      if (this.$root.user) {
        this.$root.user = false;
        this.$router.push("/");
        this.$root.profile = false;
        this.$root.music = false;
        this.$root.transmission = false;
        this.$root.socket.emit("logout", {
          _id: this.$root.user._id,
          username: this.$root.user.username,
        });
        this.$http.get("/api/authentication/signout");
      }
    },
    setPosition() {
      this.audio.currentTime = parseInt(
        (this.audio.duration / 100) * this.percentage
      );
      this.refreshTitle();
    },
    stop() {
      this.paused = this.playing = false;
      this.audio.pause();
      this.audio.currentTime = 0;
      this.refreshTitle();
    },
    play() {
      if (this.playing) return;
      this.paused = false;
      this.audio.play();
      this.playing = true;
      this.refreshTitle();
    },
    pause() {
      this.paused = !this.paused;
      this.paused ? this.audio.pause() : this.audio.play();
      this.refreshTitle();
    },
    download() {
      window.open(this.$root.music[0].file, "download");
    },
    mute() {
      this.isMuted = !this.isMuted;
      this.audio.muted = this.isMuted;
      this.volumeValue = this.isMuted ? 0 : 75;
      this.refreshTitle();
    },
    reload() {
      this.audio.load();
      this.refreshTitle();
    },
    _handleLoaded() {
      if (this.audio.readyState >= 2) {
        this.audio.play();
        this.paused = false;
        this.playing = true;
        if (this.$root.music[0].lyrics) this.lyrics = true;
        this.loaded = true;
        this.totalDuration = parseInt(this.audio.duration);
        this.refreshTitle();
      } else {
        throw new Error("Failed to load sound file");
      }
    },
    _handlePlayingUI(e) {
      this.percentage = (this.audio.currentTime / this.audio.duration) * 100;
      this.currentTime = formatTime(this.audio.currentTime);
      if (this.$root.music[0].lyrics) {
        if (this.$root.music[0].lyrics[Math.round(this.audio.currentTime)])
          this.lyricTime = Math.round(this.audio.currentTime);
      }
      this.refreshTitle();
    },
    _handlePlayPause(e) {
      if (
        e.type === "pause" &&
        this.paused === false &&
        this.playing === false
      ) {
        this.currentTime = "00:00";
        this.refreshTitle();
      }
    },
    _handleEnded() {
      this.paused = this.playing = false;
      if (this.repeat) {
        this.play();
        this.refreshTitle();
      } else {
        this.$root.music.shift();
        if (!this.$root.music[0]) this.clearSession();
        this.refreshTitle();
      }
      this.lyricTime = 0;
    },
    _handleVolumeChange(e) {
      if (e.srcElement.muted) this.muted = true;
    },
    _handleKeyboardEvents(event) {
      if (event.target == document.querySelector("body")) {
        if (event.code == "KeyK") this.playing ? this.pause() : this.play();
        else if (event.code == "KeyM") this.mute();
        else if (event.code == "KeyR") this.repeat = !this.repeat;
        else if (event.code == "KeyX") this.clearSession();
        else if (event.code == "KeyL") this.lyrics = !this.lyrics;
        else if (event.code == "Home") {
          event.preventDefault();
          this.percentage = 0;
          this.setPosition();
        } else if (event.code == "End") {
          event.preventDefault();
          this.percentage = 100;
          this.setPosition();
        }
      }
    },
    init() {
      this.audio.addEventListener("timeupdate", this._handlePlayingUI);
      this.audio.addEventListener("loadeddata", this._handleLoaded);
      this.audio.addEventListener("pause", this._handlePlayPause);
      this.audio.addEventListener("play", this._handlePlayPause);
      this.audio.addEventListener("ended", this._handleEnded);
      this.refreshTitle();
    },
    clearSession() {
      this.$root.music = false;
      this.stop();
      this.refreshTitle();
    },
    refreshTitle() {
      if (this.$root.music) {
        if (this.$root.music[0].playing)
          document.title = `${this.$root.music[0].title} by ${this.$root.music[0].artist} - Paradigm`;
        else document.title = "Paradigm";
      } else document.title = "Paradigm";
    },
    _handleNextSong() {},
  },
  mounted() {
    this.audio = this.$refs.player;
    this.playing = false;
    this.init();
    this.reload();
    window.addEventListener("keydown", this._handleKeyboardEvents);
  },
  beforeDestroy() {
    this.audio.removeEventListener("timeupdate", this._handlePlayingUI);
    this.audio.removeEventListener("loadeddata", this._handleLoaded);
    this.audio.removeEventListener("pause", this._handlePlayPause);
    this.audio.removeEventListener("play", this._handlePlayPause);
    this.audio.removeEventListener("ended", this._handleEnded);
    window.removeEventListener("keydown", this._handleKeyboardEvents);
    this.refreshTitle();
  },
  computed: {
    duration() {
      return this.audio ? formatTime(this.totalDuration) : "--:--";
    },
  },
};
</script>

<style scoped>
.v-toolbar__content {
  padding: none !important;
}

.v-slider .v-slider--horizontal {
  padding: 0px !important;
}
</style>
