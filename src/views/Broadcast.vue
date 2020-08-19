<template>
  <div class="broadcast">
    <v-toolbar dense color="indigo darken-3" style="z-index: 1;">
      <v-toolbar-title>Broadcast</v-toolbar-title>
      <v-spacer></v-spacer>
			<v-text-field hide-details="auto" style="max-width: 500px;" color="white" class="mt-4" label="Search..." v-model="search"></v-text-field>
    </v-toolbar>

    <div :style="{ height: `calc(100vh - ${$root.music.open ? '192px' : '112px'})`, overflowY: 'auto' }">
      <v-fade-transition group>
        <v-card class="mx-auto mt-6" color="indigo darken-3" max-width="500" key="new">
          <v-card-text class="text-h5">
            <v-textarea class="pb-0" hide-details @keypress.shift.enter.exact.prevent="post()" label="Content..." v-model="content"></v-textarea>
          </v-card-text>

          <v-card-actions>
            <v-btn text color="red">Clear</v-btn>
            <v-spacer></v-spacer>
            <v-btn text color="white" @click="post()">Post</v-btn>
          </v-card-actions>
        </v-card>

        <v-card class="mx-auto my-6" color="indigo darken-3" max-width="500" v-for="(post, index) in filteredPosts" :key="index">
          <v-card-text class="text-h5" v-html="post.content"></v-card-text>

          <v-card-actions>
            <v-row no-gutters align="center" justify="end">
              <v-col>
                <v-list-item class="grow">
                  <v-list-item-avatar color="grey darken-3">
                    <v-img class="elevation-6" loading="lazy" :src="$root.user.pic"></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title class="font-weight-medium" :style="{ color: $root.user.color }">{{ $root.user.username }}</v-list-item-title>
                    <v-list-item-subtitle>{{ post.timestamp }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>

              <v-col class="text-right">
                <v-btn icon @click="startEditing(post)"><v-icon>mdi-pencil</v-icon></v-btn>
                <v-btn icon class="mr-2" @click="remove(post._id)"><v-icon>mdi-delete</v-icon></v-btn>
                <v-icon class="mr-1">mdi-heart</v-icon>
                <span class="subheading mr-2">{{ post.likes }}</span>
                <span class="mr-1">·</span>
                <v-icon class="mr-1 grey--text">mdi-share-variant</v-icon>
                <span class="subheading mr-6 grey--text">{{ post.reposts }}</span>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-fade-transition>
    </div>

  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Broadcast',
  data() {
    return {
      content: '',
      search: ''
    }
  },
  computed: {
    filteredPosts() {
      return this.$root.user.posts.filter(item => {
				return item.content.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },
  methods: {
    post() {
      this.$http.post(`https://www.theparadigmdev.com/api/broadcast/${this.$root.user._id}/create`, {
        content: this.content,
        timestamp: moment().format('MM/DD/YYYY [at] h:mm a'),
        likes: 0,
        reposts: 0,
      }).then(response => { this.$root.user.posts = response.data; this.content = '' }).catch(error => console.error(error))
    },
    remove(id) {
      this.$http.get(`https://www.theparadigmdev.com/api/broadcast/${this.$root.user._id}/delete/${id}`).then(response => this.$root.user.posts = response.data).catch(error => console.error(error))
    }
  }
}
</script>

<style>

</style>