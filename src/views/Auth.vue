<template>
  <div class="auth pa-3" v-if="$root.config != {}">
    <v-card width="500" class="mx-auto elevation-12" style="margin-top: 100px;" v-if="method == 'in'">
      <v-card-title class="display-1 font-weight-light">Sign in</v-card-title>

      <v-card-text>
        <v-text-field @keyup="checkIfUserExists()" v-model="username" label="Username" ref="username_field"></v-text-field>
        <v-text-field :disabled="!user_auth_info.exists && !user_auth_info.in" v-model="password" label="Password" type="password" @keypress.enter="signIn()"></v-text-field>
        <p v-if="$root.config.reset" class="text-center">Can't remember your password? Oh well.</p>
        <p v-if="$root.config.migrate" class="text-center">Have an old v1.x account? <a @click="method = 'migrate'">Migrate</a>.</p>
        <p v-if="$root.config.sign_up" class="text-center">Don't have an account? <a @click="method = 'up'">Sign up</a>.</p>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="signIn()" text color="blue accent-1">Sign in</v-btn>
      </v-card-actions>
    </v-card>

    <v-card width="500" class="mx-auto elevation-12" style="margin-top: 100px;" v-if="method == 'migrate'">
      <v-card-title class="display-1 font-weight-light">Migrate</v-card-title>

      <v-card-text>
        <v-text-field @keyup="checkIfUserExistsMigrate" v-model="username" label="Username"></v-text-field>
        <v-text-field :disabled="!username_exists" v-model="password" label="Password" type="password"></v-text-field>
        <v-checkbox label="I understand that this action is irreversible and may lead to data loss" v-model="migrate_confirm" class="mb-5"></v-checkbox>
        <p class="text-center mb-8 font-italic"><b>Note:</b> Your username and password will remain the same.</p>
        <p class="text-center">Already have a new Paradigm account? <a @click="method = 'in'">Sign in</a>.</p>
        <p v-if="$root.config.sign_up" class="text-center">Don't have an account? <a @click="method = 'up'">Sign up</a>.</p>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="!migrate_confirm" @click="migrateAccount()" text color="blue accent-1">Migrate</v-btn>
      </v-card-actions>
    </v-card>

    <v-card width="500" class="mx-auto elevation-12" style="margin-top: 100px;" v-if="method == 'up'">
      <v-card-title class="display-1 font-weight-light">Sign up</v-card-title>

      <v-card-text>
        <v-window v-model="step">
          <v-window-item :value="1">
            <v-text-field clearable autocomplete="off" type="text" name="username" v-model="new_user.username" label="Username"></v-text-field>
            <span class="caption grey--text text--darken-1">
              This is the username you will use to login to your Paradigm account.
            </span>
          </v-window-item>

          <v-window-item :value="2">
            <v-text-field clearable autocomplete="off" type="password" name="password" v-model="new_user.password" label="Password"></v-text-field>
            <v-text-field clearable autocomplete="off" type="password" name="password" v-model="new_user.password_confirm" label="Confirm Password"></v-text-field>
            <span class="caption grey--text text--darken-1">
              Enter a password to sign in to your account.
            </span>
          </v-window-item>

          <v-window-item :value="3">
            <v-color-picker mode="hexa" hide-mode-switch class="mt-3 mb-3 elevation-0" v-model="new_user.color"></v-color-picker>
            <span class="caption grey--text text--darken-1">
              Pick a color for your account.
            </span>
          </v-window-item>

          <v-window-item :value="4">
            <v-text-field autocomplete="off" type="text" name="bio" v-model="new_user.bio" label="Bio"></v-text-field>
            <span class="caption grey--text text--darken-1">
              Enter a shot biography.
            </span>
          </v-window-item>

          <v-window-item :value="5">
            <!-- <v-container style="margin: auto;" fluid>
              <v-layout row wrap>
                <v-flex v-for="pic in $root.avail_profile_pics" :key="pic" xs4>
                  <v-card @click="$root.accountPic == pic ? $root.accountPic = null : $root.accountPic = pic" v-ripple flat tile>
                    <v-img :src="`https://www.theparadigmdev.com/relay/profile-pics/${pic}.jpg`" width="150px" height="150px"></v-img>
                    <v-fade-transition>
                      <v-overlay v-if="$root.accountPic == pic" absolute>
                        <v-icon>mdi-check</v-icon>
                      </v-overlay>
                    </v-fade-transition>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container> -->

            <v-file-input prepend-icon="" class="mt-7" id="file" ref="file" v-model="new_user.pic" label="Profile pic..."></v-file-input>
          </v-window-item>

          <v-window-item :value="6">
            <v-checkbox label="I have read and accept the Terms and Conditions" v-model="new_user.terms"></v-checkbox>
            <v-btn @click="window.open('https://github.com/Paradigm-Dev/paradigm/blob/master/TERMS.md')" text class="mt-4 blue-grey--text text--lighten-2">View Terms</v-btn><br>
            <!-- <v-btn @click="$root.view.terms = true" text class="mt-4 blue-grey--text text--lighten-2">View Terms</v-btn><br> -->
            <span class="caption grey--text text--darken-1">
              Please read and accept the Terms and Conditions.
            </span>
          </v-window-item>

          <v-window-item :value="7">
            <h1 class="display-1 my-4 font-weight-light text-center">Welcome to Paradigm!</h1>
          </v-window-item>
        </v-window>
        
        <v-divider class="my-8"></v-divider>

        <p v-if="$root.config.migrate" class="text-center">Have an old Paradigm v1.x account? <a @click="method = 'migrate'">Migrate</a>.</p>
        <p class="text-center">Already have an account? <a @click="method = 'in'">Sign in</a>.</p>
      </v-card-text>

      <v-card-actions>
        <v-btn :disabled="step === 1 || step === 7" text @click="step--">Back</v-btn>
        <v-spacer></v-spacer>
        <v-btn v-if="step !== 7" color="primary" @click="step++">Next</v-btn>
        <v-btn color="primary" v-if="step === 7" @click="signUp()">Continue</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="user_auth_info.in" max-width="350">
			<v-card color="red">
				<v-card-title class="title text-center font-weight-medium text-uppercase">Error</v-card-title>
				<v-card-text>This user is logged in on another client. If you continue, that client's connection will be closed.</v-card-text>
				<v-card-actions>
					<v-btn text color="grey" @click="dup_client_dialog = false">Cancel</v-btn>
					<v-spacer></v-spacer>
					<v-btn text color="white" @click="closeDupClient()">Confirm</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

    <!-- <v-footer app color="rgb(18, 18, 18)" v-if="$vuetify.breakpoint.smAndUp">
      <p class="font-italic text-center pb-0 mb-0 ma-auto"><a @click="$root.view.quote = true" class="grey--text text--darken-2">Here's to the crazy ones...</a></p>
    </v-footer> -->
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
      window,
      dup_client_dialog: false
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
              pic: 'paradigm.jpg',
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
        this.$http.get(`https://www.theparadigmdev.com/api/users/check/${this.username}`).then(response => {
          this.user_auth_info = response.data
        })
      }
    },
    checkIfUserExistsMigrate() {
      if (this.username.length < 1) this.username_exists = false
      else { 
        this.$http.get(`https://www.theparadigmdev.com/api/users/migrate/check/${this.username}`).then(response => {
          this.user_auth_info.exists = response.data.exists
        })
      }
    },
    closeDupClient() {
      this.$root.socket.emit('kick', this.username)
      this.user_auth_info.in = false
    }
  }
}
</script>

<style scoped>

</style>