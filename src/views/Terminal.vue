<template>
  <div class="terminal">
    <v-toolbar color="grey darken-4" dense>
      <v-toolbar-title style="font-family: Roboto;">Terminal</v-toolbar-title>
    </v-toolbar>

    <div v-chat-scroll id="output" style="height: calc(100vh - 160px) !important; overflow: scroll; padding: 0px 16px;">
      <p style="font-family: Roboto Mono;" class="pb-0 pt-0 mt-0" v-for="(item, index) in history" :key="index" v-html="item"></p>
    </div>

    <input type="text" placeholder="Enter command..." @keypress.enter="sendCommand()" style="width: 100%;" class="pa-3" v-model="input">
  </div>
</template>

<script>
import io from 'socket.io-client'

var socket
export default {
  name: 'Terminal',
  data() {
    return {
      history: [],
      input: '',
      output: []
    }
  },
  methods: {
    parseBool(input) {
      if (input == 'true') return true
			if (input == 'false') return false
			if (input != 'true' || input != 'false') return undefined
    },
    sendCommand() {
      this.history.push('> ' + this.input)
			this.output = this.input.split(' ')
      switch (this.output[0]) {
        case 'clear':
          this.history = []
          break
        case 'set':
          this.set(this.output[1], this.parseBool(this.output[2]))
          break
        case 'user':
          this.user(this.output[1], this.output[2], this.output[3])
          break
        case 'list':
          if (this.output[1] != 'connections') this.list(this.output[1])
          else {
            this.$root.socket.emit('list', 'connections')
          }
          break
      }
      this.input = ''
    },
    set(query, input) {
      this.$root.config[query] = input
      var payload = {
        username: this.$root.user.username,
        config: this.$root.config
      }
      socket.emit('config', payload)
    },
    user(username, key, value) {
      console.log(username, key, value)
      switch (key) {
        case 'ban':
          socket.emit('ban', { username: username, value: this.parseBool(value) })
          break
        case 'view':
          this.$http.get(`https://relay.theparadigmdev.com/terminal/user/${username}/view`).then(response => {
            this.history.push(`
            <p class="grey--text">
              &nbsp;&nbsp;&nbsp;&nbsp;# <span style="color: ${response.data.color};">${ response.data.username }</span><br>
              &nbsp;&nbsp;&nbsp;&nbsp;# ${ response.data._id }<br>
              &nbsp;&nbsp;&nbsp;&nbsp;# ${ response.data.bio }<br>
              &nbsp;&nbsp;&nbsp;&nbsp;# ---------------------------------------<br>
              &nbsp;&nbsp;&nbsp;&nbsp;# moonrocks:        ${ response.data.moonrocks }<br>
              &nbsp;&nbsp;&nbsp;&nbsp;# rights.admin:     ${ response.data.rights.admin }<br>
              &nbsp;&nbsp;&nbsp;&nbsp;# rights.author:    ${ response.data.rights.author }<br>
              &nbsp;&nbsp;&nbsp;&nbsp;# rights.asteroid:  ${ response.data.rights.asteroid }<br>
              &nbsp;&nbsp;&nbsp;&nbsp;# Banned:           ${ response.data.banned }<br>
              &nbsp;&nbsp;&nbsp;&nbsp;# Strikes:          ${ response.data.strikes }<br>
              &nbsp;&nbsp;&nbsp;&nbsp;# Logged in:        ${ response.data.in }<br>
            </p>`)
          })
          break
        case 'rights.admin':
          socket.emit('rights.admin', { username, value: this.parseBool(value) })
          break
        case 'rights.author':
          socket.emit('rights.author', { username, value: this.parseBool(value) })
          break
        case 'rights.asteroid':
          socket.emit('rights.asteroid', { username, value: this.parseBool(value) })
          break
        case 'strike':
          this.$http.get(`https://relay.theparadigmdev.com/terminal/user/${username}/strike`)
          break
        case 'kick':
          socket.emit('kick', username)
          break
        case 'kill':
          socket.emit('kill', username)
          break
        case 'delete':
          socket.emit('kick', username)
          this.$http.get(`https://relay.theparadigmdev.com/terminal/user/${username}/delete`)
          break
        case 'mrocks':
          socket.emit('moonrocks', { username, value: parseInt(value, 10) })
          break
      }
    },
    list(query) {
      this.$http.get(`https://relay.theparadigmdev.com/terminal/list/${query}`).then(response => {
        this.history.push(response.data.toString())
      })
    }
  },
  async created() {
    socket = await io.connect(`https://relay.theparadigmdev.com/terminal`)

    this.$root.socket.on('list', async connections => {
      this.history.push(connections)
    })
  }
}
</script>

<style scoped>
* {
  font-family: 'Roboto Mono';
}

.terminal {
  height: 100%;
}

input {
  position: relative;
  bottom: 0px;
}
</style>