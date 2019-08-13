<template>
  <v-card tile>
    <v-slider ref="slider" @click.native="setPosition()" v-on:change="setPosition()" v-model="percentage"></v-slider>

    <v-layout fill-height wrap align-center>
      <v-flex sm7 xs12>
        <div :class="{ 'd-flex': true, 'align-center': true, 'text-center mt-2': $vuetify.breakpoint.xsOnly }">
          <img style="height: 100px; width: 100px;" class="hidden-xs-only" :src="$root.music_player.cover">
          <div style="width: 100%; margin-left: 12px;">
            <h3 class="headline mb-0">{{ $root.music_player.title }}</h3>
            <h4 class="subtitle-1 grey--text">{{ $root.music_player.author }}&nbsp;&nbsp;|&nbsp;&nbsp;{{ $root.music_player.album }}</h4>
          </div>
        </div>
      </v-flex>

      <v-spacer></v-spacer>

      <v-flex sm2 :class="{ 'text-right': $vuetify.breakpoint.smAndUp, 'text-center': $vuetify.breakpoint.xsOnly }">
        <span>{{ currentTime }}</span><span class="font-weight-light"> / {{ duration }}</span>
      </v-flex>

      <v-flex sm3 xs12 text-right :class="{ 'text-center': $vuetify.breakpoint.xsOnly, 'pr-3': $vuetify.breakpoint.smAndUp }">
        <v-btn text icon class="primary--text" :loading="!loaded" @click.native="loaded ? playing ? pause() : play() : reload()">
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
        <v-btn text icon class="primary--text" @click.native="download()">
          <v-icon>mdi-download</v-icon>
        </v-btn>
        <v-btn text icon class="primary--text" @click.native="clearSession()">
          <v-icon>mdi-notification-clear-all</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>

    <audio id="player" ref="player" v-on:ended="ended" v-on:canplay="canPlay" :src="file"></audio>
  </v-card>
</template>

<script>
const formatTime = (second) => {
  return new Date(second * 1000).toISOString().substr(11, 8)
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
      currentTime: '00:00:00',
    	audio: undefined,
      totalDuration: 0,
      repeat: false
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
    },
    stop() {
      this.paused = this.playing = false
      this.audio.pause()
      this.audio.currentTime = 0
    },
    play() {
      if (this.playing) return
      	this.paused = false
        this.audio.play()
        this.playing = true
    },
    pause() {
      this.paused = !this.paused;
      (this.paused) ? this.audio.pause() : this.audio.play()
    },
    download() {
      this.audio.pause()
      window.open(this.file, 'download')
    },
    mute() {
      this.isMuted = !this.isMuted
      this.audio.muted = this.isMuted
      this.volumeValue = this.isMuted ? 0 : 75
    },
    reload() {
      this.audio.load()
    },
    _handleLoaded() {
      if (this.audio.readyState >= 2) {
        if (this.autoPlay) {
          this.audio.play()
          this.paused = false
          this.playing = true
        }
        this.loaded = true
        this.totalDuration = parseInt(this.audio.duration)
      } else {
        throw new Error('Failed to load sound file')
      }
    },
    _handlePlayingUI(e) {
      this.percentage = this.audio.currentTime / this.audio.duration * 100
      this.currentTime = formatTime(this.audio.currentTime)
		},
		_handlePlayPause(e) {
			if (e.type === 'pause' && this.paused === false && this.playing === false) {
				this.currentTime = '00:00:00'
			}
		},
		_handleEnded() {
      this.paused = this.playing = false
      if (this.repeat) {
        this.play()
      } else {
        this.stop()
      }
    },
		init() {
			this.audio.addEventListener('timeupdate', this._handlePlayingUI)
			this.audio.addEventListener('loadeddata', this._handleLoaded)
			this.audio.addEventListener('pause', this._handlePlayPause)
			this.audio.addEventListener('play', this._handlePlayPause)
			this.audio.addEventListener('ended', this._handleEnded)
    },
    clearSession() {
      this.$root.music_player = {}
      this.stop()
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
		this.audio.removeEventListener('ended', this._handleEnded);
  },
  computed: {
    duration() {
      return this.audio ? formatTime(this.totalDuration) : ''
    },
  }
}
</script>

<style>
.v-slider--horizontal {
  min-height: 0px !important;
  margin: 0px !important;
}

.v-input__slot {
  margin: 0px !important;
}

.v-messages {
  display: none;
}
</style>
