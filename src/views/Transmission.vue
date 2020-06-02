<template>
  <div class="transmission">
    <v-toolbar dense color="deep-purple darken-1">
      <v-toolbar-title>Transmission</v-toolbar-title>
    </v-toolbar>

    <v-list>
      <v-list-item @click="peer = friend" v-for="(friend, index) in $root.user.people.approved" :key="index">
        <v-list-item-avatar><v-img :src="friend.pic"></v-img></v-list-item-avatar>
        <v-list-item-title :style="{ color: friend.color }">{{ friend.username }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-btn :disabled="!peer" @click="startCall()">Start</v-btn>

    <video id="video"></video>
    <video id="pVideo"></video>
  </div>
</template>

<script>
var Peer = require('simple-peer')
import io from 'socket.io-client'

var socket
export default {
  name: 'Transmission',
  data() {
    return {
      stream: null,
      your_sdp: null,
      peer_sdp: null,
      peer: null
    }
  },
  methods: {
    startCall() {
      var peer = new Peer({
        initiator: true,
        trickle: false,
        stream: this.stream
      })

      peer.on('signal', async data => {
        socket = await io.connect(`https://www.theparadigmdev.com/transmission/${this.peer.dm}`)
        this.your_sdp = data
        socket.emit('handshake', {
          username: this.$root.user.username,
          color: this.$root.user.color,
          pic: `https://www.theparadigmdev.com/relay/profile-pics/${this.$root.user._id}.jpg`,
          sdp: data,
          initiator: true
        })

        socket.on('start', clients => {
          peer.signal(clients[1].sdp)
        })

        peer.on('stream', pStream => {
          var video = document.getElementById('pVideo')
          video.srcObject = pStream
          video.play()
        })

        this.$root.socket.emit('transmit_begin', {
          to: this.peer._id,
          from: {
            username: this.$root.user.username,
            color: this.$root.user.color,
            pic: `https://www.theparadigmdev.com/relay/profile-pics/${this.$root.user._id}.jpg`,
          },
          id: this.peer.dm
        })
      })

      // document.getElementById('connect').addEventListener('click', function () {
      //   var otherId = JSON.parse(document.getElementById('otherId').value)
      //   peer.signal(otherId)
      // })
    }
  },
  created() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      var video = document.getElementById('video')
      video.srcObject = stream
      video.play()
      video.muted = true
      this.stream = stream
      if (this.$root.transmission) {
        console.log('generating peer')
        var peer = new Peer({
          initiator: false,
          trickle: false,
          stream: this.stream
        })
        console.log(peer)

        peer.on('signal', async data => {
          console.log('received signal')
          socket = await io.connect(`https://www.theparadigmdev.com/transmission/${this.$root.transmission.id}`)
          this.your_sdp = data
          socket.emit('handshake', {
            username: this.$root.user.username,
            color: this.$root.user.color,
            pic: `https://www.theparadigmdev.com/relay/profile-pics/${this.$root.user._id}.jpg`,
            sdp: data,
            initiator: false
          })

          socket.on('start', clients => {
            console.log('received start')
            peer.signal(clients[0].sdp)
          })
          
          peer.on('stream', pStream => {
            var video = document.getElementById('pVideo')
            video.srcObject = pStream
            video.play()
          })

          peer.on('error', error => console.error(error))
        })
      }
    }).catch(error => {
      console.error(error)
    })
  }
}
</script>

<style scoped>

</style>