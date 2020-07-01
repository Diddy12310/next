<template>
  <div class="people">
    <v-toolbar dense color="green darken-3">
      <v-toolbar-title>People</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field style="max-width: 500px;" color="white" label="Search..." class="mt-7" v-model="search"></v-text-field>
    </v-toolbar>

    <v-container :style="{ height: `calc(100vh - ${$root.music.open ? '192px' : '112px'})`, overflowY: 'auto' }">
      <v-fade-transition group hide-on-leave>
        <v-row key="list" v-if="!$root.profile">
          <v-col sm="6" md="4" cols="12" v-for="(user, index) in filtered_people" :key="index" class="text-center">
            <v-card @click="$root.profile = user" class="pa-4 fill-height">
              <v-badge bordered bottom offset-x="30" offset-y="30" color="green" :value="user.in">
                <v-avatar size="150px"><img style="border-radius: 150px;" :src="user.pic"></v-avatar>
              </v-badge>
              <h1 class="mt-6 text-h4 font-weight-medium" :style="{ color: user.color }">{{ user.username }}</h1>
              <p class="mt-1 grey--text">{{ user.bio }}</p>
            </v-card>
          </v-col>
        </v-row>

        <v-row key="profile" v-if="$root.profile">
          <v-col xs="12" md="4" cols="12">
            <v-btn class="mt-n2 mb-2" color="grey" text @click="$root.profile = false"><v-icon left>mdi-chevron-left</v-icon>Back</v-btn><br>
            <div class="text-center">
              <v-badge bordered bottom offset-x="30" offset-y="30" color="green" :value="$root.profile.in">
                <v-avatar size="150px"><img style="border-radius: 150px;" :src="$root.profile.pic"></v-avatar>
              </v-badge>
              <h1 class="mt-6 text-h4 font-weight-medium" :style="{ color: $root.profile.color }">{{ $root.profile.username }}</h1>
              <p class="grey--text">{{ $root.profile.bio }}</p>
              <v-btn v-if="is_sent" block text disabled class="mb-2"><v-icon left>mdi-account-plus</v-icon>Friend Request Pending...</v-btn>
              <v-btn v-else-if="is_approved" @click="removeFriend()" block text class="mb-2" color="blue"><v-icon left>mdi-account-minus</v-icon>Remove Friend...</v-btn>
              <v-btn v-else @click="addFriend()" block text color="blue" class="mb-2"><v-icon left>mdi-account-plus</v-icon> Add Friend</v-btn>
              <v-btn v-if="!is_blocked && !is_sent && !is_approved" @click="block_confirmer = true" block text color="red" class="mb-2"><v-icon left>mdi-account-cancel</v-icon>Block</v-btn>
              <v-btn v-if="is_blocked" block text color="red" class="mb-2"><v-icon left>mdi-account-cancel</v-icon>Unblock</v-btn>
            </div>
          </v-col>

          <v-col xs="12" md="8" cols="12">
            <p class="grey--text text-center">Broadcasts</p>
            <v-card class="mx-auto my-6" color="indigo darken-3" max-width="400" v-for="(post, index) in $root.profile.posts" :key="index">
              <v-card-text class="text-h5" v-html="post.content"></v-card-text>

              <v-card-actions>
                <v-row no-gutters align="center" justify="end">
                  <v-col>
                    <v-list-item class="grow">
                      <v-list-item-avatar color="grey darken-3">
                        <v-img class="elevation-6" :src="$root.profile.pic"></v-img>
                      </v-list-item-avatar>

                      <v-list-item-content>
                        <v-list-item-title class="font-weight-medium" :style="{ color: $root.profile.color }">{{ $root.profile.username }}</v-list-item-title>
                        <v-list-item-subtitle>{{ post.timestamp }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-col>

                  <v-col class="text-right" v-if="profile_index">
                    <v-btn @click="$root.user.people.approved[profile_index].liked_posts.includes(post._id) ? unLikePost(post._id, index) : likePost(post._id, index)" :input-value="$root.user.people.approved[profile_index].liked_posts.includes(post._id)" class="mr-1" icon>
                      <v-icon>{{ $root.user.people.approved[profile_index].liked_posts.includes(post._id) ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                    </v-btn>
                    <span class="subheading mr-2">{{ post.likes }}</span>
                    <span class="mr-1">·</span>
                    <v-btn class="mr-1" icon disabled><v-icon>mdi-share-variant</v-icon></v-btn>
                    <span class="subheading mr-6 grey--text">{{ post.reposts }}</span>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-fade-transition>
    </v-container>

    <v-dialog max-width="350" v-model="block_confirmer">
      <v-card color="orange">
				<v-card-title class="title text-center font-weight-medium text-uppercase">Confirm</v-card-title>
        <v-card-text>
          If you block {{ $root.profile.username }}, you won't see any of their Broadcasts nor be able to DM them. But, you will still see their posts in a chatroom.
        </v-card-text>
        <v-card-actions>
          <v-btn text color="grey darken-1">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click="blockPerson()">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'People',
  data() { return {
    people: [],
    block_confirmer: false,
    search: '',
    profile_index: null
  }},
  computed: {
    filtered_people() {
      var people = []
      this.people.forEach(person => {
        var blocked = false
        this.$root.user.people.blocked.forEach(profile => {
          if (profile._id === person._id) blocked = true
        })
        if (person._id != this.$root.user._id && !this.$root.user.people.blocked_by.includes(person._id) && !blocked) people.push(person)
      })
      return people.filter(person => {
				return person.username.toLowerCase().includes(this.search.toLowerCase()) || person.bio.toLowerCase().includes(this.search.toLowerCase()) || person.bio.toLowerCase().includes(this.search.toLowerCase())
			})
    },
    is_approved() {
      var is = false
      this.$root.user.people.approved.forEach((person, index) => {
        if (this.$root.profile._id === person._id) {
          is = true
          this.profile_index = index
        }
      })
      return is
    },
    is_sent() {
      var is = false
      this.$root.user.people.sent.forEach(person => {
        if (this.$root.profile._id === person._id) is = true
      })
      return is
    },
    is_blocked() {
      var is = false
      this.$root.user.people.blocked.forEach(person => {
        if (this.$root.profile._id === person._id) is = true
      })
      return is
    }
  },
  async created() {
    await this.$http.get('https://www.theparadigmdev.com/api/users/list').then(response => {
      this.people = response.data
    })
    if (this.$root.url[1] == 'people') {
      this.people.forEach(person => {
        if (this.$root.url[2] == person.username) {
          this.$root.profile = person
        }
      })
    }
  },
  destroyed() {
    this.$root.profile = false
  },
  methods: {
    addFriend() {
      this.$http.get(`https://www.theparadigmdev.com/api/users/${this.$root.user._id}/people/send/${this.$root.profile._id}`)
    },
    removeFriend() {
      this.$http.get(`https://www.theparadigmdev.com/api/users/${this.$root.user._id}/people/remove/${this.$root.profile._id}`).then(response => this.$root.user.people = response.data).catch(error => console.error(error))
    },
    blockPerson() {
      this.$http.get(`https://www.theparadigmdev.com/api/users/${this.$root.user._id}/people/block/${this.$root.profile._id}`).then(response => { this.$root.user.people = response.data; this.$root.profile = false; this.block_confirmer = false; }).catch(error => console.error(error))
    },
    likePost(id, index) {
      this.$http.get(`https://www.theparadigmdev.com/api/broadcast/${this.$root.user._id}/like/${this.$root.profile._id}/${id}`).then(response => {
        this.$root.profile = response.data.profile
        this.$root.user = response.data.user
        this.$root.profile.posts[index].likes++
      }).catch(error => console.error(error))
    },
    unLikePost(id, index) {
      this.$http.get(`https://www.theparadigmdev.com/api/broadcast/${this.$root.user._id}/unlike/${this.$root.profile._id}/${id}`).then(response => {
        this.$root.profile = response.data.profile
        this.$root.user = response.data.user
        this.$root.profile.posts[index].likes--
      }).catch(error => console.error(error))
    }
  }
}
</script>

<style scoped>

</style>