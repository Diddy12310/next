<template>
  <v-app-bar app color="#0F1E3C" class="pa-0">
    <v-row class="fill-height align-center pa-0 mt-n2 ml-n4" no-gutters>
      <v-col sm="4" class="pa-0">
        <div
          :class="{
            'd-flex': true,
            'align-center': true,
            'text-center mt-2': $vuetify.breakpoint.xsOnly,
          }"
        >
          <img
            style="height: 64px !important; width: 64px !important;"
            class="hidden-xs-only"
            :src="$root.music[0].cover"
          />
          <div
            :class="{ 'ml-3': $vuetify.breakpoint.smAndUp }"
            style="width: 100%;"
          >
            <h3
              class="text-h5 mb-0 leading-none"
              style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;"
            >
              {{ $root.music[0].song_title }}
            </h3>
            <h4
              class="text-body-1 font-weight-regular grey--text leading-tight"
            >
              {{ $root.music[0].artist }}&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;{{
                $root.music[0].album_title
              }}
            </h4>
          </div>
        </div>
      </v-col>

      <v-col sm="4">
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

      <v-col sm="1" class="content-center">
        <span>{{ currentTime }}</span>
        <span class="font-weight-light"> / {{ duration }}</span>
      </v-col>

      <v-col sm="3" class="w-full">
        <v-btn
          large
          text
          icon
          class="primary--text"
          :loading="!loaded"
          @click.native="loaded ? (playing ? pause() : play()) : reload()"
        >
          <v-icon v-if="playing === false || paused === true">mdi-play</v-icon>
          <v-icon v-else>mdi-pause</v-icon>
        </v-btn>
        <v-btn text large icon class="primary--text" @click.native="stop()">
          <v-icon>mdi-stop</v-icon>
        </v-btn>
        <v-btn text large icon class="primary--text" @click.native="mute()">
          <v-icon v-if="isMuted === false">mdi-volume-high</v-icon>
          <v-icon v-else>mdi-volume-off</v-icon>
        </v-btn>
        <v-btn
          text
          large
          icon
          class="primary--text"
          v-model="repeat"
          @click.native="repeat = !repeat"
        >
          <v-icon>mdi-repeat</v-icon>
        </v-btn>
        <v-btn
          v-if="$root.user.rights.asteroid"
          text
          large
          icon
          class="primary--text"
          @click.native="download()"
        >
          <v-icon>mdi-download</v-icon>
        </v-btn>
        <v-btn
          text
          icon
          large
          class="primary--text"
          :input-value="lyrics"
          @click.native="lyrics = !lyrics"
          v-if="$root.music[0].lyrics"
        >
          <v-icon>mdi-closed-caption</v-icon>
        </v-btn>
        <v-btn
          text
          large
          icon
          class="primary--text"
          @click.native="clearSession()"
        >
          <v-icon>mdi-notification-clear-all</v-icon>
        </v-btn>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              large
              class="absolute"
              style="right: 20px;"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-dots-grid</v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item-group v-model="$root.router" mandatory>
              <v-list-item
                v-for="(item, index) in $root.nav"
                :key="index"
                :value="item.content"
              >
                <v-list-item-icon
                  ><v-icon>{{ item.icon }}</v-icon></v-list-item-icon
                >
                <v-list-item-title>{{ item.content }}</v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item value="Account">
                <v-list-item-icon
                  ><v-icon>mdi-account</v-icon></v-list-item-icon
                >
                <v-list-item-title>Account</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
            <v-list-item @click="signOut()">
              <v-list-item-icon
                ><v-icon>mdi-logout-variant</v-icon></v-list-item-icon
              >
              <v-list-item-title>Sign out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>

      <v-slider
        fluid
        :height="2"
        class="pa-0 my-0 ml-n2 mr-2 relative bottom-0 w-full"
        style="width: 100vw;"
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
      this.audio.pause();
      this.refreshTitle();
      window.open(this.file, "download");
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
      // console.log(Math.round(this.audio.currentTime))
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
        if (!this.$root.music[0]) this.stop();
        this.refreshTitle();
      }
      this.lyricTime = 0;
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
      if (this.$root.music[0].playing)
        document.title = `${this.$root.music[0].title} by ${this.$root.music[0].artist} - Paradigm`;
      else document.title = "Paradigm";
    },
    _handleNextSong() {},
  },
  mounted() {
    this.audio = this.$refs.player;
    this.init();
    this.reload();
  },
  beforeDestroy() {
    this.audio.removeEventListener("timeupdate", this._handlePlayingUI);
    this.audio.removeEventListener("loadeddata", this._handleLoaded);
    this.audio.removeEventListener("pause", this._handlePlayPause);
    this.audio.removeEventListener("play", this._handlePlayPause);
    this.audio.removeEventListener("ended", this._handleEnded);
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
