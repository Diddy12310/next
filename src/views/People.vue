<template>
  <div class="people">
    <v-toolbar dense color="green darken-3">
      <v-toolbar-title>People</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field color="white" label="Search..." class="mt-7"></v-text-field>
    </v-toolbar>

    <v-container>
      <v-fade-transition group hide-on-leave>
        <v-row key="list" v-if="!$root.profile">
          <v-col sm="4" v-for="(user, index) in filtered_people" :key="index" class="text-center">
            <v-card @click="$root.profile = user" class="pa-4 fill-height">
              <v-badge bordered bottom offset-x="30" offset-y="30" color="green" :value="user.in">
                <v-avatar size="150px"><img style="border-radius: 150px;" :src="user.pic"></v-avatar>
              </v-badge>
              <h1 class="mt-6 display-1 font-weight-medium" :style="{ color: user.color }">{{ user.username }}</h1>
              <p class="mt-1 grey--text">{{ user.bio }}</p>
            </v-card>
          </v-col>
        </v-row>

        <v-row key="profile" v-if="$root.profile">
          <v-col md="4">
            <v-btn class="mt-n2 mb-2" color="grey" text @click="$root.profile = false"><v-icon left>mdi-chevron-left</v-icon>Back</v-btn><br>
            <div class="text-center">
              <v-badge bordered bottom offset-x="30" offset-y="30" color="green" :value="$root.profile.in">
                <v-avatar size="150px"><img style="border-radius: 150px;" :src="$root.profile.pic"></v-avatar>
              </v-badge>
              <h1 class="mt-6 display-1 font-weight-medium" :style="{ color: $root.profile.color }">{{ $root.profile.username }}</h1>
              <p class="grey--text">{{ $root.profile.bio }}</p>
              <v-btn v-if="is_sent" block text disabled class="mb-2"><v-icon left>mdi-account-plus</v-icon>Friend Request Pending...</v-btn>
              <v-btn v-else-if="is_approved" @click="removeFriend()" block text class="mb-2" color="blue"><v-icon left>mdi-account-minus</v-icon>Remove Friend...</v-btn>
              <v-btn v-else @click="addFriend()" block text color="blue" class="mb-2"><v-icon left>mdi-account-plus</v-icon> Add Friend</v-btn>
              <v-btn v-if="!is_blocked" block text color="red" class="mb-2"><v-icon left>mdi-account-cancel</v-icon>Block</v-btn>
              <v-btn v-else block text color="red" class="mb-2"><v-icon left>mdi-account-cancel</v-icon>Unblock</v-btn>
            </div>
          </v-col>

          <v-col md="8">
            status posts
          </v-col>
        </v-row>
      </v-fade-transition>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'People',
  data() { return {
    people: []
  }},
  computed: {
    filtered_people() {
      var people = []
      this.people.forEach(person => {
        if (person._id != this.$root.user._id) people.push(person)
      })
      return people
    },
    is_approved() {
      var is = false
      this.$root.user.people.approved.forEach(person => {
        if (this.$root.profile._id === person._id) is = true
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
  created() {
    this.$http.get('https://www.theparadigmdev.com/api/users/list').then(response => {
      this.people = response.data
    })
  },
  methods: {
    addFriend() {
      this.$http.get(`https://www.theparadigmdev.com/api/users/${this.$root.user._id}/people/send/${this.$root.profile._id}`)
    },
    removeFriend() {
      this.$http.get(`https://www.theparadigmdev.com/api/users/${this.$root.user._id}/people/remove/${this.$root.profile._id}`).then(response => this.$root.user = response.data).catch(error => console.error(error))
    }
  }
}
</script>

<style scoped>

</style>