<template>
  <div class="auth pa-3" v-if="$root.config != {}">
    <v-card class="mx-auto text-center" style="margin-top: 100px;" width="400" v-if="window.location.hostname == 'www.liddy.cf' || window.location.hostname == 'liddy.cf'">
      <v-card-title class="title font-weight-light text-center elevation-6">Looking for Aidan's campaign?<v-btn text class="ml-4" @click="window.location.assign('https://www.liddy.cf/campaign')">Go<v-icon right>mdi-chevron-right</v-icon></v-btn></v-card-title>
    </v-card>

    <v-card width="500" class="mx-auto elevation-12" style="margin-top: 100px;" v-if="method == 'in'">
      <v-card-title class="text-h5 font-weight-medium">SIGN IN</v-card-title>

      <v-card-text>
        <v-text-field hide-details="auto" class="mb-4" @keyup="checkIfUserExists()" v-model="username" label="Username" ref="username_field"></v-text-field>
        <v-text-field hide-details="auto" :disabled="!user_auth_info.exists && !user_auth_info.in" v-model="password" label="Password" type="password" @keypress.enter="signIn()"></v-text-field>
        <p class="grey--text text-center mt-4">By logging in, you agree to the <a @click="$root.view.terms = true">Terms and Conditions</a>.</p>
        <p v-if="$root.config.reset" class="grey--text text-center">Can't remember your password? Oh well.</p>
        <p v-if="$root.config.sign_up" class="grey--text text-center">If you had an old Paradigm v0.1.x account, you have to <a @click.prevent="method = 'up'">create a new one</a>.</p>
        <p v-if="$root.config.sign_up" class="grey--text text-center">Don't have an account? <a @click.prevent="method = 'up'">Sign up</a>.</p>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="signIn()" text color="blue accent-1" :disabled="!username || !password">Sign in</v-btn>
      </v-card-actions>
    </v-card>

    <v-card width="500" class="mx-auto elevation-12" :style="{ margin: $vuetify.breakpoint.smAndUp ? '100px 0px 100px 0px' : '0px' }" v-if="method == 'up'">
      <v-card-title class="text-h5 font-weight-medium">SIGN UP</v-card-title>

      <v-card-text>
        <div :style="{ maxHeight: '50vh' }" style="overflow-y: auto; overflow-x: hidden" v-if="!invite_code_verified" class="text-center">
          <input v-model="invite_code" type="text" placeholder="Invite Code" class="text-center text-h3 font-weight-light my-6" style="width: 100%; font-family: 'Roboto-Mono';">
          <span class="grey--text text-left">Enter the invite code you received from the nominating core team member. Please note it is case sensitive.</span><br>
          <v-btn :disabled="invite_code.length != 9" class="ma-auto mt-6" color="blue accent-1" text @click="verifyInviteCode()">Verify</v-btn>
        </div>

        <div :style="{ maxHeight: '50vh' }" style="overflow-y: auto; overflow-x: hidden" v-if="invite_code_verified">
          <span class="grey--text mb-4">If you had an old Paradigm v0.1.x account, you have to create a new one.</span>
          <v-text-field hide-details="auto" class="mb-4" autocomplete="off" type="text" name="username" v-model="new_user.username" label="Username"></v-text-field>
          <span class="grey--text">This will be used to sign into your account. All other users on the platform will be able to see it, choose wisely.</span>
          <v-text-field hide-details="auto" class="mb-4" autocomplete="off" type="password" name="password" v-model="new_user.password" label="Password"></v-text-field>
          <v-text-field hide-details="auto" class="mb-4" autocomplete="off" type="password" name="password" v-model="new_user.password_confirm" label="Confirm Password"></v-text-field>
          <span class="grey--text">Choose a memorable, yet secure password. Remember it! If you forget it, there is no way to recover your account.</span>
          <v-color-picker mode="hexa" hide-mode-switch class="mt-3 mb-3" flat style="margin: auto;" v-model="new_user.color"></v-color-picker>
          <span class="grey--text">Your color should represent yourself. Anywhere your username is displayed, so is your color.</span>
          <v-text-field hide-details="auto" class="mb-4" :count="50" autocomplete="off" type="text" name="bio" v-model="new_user.bio" label="Biography"></v-text-field>
          <span class="grey--text">A short and sweet summary of yourself.</span>
          <v-file-input prepend-icon="" id="file" ref="file" v-model="new_user.pic" label="Profile Picture" :disabled="use_default"></v-file-input>
          <span class="grey--text">A visual representation of yourself.</span>
          <v-checkbox v-model="use_default" label="Use default profile picture"></v-checkbox>
          <v-checkbox hide-details="auto" label="I have read and accept the Terms and Conditions." v-model="new_user.terms" class="mb-4"></v-checkbox>
          <span class="grey--text">Please read and accept the <a @click="$root.view.terms = true">Terms and Conditions</a>. Confirm that you are over the age of 13. If you are under 18, parental permission is required. <a target="_blank" href="https://en.wikipedia.org/wiki/Children%27s_Online_Privacy_Protection_Act">Learn more</a>.</span>
        </div>

        <v-divider class="my-8"></v-divider>

        <p class="grey--text text-center">Already have an account? <a @click.self.prevent="method = 'in'">Sign in</a>.</p>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="signUp()" text color="blue accent-1"
          :disabled="!new_user.username || new_user.password != new_user.password_confirm || !new_user.color || !new_user.bio || !(new_user.pic || use_default) || !new_user.terms"
        >Sign up</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="user_auth_info.in" v-if="authenticated" max-width="350">
			<v-card color="red">
				<v-card-title class="title text-center font-weight-medium text-uppercase">Error</v-card-title>
				<v-card-text>This user is logged in on another client. If you continue, that client's connection will be closed.</v-card-text>
				<v-card-actions>
					<v-btn text color="grey darken-1" @click="username = '', user_auth_info.in = false, user_auth_info.exists = false">Cancel</v-btn>
					<v-spacer></v-spacer>
					<v-btn text color="white" @click="closeDupClient()">Continue</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Auth',
  data() {
    return {
      username: '',
      password: '',
      user_auth_info: {
        exists: false,
        in: false
      },
      method: 'in',
      step: 1,
      new_user: {
        color: ''
      },
      window,
      invite_code: '',
      invite_code_verified: false,
      authenticated: false,
      use_default: false
    }
  },
  mounted() {
    this.$refs.username_field.$el.children[0].focus()
    
    let randomHex = ''
    const characters = '0123456789ABCDEF'
    let charactersLength = characters.length
    for (let i = 0; i < 6; i++) {
      randomHex += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    this.new_user.color = `#${randomHex}`
  },
  destroyed() {
    if (this.$root.url[1] !== '') this.$root.router = this.$root.url[1]
    else this.$root.router = 'home'
  },
  methods: {
    signIn() {
      this.$http.post('https://www.theparadigmdev.com/api/users/signin', {
        username: this.username.toLowerCase(),
        password: this.password
      }).then(response => {
        if (!response.data.msg) {
          this.authenticated = true
          if (!this.user_auth_info.in) {
            this.$root.user = response.data
            this.$root.links = [
              { icon: 'mdi-home', content: 'Home', path: 'home', disabled: false, rights: true },
              { icon: 'mdi-message', content: 'Flamechat', path: 'flamechat', disabled: false, rights: true },
              { icon: 'mdi-web', content: 'Satellite', path: 'satellite', disabled: false, rights: true },
              { icon: 'mdi-newspaper', content: 'The Paradox', path: 'paradox', disabled: false, rights: true },
              { icon: 'mdi-folder-multiple', content: 'Drawer', path: 'drawer', disabled: false, rights: true },
              { icon: 'mdi-play', content: 'Media', path: 'media', disabled: false, rights: true },
              { icon: 'mdi-account-group', content: 'People', path: 'people', disabled: false, rights: true },
              { icon: 'mdi-satellite-uplink', content: 'Broadcast', path: 'broadcast', disabled: false, rights: true },
              { icon: 'mdi-download', content: 'Downloads', path: 'downloads', disabled: false, rights: true },
              { icon: 'mdi-code-tags', content: 'Developer', path: 'developer', disabled: false, rights: this.$root.user.rights.developer },
              { icon: 'mdi-video-wireless', content: 'Transmission', path: 'transmission', disabled: true, rights: true },
              // { icon: 'mdi-pencil', content: 'Write', path: 'write', disabled: true }
            ]
            this.$root.router = 'home'
            this.$root.socket.emit('login', response.data)
            var cookie = this.$getCookie('buggy_dialog')
            if (!cookie) this.$root.view.buggy_dialog = true
            document.title = 'Paradigm'
          }
        } else {
          this.$notify(response.data.msg, 'error', 'mdi-alert-circle', false, 3000)
        }
      }).catch(error => console.error(JSON.stringify(error)))
    },
    signUp() {
      if (this.new_user.password === this.new_user.password_confirm) {
        if (this.new_user.terms === true) {
          var regex = /([0-9A-Za-z_~.-])/gi
          if (regex.test(this.new_user.username)) {
            this.$http.post('https://www.theparadigmdev.com/api/users/register', {
              username: this.new_user.username.toLowerCase(),
              password: this.new_user.password,
              bio: this.new_user.bio,
              color: this.new_user.color,
              rights: {
                admin: false,
                author: false,
                asteroid: false,
                patriot: false,
                developer: false,
                apollo: true
              },
              moonrocks: 0,
              code: this.invite_code
            }).then(response => {
              if (!this.use_default) {
                let formData = new FormData()
                formData.append('files[0]', this.new_user.pic)
                this.$http.post(`https://www.theparadigmdev.com/api/users/${response.data._id}/pic`,
                  formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  }
                ).then(response => {
                  this.$root.user = response.data
                  this.$root.router = 'home'
                  document.title = 'Paradigm'
                })
                .catch(error => {
                  console.log('Upload: failed', error)
                })
              } else {
                  this.$root.user = response.data
                  this.$root.router = 'home'
                  document.title = 'Paradigm'
              }
            }).catch(error => {
              console.log(error)
            })
          } else this.$notify('Username contains invalid special characters', 'error', 'mdi-account-plus', false, 3000)
        } else this.$notify('Read and accept the terms', 'error', 'mdi-account-plus', false, 3000)
      } else this.$notify('Passwords do not match', 'error', 'mdi-account-plus', false, 3000)
    },
    checkIfUserExists() {
      if (this.username.length < 1) this.username_exists = false
      else {
        this.$http.get(`https://www.theparadigmdev.com/api/users/check/${this.username.toLowerCase()}`).then(response => {
          this.user_auth_info = response.data
        })
      }
    },
    closeDupClient() {
      this.$root.socket.emit('kick', this.username.toLowerCase())
      this.user_auth_info.in = false
      this.signIn()
    },
    verifyInviteCode() {
      this.$http.put(`https://www.theparadigmdev.com/api/apollo`, { code: this.invite_code }).then(response => {
        if (response.data.used === true || response.data.used === null) this.$notify('Invite code is invalid', 'error', 'mdi-exclamation', false, 3000)
        else this.invite_code_verified = true
      })
    }
  }
}
</script>

<style scoped>
input:not(::placeholder) {
  font-family: 'Roboto Mono';
  letter-spacing: 10px;
}
</style>