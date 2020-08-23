<template>
  <v-card tile color="transparent" @keypress.space="playing ? pause() : play()" v-if="$root.music[0]">
		<!-- <div :style="{ backgroundImage: `url('${$root.music.cover}')`, filter: `blur(10px)`, backgroundPosition: 'center', backgroundSize: 'cover', height: '80px', width: '100vw', position: 'absolute', bottom: '0px' }"></div> -->

    <v-slider fluid :height="2" class="pa-0 ma-0" style="width: 100vw;" dense hide-details ref="slider" @click.native="setPosition()" v-on:change="setPosition()" v-model="percentage"></v-slider>

    <v-layout fill-height wrap align-center>
      <v-flex sm4 xs12>
        <div :class="{ 'd-flex': true, 'align-center': true, 'text-center mt-2': $vuetify.breakpoint.xsOnly }">
          <img style="height: 80px !important; width: 80px !important;" class="hidden-xs-only" :src="$root.music[0].cover">
          <div :class="{ 'ml-3': $vuetify.breakpoint.smAndUp }" style="width: 100%;">
            <h3 class="text-h5 mb-0">{{ $root.music[0].song_title }}</h3>
            <h4 class="text-body-1 font-weight-regular grey--text">{{ $root.music[0].artist }}&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;{{ $root.music[0].album_title }}</h4>
          </div>
        </div>
      </v-flex>

      <v-flex sm4 xs12>
        <div class="align-center">
          <v-scroll-y-reverse-transition group mode="in-out" hide-on-leave>
            <p class="text-h6 text-center my-0" v-if="lyrics && $root.music[0].lyrics" :key="lyricTime">{{ $root.music[0].lyrics[lyricTime] }}</p>
          </v-scroll-y-reverse-transition>
        </div>
      </v-flex>

      <!-- <v-flex @click="styledTime = !styledTime" sm1 :class="{ 'text-right': $vuetify.breakpoint.smAndUp, 'text-center': $vuetify.breakpoint.xsOnly }"> -->
      <v-flex sm1 :class="{ 'text-right': $vuetify.breakpoint.smAndUp, 'text-center': $vuetify.breakpoint.xsOnly }">
        <span>{{ currentTime }}</span><span class="font-weight-light"> / {{ duration }}</span>
      </v-flex>

      <v-flex sm3 xs12 text-right :class="{ 'text-center': $vuetify.breakpoint.xsOnly, 'pr-3': $vuetify.breakpoint.smAndUp }">
        <v-btn x-large text icon class="primary--text" :loading="!loaded" @click.native="loaded ? playing ? pause() : play() : reload()">
          <v-icon v-if="playing === false || paused === true">mdi-play</v-icon>
          <v-icon v-else>mdi-pause</v-icon>
        </v-btn>
        <v-btn text icon class="primary--text" @click.native="stop()">
          <v-icon>mdi-stop</v-icon>
        </v-btn>
        <v-btn text icon class="primary--text" @click.native="mute()">
          <v-icon v-if="isMuted === false">mdi-volume-high</v-icon>
          <v-icon v-else>mdi-volume-off</v-icon>
        </v-btn>
        <v-btn text icon class="primary--text" v-model="repeat" @click.native="repeat = !repeat">
          <v-icon>mdi-repeat</v-icon>
        </v-btn>
        <v-btn v-if="$root.user.rights.asteroid" text icon class="primary--text" @click.native="download()">
          <v-icon>mdi-download</v-icon>
        </v-btn>
        <v-btn text icon class="primary--text" :input-value="lyrics" @click.native="lyrics = !lyrics" v-if="$root.music[0].lyrics">
          <v-icon>mdi-closed-caption</v-icon>
        </v-btn>
        <v-btn text icon class="primary--text" @click.native="clearSession()">
          <v-icon>mdi-notification-clear-all</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>

    <audio id="player" ref="player" v-on:ended="ended" v-on:canplay="canPlay" :src="$root.music[0].file"></audio>
  </v-card>
</template>

<script>
const formatTime = (second) => {
  return new Date(second * 1000).toISOString().substr(14, 5)
}

export default {
  name: 'MusicPlayer',
  data() {
    return {
      isMuted: false,
      loaded: false,
      playing: false,
      paused: false,
      percentage: 0,
      currentTime: '00:00',
      lyricTime: '0',
    	audio: undefined,
      totalDuration: 0,
      repeat: false,
      lyrics: false
    }
  },
  props: {
    file: {
      type: String,
      default: null
    },
    autoPlay: {
      type: Boolean,
      default: false
    },
    ended: {
      type: Function,
      default: () => {},
    },
    canPlay: {
      type: Function,
      default: () => {},
    },
    index: {
      type: Number,
      default: null
    }
  },
  methods: {
  	setPosition() {
      this.audio.currentTime = parseInt(this.audio.duration / 100 * this.percentage)
      this.refreshTitle()
    },
    stop() {
      this.paused = this.playing = false
      this.audio.pause()
      this.audio.currentTime = 0
      this.refreshTitle()
    },
    play() {
      if (this.playing) return
      	this.paused = false
        this.audio.play()
        this.playing = true
        this.refreshTitle()
    },
    pause() {
      this.paused = !this.paused;
      (this.paused) ? this.audio.pause() : this.audio.play()
      this.refreshTitle()
    },
    download() {
      this.audio.pause()
      this.refreshTitle()
      window.open(this.file, 'download')
    },
    mute() {
      this.isMuted = !this.isMuted
      this.audio.muted = this.isMuted
      this.volumeValue = this.isMuted ? 0 : 75
      this.refreshTitle()
    },
    reload() {
      this.audio.load()
      this.refreshTitle()
    },
    _handleLoaded() {
      if (this.audio.readyState >= 2) {
        this.audio.play()
        this.paused = false
        this.playing = true
        if (this.$root.music[0].lyrics) this.lyrics = true
        this.loaded = true
        this.totalDuration = parseInt(this.audio.duration)
        this.refreshTitle()
      } else {
        throw new Error('Failed to load sound file')
      }
    },
    _handlePlayingUI(e) {
      this.percentage = this.audio.currentTime / this.audio.duration * 100
      this.currentTime = formatTime(this.audio.currentTime)
      if (this.$root.music[0].lyrics) {
        if (this.$root.music[0].lyrics[Math.round(this.audio.currentTime)]) this.lyricTime = Math.round(this.audio.currentTime)
      }
      // console.log(Math.round(this.audio.currentTime))
      this.refreshTitle()
		},
		_handlePlayPause(e) {
			if (e.type === 'pause' && this.paused === false && this.playing === false) {
        this.currentTime = '00:00'
        this.refreshTitle()
			}
		},
		_handleEnded() {
      this.paused = this.playing = false
      if (this.repeat) {
        this.play()
        this.refreshTitle()
      } else {
        this.stop()
        this.refreshTitle()
      }
      this.lyricTime = 0
    },
		init() {
			this.audio.addEventListener('timeupdate', this._handlePlayingUI)
			this.audio.addEventListener('loadeddata', this._handleLoaded)
			this.audio.addEventListener('pause', this._handlePlayPause)
			this.audio.addEventListener('play', this._handlePlayPause)
      this.audio.addEventListener('ended', this._handleEnded)
      this.refreshTitle()
    },
    clearSession() {
      this.$root.view.music = false
      this.$root.music = []
      this.stop()
      this.refreshTitle()
    },
    refreshTitle() {
      if (this.$root.music[0].playing) document.title = `${this.$root.music[0].title} by ${this.$root.music[0].artist} - Paradigm`
      else document.title = 'Paradigm'
    }
	},
	mounted() {
		this.audio = this.$refs.player
    this.init()
    this.reload()
	},
	beforeDestroy() {
		this.audio.removeEventListener('timeupdate', this._handlePlayingUI)
		this.audio.removeEventListener('loadeddata', this._handleLoaded)
		this.audio.removeEventListener('pause', this._handlePlayPause)
		this.audio.removeEventListener('play', this._handlePlayPause)
    this.audio.removeEventListener('ended', this._handleEnded)
    this.refreshTitle()
  },
  computed: {
    duration() {
      return this.audio ? formatTime(this.totalDuration) : '--:--'
    },
  }
}
</script>

<style scoped>
/* .v-slider {
  padding: 0px !important;
  margin: 0px !important;
} */
</style>
