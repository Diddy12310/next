<template>
  <div class="account">
    <v-toolbar dense color="deep-purple darken-3">
      <v-toolbar-title>Account</v-toolbar-title>
    </v-toolbar>

    <div style="height: calc(100vh - 112px); overflow: auto;">
      <v-container>
        <div class="text-center my-12">
          <v-avatar style="cursor: pointer;" v-ripple @click="uploader = true" height="175" width="175"><v-img :src="user.pic"></v-img></v-avatar><br>
          <input type="text" @input="change = true" class="display-2 font-weight-medium text-uppercase mt-8" style="text-align: center; width: 100%;" :style="{ color: user.color }" v-model="user.username">
          <p class="grey--text text--darken-1 font-weight-light">{{ user._id }}</p>
          <div class="text-center mt-3" style="width: 250px; margin: auto;">
            <img height="50" width="50" src="@/assets/moonrocks.png">
            <span style="position: relative; top: -18px;" class="font-weight-light">{{ user.moonrocks }}</span>
          </div>
        </div>
        <v-row>
          <v-col sm="6">
            <v-card class="fill-height">
              <v-card-text>
                <p>Settings</p>
                <v-text-field @input="change = true" v-model="user.bio" label="Bio"></v-text-field>
                <p>Color</p>
                <v-color-picker @input="change = true" v-model="user.color" class="elevation-0"></v-color-picker>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col sm="6">
            <v-card class="fill-height">
              <v-card-text>
                <p>Rights</p>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Key</th>
                        <th class="text-left">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Administrator</td>
                        <td>{{ user.rights.admin }}</td>
                      </tr>
                      <tr>
                        <td>Author</td>
                        <td>{{ user.rights.author }}</td>
                      </tr>
                      <tr>
                        <td>Asteroid</td>
                        <td>{{ user.rights.asteroid }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col sm="6">
            <v-card class="fill-height">
              <v-card-text>
                <p>Friends</p>
                <v-list>
                  <v-list-item v-if="user.friends.length <= 0">
                    <v-list-item-title class="text-center grey--text font-italic">You have no friends.</v-list-item-title>
                  </v-list-item>

                  <v-list-item v-for="(friend, index) in user.friends" :key="index">
                    <v-list-item-avatar><v-img :src="friend.pic"></v-img></v-list-item-avatar>
                    <v-list-item-title class="text-uppercase font-weight-medium" :style="{ color: friend.color }">{{ friend.username }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col sm="6">
            <v-card class="fill-height">
              <v-card-text>
                <p>Chatrooms</p>
                <v-list max-height="390" style="overflow: auto;">
                  <v-list-item v-if="user.chatrooms.length <= 0">
                    <v-list-item-title class="text-center">You aren't in any chatrooms.</v-list-item-title>
                  </v-list-item>

                  <v-list-item v-for="(chatroom, index) in user.chatrooms" :key="index">
                    <v-list-item-icon><v-icon>{{ chatroom.icon }}</v-icon></v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>{{ chatroom.name }}</v-list-item-title>
                      <v-list-item-subtitle>{{ chatroom.id }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col sm="6">
            <v-card class="fill-height">
              <v-card-text>
                <p>Change Password</p>
                <v-text-field style="min-width: 320px;" type="password" label="Current Password" v-model="reset.current"></v-text-field>
                <v-text-field type="password" label="New Password" v-model="reset.new"></v-text-field>
                <v-text-field @keypress.enter="changePassword()" type="password" label="Verify New Password" v-model="reset.verify"></v-text-field>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :disabled="!reset.current || !reset.new || !reset.verify || reset.new !== reset.verify" text color="blue accent-1" @click="changePassword()">Change</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col sm="6">
            <v-card class="fill-height">
              <v-card-text class="text-center">
                <p class="text-left">Danger Zone</p>
                <v-btn style="margin: 95px 0px 95px 0px;" color="red" @click="delete_dialog = true">Delete Account</v-btn>
              </v-card-text>
              <v-btn fab absolute top right x-small text v-if="$root.user.rights.patriot" @click="$root.router = 'patriot'"></v-btn>
            </v-card>
          </v-col>
        </v-row>

        <p class="grey--text font-italic pt-8 pb-4 text-center">Your account was created on {{ $root.user.created }}.</p>

      </v-container>
    </div>

    <v-dialog v-model="uploader" max-width="300">
      <v-card>
        <v-card-title>Profile Picture</v-card-title>
        <v-card-text>
          <v-file-input prepend-icon="" id="file" ref="file" v-model="new_pic" multiple label="Upload..."></v-file-input>
          <p class="text-center mb-0">This will take effect the next time you log in.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="blue accent-1" @click="uploadNewPic()">Upload</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="delete_dialog" max-width="350">
      <v-card color="red" class="text-center">
        <v-card-title class="text-center">DELETE ACCOUNT</v-card-title>
        <v-card-text>
          <v-checkbox label="By checking this box, you acknowledge that deleting your account is irreversible. Your drawer files will be deleted. Your data will be deleted." color="white" v-model="delete_verify"></v-checkbox>
          <p class="text-center mb-0"></p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :disabled="!delete_verify" text color="white" @click="deleteAccount()">Delete</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn style="z-index: 1000;" large fab absolute top right color="blue" v-if="change == true" @click="saveChanges()"><v-icon>mdi-content-save</v-icon></v-btn>
  </div>
</template>

<script>
export default {
  name: 'Account',
  data() {
    return {
      user: {},
      reset: {},
      change: false,
      new_pic: null,
      uploader: false,
      delete_dialog: false,
      delete_verify: false,
      console: console
    }
  },
  methods: {
    changePassword() {
      if (this.reset.new === this.reset.verify) {
        this.$http.post('https://www.theparadigmdev.com/api/users/signin', {
          username: this.$root.user.username,
          password: this.reset.current
        }).then(response => {
          if (!response.data.msg) {
            this.$http.post('https://www.theparadigmdev.com/api/users/reset', {
              username: this.$root.user.username,
              password: this.reset.new
            }).then(response => {
              this.$root.user = response.data
              this.user = response.data
            })
          } else {
            this.$notify('Your current password is incorrect', 'error', 'mdi-lock', false, 3000)
          }
        }).catch(error => console.error(JSON.stringify(error)))
      }
    },
    saveChanges() {
      this.$http.post('https://www.theparadigmdev.com/api/users/update', {
        old: this.$root.user.username,
        username: this.user.username,
        bio: this.user.bio,
        color: this.user.color
      }).then(response => {
        this.$root.user = response.data
        this.user = response.data
        this.change = false
      }).catch(error => console.error(error))
    },
    uploadNewPic() {
      let formData = new FormData()
      for (var i = 0; i < this.new_pic.length; i++ ) {
        let file = this.new_pic[i]
        formData.append('files[' + i + ']', file)
      }
      this.$http.post(`https://www.theparadigmdev.com/api/users/${this.$root.user.username}/pic`,
        formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      ).then(response => {
        this.$root.user = response.data
        this.user = response.data
        this.new_pic = null
        this.uploader = false
      })
      .catch(error => {
        console.log('Upload: failed', error)
        this.new_pic = null
      })
    },
    deleteAccount() {
      this.$http.get(`https://www.theparadigmdev.com/api/users/${this.$root.user.username}/delete`).then(response => {
        this.$root.user = false
        this.$root.router = 'auth'
      }).catch(error => console.error(error))
    }
  },
  created() {
    this.user = JSON.parse(JSON.stringify(this.$root.user))
  }
}
</script>

<style scoped>

</style>