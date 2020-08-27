<template>
  <div class="transmission">
    <v-toolbar dense color="deep-purple darken-1" style="z-index: 99">
      <v-toolbar-title>Transmission</v-toolbar-title>
    </v-toolbar>

    <v-list>
      <v-list-item @click="peer = friend" v-for="(friend, index) in $root.user.people.approved" :key="index">
        <v-list-item-avatar><v-img loading="lazy" :src="`https://www.theparadigmdev.com/relay/profile-pics/${friend._id}.jpg`"></v-img></v-list-item-avatar>
        <v-list-item-title :style="{ color: friend.color }">{{ friend.username }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <input type="text" v-model="socket_id" placeholder="Socket ID">
    <v-btn @click="startCall()">Start</v-btn><br>

    <video v-if="show_peer_video" class="centralize" autoplay id="remote-video"></video>
    <video autoplay muted id="local-video"></video>

    <v-btn fab fixed bottom left @click="endCall()" v-if="show_peer_video"><v-icon>mdi-close</v-icon></v-btn>
  </div>
</template>

<script>
import io from 'socket.io-client'
const { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } = window

let peerConnection = null
let isAlreadyCalling = false
let getCalled = false

export default {
  name: 'Transmission',
  data() {
    return {
      peer: null,
      socket_id: '',
      show_peer_video: false
    }
  },
  methods: {
    async startCall() {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

      this.$root.socket.emit("call-user", {
        offer,
        to: this.peer._id
      });
    },
    async endCall() {
      await this.$root.socket.emit('end-call', { to: this.socket_id })
      this.peer = null
      this.socket_id = ''
      this.show_peer_video = false
      isAlreadyCalling = false
      await peerConnection.close()
      await this.initialize()
      // this.$forceUpdate()
    },
    async initialize() {
      peerConnection = null
      peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stunserver.org' },
          {
            urls: 'turn:numb.viagenie.ca',
            credential: 'muazkh',
            username: 'webrtc@live.com'
          }
        ]
      })
      this.$root.socket.on("call-made", async data => {
        console.log('call-made')
        if (getCalled) {
          const confirmed = confirm(
            `User "Socket: ${data.socket}" wants to call you. Do accept this call?`
          );
  
          if (!confirmed) {
            this.$root.socket.emit("reject-call", {
              from: data.socket
            });
  
            return;
          }
        }

        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

        this.$root.socket.emit("make-answer", {
          answer,
          to: data.socket
        });
        getCalled = true;
      });

      this.$root.socket.on("answer-made", async data => {
        console.log('answer-made')
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );

        if (!isAlreadyCalling) {
          this.socket_id = data.socket
          this.startCall();
          isAlreadyCalling = true;
        }
      });

      this.$root.socket.on('ice', data => {
        console.log('ice')
        peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate))
      })

      this.$root.socket.on('end-call', async data => {
        console.log('end-call')
        this.peer = null
        this.socket_id = ''
        this.show_peer_video = false
        isAlreadyCalling = false
        await peerConnection.restartIce()
        await peerConnection.close()
        await this.initialize()
      })

      let that = this
      peerConnection.onicecandidate = function (evt) {
        console.log('icecandidate')
        that.$root.socket.emit('ice', { candidate: evt.candidate, to: this.socket_id })
      }

      that = this
      peerConnection.ontrack = function({ streams: [stream] }) {
        console.log('track')
        that.show_peer_video = true
        that.$root.view.drawer = false
        const remoteVideo = document.getElementById("remote-video");
        if (remoteVideo) {
          remoteVideo.srcObject = stream;
        }
      };

      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        const localVideo = document.getElementById('local-video')
        if (localVideo) {
          localVideo.srcObject = stream;
        }

        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
      }).catch(error => console.error(error))
    }
  },
  created() {
    this.initialize()
  }
}
</script>

<style scoped>
#local-video {
  position: absolute;
  bottom: 0px;
  right: 0px;
  height: 200px;
}

#remote-video {
  width: 100vw;
  position: absolute;
}
</style>