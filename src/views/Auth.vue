<template>
  <div class="auth pa-3" v-if="$root.config != {}">
    <v-card class="mx-auto text-center" style="margin-top: 100px;" width="400" v-if="window.location.hostname == 'www.liddy.cf' || window.location.hostname == 'liddy.cf'">
      <v-card-title class="title font-weight-light text-center elevation-6">Looking for Aidan's campaign?<v-btn text class="ml-4" @click="window.location.assign('https://www.liddy.cf/campaign')">Go<v-icon right>mdi-chevron-right</v-icon></v-btn></v-card-title>
    </v-card>

    <v-card width="500" class="mx-auto elevation-12" style="margin-top: 100px;" v-if="method == 'in'">
      <v-card-title class="text-h4 font-weight-light">Sign in</v-card-title>

      <v-card-text>
        <v-text-field @keyup="checkIfUserExists()" v-model="username" label="Username" ref="username_field"></v-text-field>
        <v-text-field :disabled="!user_auth_info.exists && !user_auth_info.in" v-model="password" label="Password" type="password" @keypress.enter="signIn()"></v-text-field>
        <p class="text-center">By logging in, you agree to the <a style="text-decoration: none;" href="https://github.com/Paradigm-Dev/paradigm/blob/master/TERMS.md">Terms and Conditions</a>.</p>
        <p v-if="$root.config.reset" class="text-center">Can't remember your password? Oh well.</p>
        <p v-if="$root.config.migrate" class="text-center">Have an old v1.x account? <a @click="method = 'migrate'">Migrate</a>.</p>
        <p v-if="$root.config.sign_up" class="text-center">Don't have an account? <a @click="method = 'up'">Sign up</a>.</p>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="signIn()" text color="blue accent-1" :disabled="!username || !password">Sign in</v-btn>
      </v-card-actions>
    </v-card>

    <v-card width="500" class="mx-auto elevation-12" style="margin-top: 100px;" v-if="method == 'migrate'">
      <v-card-title class="text-h4 font-weight-light">Migrate</v-card-title>

      <v-card-text>
        <v-text-field @keyup="checkIfUserExistsMigrate" v-model="username" label="Username"></v-text-field>
        <v-text-field :disabled="!user_auth_info.exists" v-model="password" label="Password" type="password"></v-text-field>
        <v-checkbox label="I understand that this action is irreversible and may lead to data loss" v-model="migrate_confirm" class="mb-5"></v-checkbox>
        <p class="text-center mb-8 font-italic"><b>Note:</b> Your username and password will remain the same.</p>
        <p class="text-center">By migrating your account, you agree to the <a style="text-decoration: none;" href="https://github.com/Paradigm-Dev/paradigm/blob/master/TERMS.md">Terms and Conditions</a>.</p>
        <p class="text-center">Already migrated or created your Paradigm account? <a @click="method = 'in'">Sign in</a>.</p>
        <p v-if="$root.config.sign_up" class="text-center">Don't have an account? <a @click="method = 'up'">Sign up</a>.</p>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="migrateAccount()" text color="blue accent-1" :disabled="!username || !password || !migrate_confirm">Migrate</v-btn>
      </v-card-actions>
    </v-card>

    <v-card width="500" class="mx-auto elevation-12" :style="{ margin: $vuetify.breakpoint.smAndUp ? '100px 0px 100px 0px' : '0px' }" v-if="method == 'up'">
      <v-card-title class="text-h4 font-weight-light">Sign up</v-card-title>

      <v-card-text>
        <div :style="{ maxHeight: '50vh' }" style="overflow-y: auto; overflow-x: hidden">
          <v-text-field autocomplete="off" type="text" name="username" v-model="new_user.username" label="Username"></v-text-field>
          <span class="grey--text">This will be used to sign into your account. All other users on the platform will be able to see it, choose wisely.</span>
          <v-text-field autocomplete="off" type="password" name="password" v-model="new_user.password" label="Password"></v-text-field>
          <v-text-field autocomplete="off" type="password" name="password" v-model="new_user.password_confirm" label="Confirm Password"></v-text-field>
          <span class="grey--text">Choose a memorable, yet secure password. Remember it! If you forget it, there is no way to recover your account.</span>
          <v-color-picker mode="hexa" hide-mode-switch class="mt-3 mb-3" flat style="margin: auto;" v-model="new_user.color"></v-color-picker>
          <span class="grey--text">Your color should represent yourself. Anywhere your username is displayed, so is your color.</span>
          <v-text-field :count="50" autocomplete="off" type="text" name="bio" v-model="new_user.bio" label="Biography"></v-text-field>
          <span class="grey--text">A short and sweet summary of yourself.</span>
          <v-file-input prepend-icon="" id="file" ref="file" v-model="new_user.pic" label="Profile Picture"></v-file-input>
          <span class="grey--text">A visual representation of yourself.</span>
          <v-checkbox label="I have read and accept the Terms and Conditions." v-model="new_user.terms" class="mb-4"></v-checkbox>
          <span class="grey--text">Please read and accept the <a href="https://github.com/Paradigm-Dev/paradigm/blob/master/TERMS.md">Terms and Conditions</a>. Confirm that you are over the age of 13. If you are under 18, parental permission is required. <a href="https://en.wikipedia.org/wiki/Children%27s_Online_Privacy_Protection_Act">Read more</a></span>
        </div>

        <v-divider class="my-8"></v-divider>

        <p v-if="$root.config.migrate" class="text-center">Have an old Paradigm v1.x account? <a @click="method = 'migrate'">Migrate</a>.</p>
        <p class="text-center">Already have an account? <a @click="method = 'in'">Sign in</a>.</p>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="signUp()" text color="blue accent-1"
          :disabled="!new_user.username || new_user.password != new_user.password_confirm || !new_user.color || !new_user.bio || !new_user.pic || !new_user.terms"
        >Sign up</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="user_auth_info.in" max-width="350">
			<v-card color="red">
				<v-card-title class="title text-center font-weight-medium text-uppercase">Error</v-card-title>
				<v-card-text>This user is logged in on another client. If you continue, that client's connection will be closed.</v-card-text>
				<v-card-actions>
					<v-btn text color="grey" @click="username = '', user_auth_info.in = false, user_auth_info.exists = false">Cancel</v-btn>
					<v-spacer></v-spacer>
					<v-btn text color="white" @click="closeDupClient()">Confirm</v-btn>
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
      new_user: {},
      migrate_confirm: false,
      window
    }
  },
  mounted() {
    this.$refs.username_field.$el.children[0].focus()
  },
  methods: {
    signIn() {
      this.$http.post('https://www.theparadigmdev.com/api/users/signin', {
        username: this.username.toLowerCase(),
        password: this.password
      }).then(response => {
        if (!response.data.msg) {
          this.$root.user = response.data
          this.$root.router = 'home'
          this.$root.socket.emit('login', response.data)
          var cookie = this.$getCookie('buggy_dialog')
          if (!cookie) this.$root.view.buggy_dialog = true
          document.title = 'Paradigm'
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
              color: this.new_user.color.hex,
              rights: {
                admin: false,
                author: false,
                asteroid: false,
                patriot: false,
                developer: false
              },
              moonrocks: 0
            }).then(response => {
              let formData = new FormData()
              formData.append('files[0]', this.new_user.pic)
              this.$http.post(`https://www.theparadigmdev.com/api/users/${this.new_user.username}/pic`,
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
            }).catch(error => {
              console.log(error)
            })
          } else this.$notify('Username contains invalid special characters', 'error', 'mdi-account-plus', false, 3000)
        } else this.$notify('Read and accept the terms', 'error', 'mdi-account-plus', false, 3000)
      } else this.$notify('Passwords do not match', 'error', 'mdi-account-plus', false, 3000)
    },
    migrateAccount() {
      this.$http.post('https://www.theparadigmdev.com/api/users/migrate', {
        username: this.username,
        password: this.password
      }).then(response => {
        this.$root.user = response.data
        this.$root.router = 'home'
        document.title = 'Paradigm'
      }).catch(error => {
        console.error(error)
      })
    },
    checkIfUserExists() {
      if (this.username.length < 1) this.username_exists = false
      else {
        this.$http.get(`https://www.theparadigmdev.com/api/users/check/${this.username.toLowerCase()}`).then(response => {
          this.user_auth_info = response.data
        })
      }
    },
    checkIfUserExistsMigrate() {
      if (this.username.length < 1) this.username_exists = false
      else { 
        this.$http.get(`https://www.theparadigmdev.com/api/users/migrate/check/${this.username.toLowerCase()}`).then(response => {
          this.user_auth_info.exists = response.data.exists
        })
      }
    },
    closeDupClient() {
      this.$root.socket.emit('kick', this.username.toLowerCase())
      this.user_auth_info.in = false
    }
  }
}
</script>

<style scoped>

</style>