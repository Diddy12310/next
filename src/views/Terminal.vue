<template>
  <div class="terminal">
    <v-toolbar color="grey darken-4" dense>
      <v-toolbar-title style="font-family: Roboto;">Terminal</v-toolbar-title>
    </v-toolbar>

    <div v-chat-scroll id="output" class="px-4 pt-3" :style="{ height: `calc(100vh - ${$root.music.open ? '240px' : '160px'})`, overflowY: 'auto' }">
      <p style="font-family: Roboto Mono;" class="pb-0 pt-0 mt-0" v-for="(item, index) in history" :key="index" v-html="item"></p>
    </div>

    <label style="display: flex; padding-left: 16px; font-family: Roboto Mono;">><input @keypress.enter="sendCommand()" placeholder="enter command" autofocus v-model="input"></label>
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
        case 'nuke':
          socket.emit('nuke')
          break
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
        case 'me':
          this.$log(JSON.stringify(this.$root.user))
          break
        case 'ipban':
          this.ban(this.output[1])
          break
        default:
          this.$error(`command ${this.output[0]} not found`)
          this.input = ''
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
      this.$log(`set config.${query} to ${input}`)
    },
    user(username, key, value) {
      switch (key) {
        case 'ban':
          socket.emit('ban', { username, value: this.parseBool(value) })
          this.$log(`user ${username}.banned set to ${value}`)
          break
        case 'view':
          this.$http.get(`https://www.theparadigmdev.com/api/terminal/user/${username}/view`).then(response => {
            if (response.data.error) this.$error(response.data.error)
            else {
              this.history.push(`<p class="grey--text">
                &nbsp;&nbsp;&nbsp;&nbsp;# <span style="color: ${response.data.color};">${ response.data.username }</span><br>
                &nbsp;&nbsp;&nbsp;&nbsp;# ${ response.data._id }<br>
                &nbsp;&nbsp;&nbsp;&nbsp;# ${ response.data.bio }<br>
                &nbsp;&nbsp;&nbsp;&nbsp;# ---------------------------------------<br>
                &nbsp;&nbsp;&nbsp;&nbsp;# moonrocks:        ${ response.data.moonrocks }<br>
                &nbsp;&nbsp;&nbsp;&nbsp;# rights.admin:     ${ response.data.rights.admin }<br>
                &nbsp;&nbsp;&nbsp;&nbsp;# rights.author:    ${ response.data.rights.author }<br>
                &nbsp;&nbsp;&nbsp;&nbsp;# rights.asteroid:  ${ response.data.rights.asteroid }<br>
                &nbsp;&nbsp;&nbsp;&nbsp;# rights.developer: ${ response.data.rights.developer }<br>
                &nbsp;&nbsp;&nbsp;&nbsp;# banned:           ${ response.data.banned }<br>
                &nbsp;&nbsp;&nbsp;&nbsp;# strikes:          ${ response.data.strikes }<br>
                &nbsp;&nbsp;&nbsp;&nbsp;# logged in:        ${ response.data.in }<br>
              </p>`)
            }
          })
          break
        case 'rights.admin':
          socket.emit('rights.admin', { username, value: this.parseBool(value) })
          this.$log(`user ${username}.rights.admin set to ${value}`)
          break
        case 'rights.author':
          socket.emit('rights.author', { username, value: this.parseBool(value) })
          this.$log(`user ${username}.rights.author set to ${value}`)
          break
        case 'rights.asteroid':
          socket.emit('rights.asteroid', { username, value: this.parseBool(value) })
          this.$log(`user ${username}.rights.asteroid set to ${value}`)
          break
        case 'rights.developer':
          socket.emit('rights.developer', { username, value: this.parseBool(value) })
          this.$log(`user ${username}.rights.developer set to ${value}`)
          break
        case 'strike':
          this.$http.get(`https://www.theparadigmdev.com/api/terminal/user/${username}/strike`)
          this.$log(`user ${username}.strikes incremented by 1`)
          break
        case 'kick':
          socket.emit('kick', username)
          this.$log(`user ${username} kicked`)
          break
        case 'kill':
          socket.emit('kill', username)
          this.$log(`user ${username} session killed`)
          break
        case 'delete':
          socket.emit('kick', username)
          this.$http.get(`https://www.theparadigmdev.com/api/terminal/user/${username}/delete`)
          this.$log(`user ${username} deleted`)
          break
        case 'rocks':
          socket.emit('moonrocks', { username, value: parseInt(value, 10) })
          this.$log(`user ${username}.moonrocks incremented by ${value}`)
          break
        case 'rename':
          this.$http.post('https://www.theparadigmdev.com/api/users/update', {
            old: username.toLowerCase(),
            username: value.toLowerCase()
          }).then(response => {
            this.$log(`user ${username} username changed to ${value}`)
          }).catch(error => console.error(error))
          break
        default:
          this.$error(`command ${key} not found`)
      }
    },
    list(query) {
      this.$http.get(`https://www.theparadigmdev.com/api/terminal/list/${query}`).then(response => {
        if (response.data.error) this.$error(response.data.error)
        else this.$log(response.data.toString())
      }).catch(error =>  this.$error(`query ${query} does not exist`))
    },
    ban(ip) {
      socket.emit('ip', ip)
      this.$log(`ip ${ip} banned`)
    },
    $log(input) {
      this.history.push(`<p class="ml-8 grey--text"># ${input}</p>`)
    },
    $error(input) {
      this.history.push(`<p class="ml-8 red--text">! ${input}</p>`)
    }
  },
  async created() {
    socket = await io.connect(`https://www.theparadigmdev.com/terminal`)
    socket.on('log', log => console.log(log))
    this.$root.socket.on('list', async connections => {
      var data = []
      connections.forEach(connection => {
        data.push(`{ username: ${connection.username}, socket: ${connection.socket} }`)
      })
      this.$log(data.toString())
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
	outline: none;
	font-family: 'Roboto Mono', monospace;
	width: 100%;
	height: 100%;
	padding: 0px 16px 16px 16px;
  width: 100%;
  position: relative;
  bottom: 0px;
}
</style>