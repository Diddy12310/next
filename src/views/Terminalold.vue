<template>
  <v-app>
    <!-- System toolbar -->
    <v-system-bar app window style="-webkit-app-region: drag;" class="grey darken-4">
		  <img src="./assets/logo.png" height="18" style="margin-right: 4px;">
      <span>Terminal</span>
      <v-spacer></v-spacer>
      <div style="-webkit-app-region: no-drag;">
        <v-icon @click="minimize()" v-ripple class="appbar-icon">mdi-minus</v-icon>
        <v-icon @click="maximized ? unmaximize() : maximize()" v-ripple class="appbar-icon">mdi-crop-square</v-icon>
        <v-icon @click="close()" v-ripple class="appbar-icon">mdi-close</v-icon>
      </div>
    </v-system-bar>

		<!-- Site content -->
		<v-content style="background-color: #212121;">
			<div v-if="user.signed_in" v-chat-scroll id="output" style="height: calc(100vh - 76px) !important; overflow: scroll; padding: 0px 16px;">
				<p style="font-family: Roboto Mono;" class="pb-0 pt-0 mt-0" v-for="(item, index) in history" :key="index" v-html="item"></p>
			</div>
			<div v-if="!user.signed_in" v-chat-scroll id="output" style="height: calc(100vh - 76px) !important; overflow: scroll; padding: 0px 16px;">
				<p v-if="user_is_not_admin" style="font-family: Roboto Mono;" class="pb-0 pt-0 mt-0 red--text font-weight-fcreated">User that attempted to sign in is not an administrator.</p>
				<p style="font-family: Roboto Mono;" class="pb-0 pt-0 mt-0 red--text">User is not signed in.</p>
				<p style="font-family: Roboto Mono;" class="pb-0 pt-0 mt-0">> username: {{ user.name }}</p>
				<p v-if="username_saved" style="font-family: Roboto Mono;" class="pb-0 pt-0 mt-0">> password: </p>
			</div>
      <form v-if="user.signed_in" @submit.prevent="sendCmd()">
        <label style="display: flex; padding-left: 16px; font-family: Roboto Mono;">><input placeholder="enter command" autofocus :disabled="!cmd_enabled" :class="cmd_class" v-model="cmd_input"></label>
      </form>
			<form v-if="!user.signed_in && !username_saved" @submit.prevent="username_saved = true">
        <label style="display: flex; padding-left: 16px; font-family: Roboto Mono;">><input placeholder="enter username" autofocus :class="cmd_class" v-model="user.name"></label>
      </form>
			<form v-if="!user.signed_in && username_saved" @submit.prevent="signIn()">
        <label style="display: flex; padding-left: 16px; font-family: Roboto Mono;">><input type="password" placeholder="enter password" autofocus :class="cmd_class" v-model="user.password"></label>
      </form>
		</v-content>
  </v-app>
</template>

<script>
const remote = require('electron').remote
import { db, auth, func, app } from './firebase'

export default {
	name: 'app',
	data() {
		return {
			win: remote.getCurrentWindow(),
      maximized: remote.getCurrentWindow().isMaximized(),
      cmd_input: '',
      cmd_output: '',
      cmd_class: 'white--text',
      cmd_enabled: true,
			profilePopupData: {},
			profilePopupUsername: undefined,
			history: [],
			user: {
				name: '',
				password: '',
				signed_in: false
			},
			username_saved: false,
			user_is_not_admin: false
		}
	},
	created() {
		auth.onAuthStateChanged(user => {
			if (user) {
				this.user.signed_in = true
				this.history.push(`<span class="grey--text">Paradigm Termnial<br>Signed in as ${this.user.name}</span>`)
			} else {
				this.user = {
					name: '',
					password: '',
					signed_in: false
				}
			}
		})
	},
  methods: {
    close() {
      this.win.close()
    },
    maximize() {
      this.win.maximize()
      this.maximized = remote.getCurrentWindow().isMaximized()
    },
    unmaximize() {
      this.win.unmaximize()
      this.maximized = remote.getCurrentWindow().isMaximized()
    },
    minimize() {
      this.win.minimize()
		},
		signIn() {
			auth.signInWithEmailAndPassword(this.user.name + '@theparadigmdev.com', this.user.password).then(() => {
				var username = this.user.name
				db.collection('users').doc(this.user.name).get().then(doc => {
					var data = doc.data()
					if (data.isAdmin !== true) {
						this.signOut()
						this.user_is_not_admin = true
						this.username_saved = false
					}
					this.user.name = username
				})
			}).catch(error => console.error(error))
		},
    sendCmd() {
			this.history.push('> ' + this.cmd_input)
			this.cmd_output = this.cmd_input.split(' ')
			if (this) {
				switch (this.cmd_output[0]) {
					case 'exit':
						this.close()
						break
					case 'help':
						this.cmdLog(`<a href="https://www.theparadigmdev.com/terminal.html">https://www.theparadigmdev.com/terminal.html</a>`)
						break
					case 'set':
						switch (this.cmd_output[1]) {
							case 'flamechat':
								this.toggleFc(this.parseBool(this.cmd_output[2]))
								break
							case '404':
								this.global_pnfToggle(this.parseBool(this.cmd_output[2]))
								break
							case 'lockdown':
								this.lockdownToggle(this.parseBool(this.cmd_output[2]))
								break
							case 'shutdown':
								this.toggleShutdown(this.parseBool(this.cmd_output[2]))
								break
							case 'sign_up':
								this.toggleSignUp(this.parseBool(this.cmd_output[2]))
								break
							default:
								this.cmdError('This command does not exist!')
								break
						}
						break
					case 'user':
						switch (this.cmd_output[2]) {
							case 'ban':
								this.userBan(this.cmd_output[1], this.parseBool(this.cmd_output[3]))
								break
							case 'admin':
								this.userAdmin(this.cmd_output[1], this.parseBool(this.cmd_output[3]))
								break
							case 'view':
								this.openUsernamePopup(this.cmd_output[1])
								break
							case 'strike':
								this.userStrike(this.cmd_output[1], this.cmd_output[3])
								break
							case 'asteroid':
								this.userAsteroid(this.cmd_output[1], this.parseBool(this.cmd_output[3]))
								break
							case 'writer':
								this.userWriter(this.cmd_output[1], this.parseBool(this.cmd_output[3]))
								break
							case 'delete':
								this.userDelete(this.cmd_output[1])
								break
							case 'mrocks':
								this.userMoonrocks(this.cmd_output[1], this.cmd_output[3], this.cmd_output[4])
								break
							case 'kick':
								this.userKick(this.cmd_output[1])
								break
							case 'create':
								this.userCreate(this.cmd_output[1], this.cmd_output[3])
								break
							case 'name':
								this.userNameChange(this.cmd_output[1], this.cmd_output[3])
								break
							default:
								this.cmdError('This command does not exist!')
								break
						}
						break
					case 'switch':
						this.$root.switch = this.cmd_output[1]
						break
					case 'clear':
            this.history = []
						break
					case 'console':
						this.cmd_console = ''
						for (var array_pos = 1; array_pos < this.cmd_output.length; array_pos++) {
							this.cmd_console = this.cmd_console + ' ' + this.cmd_output[array_pos]
						}
            this.cmdLog(this.cmd_console)
						break
					case '':
						this.cmdError('Enter a command!')
						break
					case 'logout':
						this.signOut()
						break
					default:
						this.cmdError('This command does not exist!')
						break
        }
				this.cmd_input = ''
        this.cmd_output = ''
			} else {
				this.cmdError('You are not authorized to send commands!')
			}
		},
		userBan(username, input) {
      db.collection('users').doc(username).update({
        isBanned: input
      }).then(() => {
				this.cmdLog(`${username}.banned set to ${input}`)
			}).catch(error => {
				this.cmdError(`An error occurred: ${error}`)
			})
		},
		userWriter(username, input) {
      db.collection('users').doc(username).update({
        isWriter: input
      }).then(() => {
				this.cmdLog(`${username}.writer set to ${input}`)
			}).catch(error => {
				this.cmdError(`An error occurred: ${error}`)
			})
    },
    userAdmin(username, input) {
      db.collection('users').doc(username).update({
        isAdmin: input
      }).then(() => {
				this.cmdLog(`${username}.admin set to ${input}`)
			}).catch(error => {
				this.cmdError(`An error occurred: ${error}`)
			})
		},
    userStrike(username, input) {
      db.collection('users').doc(username).get().then(doc => {
        var current = parseInt(doc.data().strikes, 10)
				var input_int = parseInt(input, 10)
				db.collection('users').doc(username).update({
					strikes: current + input_int
				}).then(() => {
					this.cmdLog(`${username} has been awarded ${input} strikes`)
					if (current + input_int >= 3) {
						if (db.collection('users').doc(username).get().then(doc => doc.data().isBanned)) {
							db.collection('users').doc(username).update({ isBanned: true })
							this.cmdLog(`${username}.banned set to true`)
						}
					}
				}).catch(error => {
					this.cmdError(`An error occurred: ${error}`)
				})
			}).catch(error => {
				this.cmdError(`An error occurred: ${error}`)
			})
    },
    userAsteroid(username, input) {
      db.collection('users').doc(username).update({
        isAsteroid: input
      }).then(() => {
				this.cmdLog(`${username}.asteroid set to ${input}`)
			}).catch(error => {
				this.cmdError(`An error occurred: ${error}`)
			})
		},
		userMoonrocks(username, action, input) {
			switch (action) {
				case 'add':
					db.collection('users').doc(username).update({
						moonrocks: app.firestore.FieldValue.increment(parseInt(input))
					}).then(() => this.cmdLog(`Added ${input} to ${username}.moonrocks`)).catch(error => this.cmdError(`An error occurred: ${error}`))
					break
				case 'rem':
					db.collection('users').doc(username).update({
						moonrocks: app.firestore.FieldValue.increment(-Math.abs(parseInt(input)))
					}).then(() => this.cmdLog(`Removed ${input} from ${username}.moonrocks`)).catch(error => this.cmdError(`An error occurred: ${error}`))
					break
				case 'set':
					db.collection('users').doc(username).update({
						moonrocks: parseInt(input)
					}).then(() => this.cmdLog(`${username}.moonrocks set to ${input}`)).catch(error => this.cmdError(`An error occurred: ${error}`))
					break
			}
		},
		userKick(username) {
			db.collection('users').doc(username).update({
				isLoggedIn: false
			}).then(() => this.cmdLog(`${username} kicked`)).catch(error => this.cmdError(`An error occurred: ${error}`))
		},
		userNameChange(old_name, new_name) {
			var uid
			db.collection('users').doc(old_name).get().then(doc => {
				uid = doc.data().uid
			})
			var _remote_changeName = func.httpsCallable('changeName')
			_remote_changeName({ new_username: new_name, old_username: old_name, uid: uid }).then(result => {
				if (result === true) this.cmdLog(`User ${old_name} has been changed to ${new_name}`)
			})
		},
    toggleSignUp(input) {
			db.collection('paradigm').doc('config').update({
				sign_up_enable: input
			}).then(() => {
				this.sign_up_enable = input
				this.cmdLog(`sign_up set to ${input}`)
			}).catch(error => {
				this.cmdError(`An error occurred: ${error}`)
			})
		},
		toggleShutdown(input) {
			db.collection('paradigm').doc('config').update({
				shutdown: input
			}).then(() => {
				this.lockdown = input
				this.cmdLog(`shutdown set to ${input}`)
			}).catch(error => {
				this.cmdError(`An error occurred: ${error}`)
			})
		},
		toggleFcHTML() {
			db.collection('paradigm').doc('config').update({
				flamechat_html_render: !this.flamechat_html_render
			}).then(() => {
				this.cmdLog(`flamechat_html_render set to ${input}`)
			}).catch(error => {
				this.cmdError(`An error occurred: ${error}`)
			})
		},
		lockdownToggle(input) {
			db.collection('paradigm').doc('config').update({
				lockdown: input
			}).then(() => {
				this.lockdown = input
				this.cmdLog(`lockdown set to ${input}`)
			}).catch(error => {
				this.cmdError(`An error occurred: ${error}`)
			})
		},
		global_pnfToggle(input) {
			db.collection('paradigm').doc('config').update({
				global_pnf: input
			}).then(() => {
				this.global_pnf = input
				this.cmdLog(`404 set to ${input}`)
			}).catch(error => {
				this.cmdError(`An error occurred: ${error}`)
			})
		},
		toggleFc(input) {
			db.collection('paradigm').doc('config').update({
				flamechat_enable: input
			}).then(() => {
				this.flamechat_enable = input
				this.cmdLog(`flamechat set to ${input}`)
			}).catch(error => {
				this.cmdError(`An error occurred: ${error}`)
			})
    },
    openUsernamePopup(username) {
			var usersRef = db.collection('users')
			usersRef.doc(username).get().then(doc => {
				if (doc.exists) {
					this.profilePopupData = doc.data()
					this.profilePopupUsername = username
					var chatrooms = []
					doc.data().chatrooms.forEach(chatroom => {
						chatrooms.push(chatroom.name)
					})
					this.history.push(`
					<p class="grey--text">
						&nbsp;&nbsp;&nbsp;&nbsp;# <span style="color: ${this.profilePopupData.color};">${ this.profilePopupUsername }</span><br>
						&nbsp;&nbsp;&nbsp;&nbsp;# ${ this.profilePopupData.uid }<br>
						&nbsp;&nbsp;&nbsp;&nbsp;# ${ this.profilePopupData.bio }<br>
						&nbsp;&nbsp;&nbsp;&nbsp;# ---------------------------------------<br>
						&nbsp;&nbsp;&nbsp;&nbsp;# Moonrocks:  ${ this.profilePopupData.moonrocks }<br>
						&nbsp;&nbsp;&nbsp;&nbsp;# Admin:      ${ this.profilePopupData.isAdmin }<br>
						&nbsp;&nbsp;&nbsp;&nbsp;# Asteroid:   ${ this.profilePopupData.isAsteroid }<br>
						&nbsp;&nbsp;&nbsp;&nbsp;# Writer:     ${ this.profilePopupData.isWriter }<br>
						&nbsp;&nbsp;&nbsp;&nbsp;# Banned:     ${ this.profilePopupData.isBanned }<br>
						&nbsp;&nbsp;&nbsp;&nbsp;# Strikes:    ${ this.profilePopupData.strikes }<br>
						&nbsp;&nbsp;&nbsp;&nbsp;# Logged in:  ${ this.profilePopupData.isLoggedIn }<br>
						&nbsp;&nbsp;&nbsp;&nbsp;# Chatrooms:	${ chatrooms.toString() }
					</p>`)
				} else {
					this.cmdError('This user does not exist')
				}
			}).catch(error => {
				this.cmdError(`An error occurred: ${error}`)
			})
		},
    cmdError(input_text) {
			this.history.push(`<span class="red--text">&nbsp;&nbsp;&nbsp;&nbsp;! ${input_text}</span>`)
		},
		cmdLog(input_text) {
			this.history.push(`<span class="grey--text">&nbsp;&nbsp;&nbsp;&nbsp;# ${input_text}</span>`)
		},
    parseBool(input) {
      if (input == 'true') return true
			if (input == 'false') return false
			if (input != 'true' || input != 'false') return undefined
		},
		checkIfUser(input) {
			db.collection('users').doc(input).get().then(doc => {
				if (doc != null) return true
				if (doc == null) return false
			})
		},
		signOut() {
			db.collection('users').doc(this.user.name).update({ isLoggedIn: false }).then(() => {
				auth.signOut().then(() => {
					this.history = []
				})
			})
		},
		userDelete(username) {
			var _remote_deleteUser = func.httpsCallable('deleteUser')
      db.collection('users').doc(username).get().then(doc => {
				if (doc.exists) {
					db.collection('users').doc(username).update({
						isLoggedIn: false
					}).then(() => {}).catch(error => this.cmdError(`An error occurred: ${error}`))
					_remote_deleteUser({ uid: doc.data().uid, username: username }).then(result => {
						if (result === true) this.cmdLog(`User ${username} has been deleted`)
					})
				} else {
					this.cmdError('This user does not exist')
				}
			}).catch(error => {
				this.cmdError(`An error occurred: ${error}`)
			})
		},
		userCreate(username, password) {
			var _remote_createUser = func.httpsCallable('createUser')
			_remote_createUser({ username: username, password: password }).then(result => {
				if (result === true) this.cmdLog(`User ${username} has been created`)
			})
    }
  }
}
</script>

<style>
/* Scrollbar */

/* width */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

/* Track */
::-webkit-scrollbar-track {
  background: rgb(33, 33, 33);
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(100, 100, 100);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgb(60, 60, 60);
}

/* Corner */
::-webkit-scrollbar-corner {
  background: rgb(33, 33, 33);
}

html {
  overflow-y: auto !important;
	-webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.appbar-icon {
  border-radius: 100px;
}

.centralize {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
	text-align: center;
}

.v-system-bar.v-system-bar--fixed.v-system-bar--window.theme--dark {
  padding: 0px 0px 0px 8px !important;
}

input {
	outline: none;
	font-family: 'Roboto Mono', monospace;
	width: 100%;
	height: 100%;
	padding: 0px 16px 16px 16px;
  width: 100%;
}

form {
  position: absolute;
  bottom: 0px;
  width: 100vw;
}
</style>
