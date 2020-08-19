<template>
  <div class="developer">
    <v-toolbar dense color="blue-grey darken-4">
      <v-toolbar-title>Developer</v-toolbar-title>
    </v-toolbar>
    <v-tabs v-model="tab" centered background-color="blue-grey darken-4" color="white">
      <v-tab>Bug Reports</v-tab>
      <v-tab disabled>Dashboard</v-tab>
      <v-tab disabled>Timeline</v-tab>
      <v-tab disabled>Documentation</v-tab>
      <v-tab disabled>Resources</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab" style="background: none;">
      <v-tab-item>
        <v-container>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Title</th>
                  <th class="text-left">Category</th>
                  <th class="text-left">Location</th>
                  <th class="text-left">Priority</th>
                  <th class="text-left">Description</th>
                  <th class="text-left">User</th>
                  <th class="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(bug, index) in bugs" :key="index" :style="{ 'text-decoration': bug.fixed ? 'line-through' : 'none' }" :class="{ 'grey--text text--darken-1': bug.fixed }">
                  <td>{{ bug.title }}</td>
                  <td>{{ bug.category }}</td>
                  <td>{{ bug.location }}</td>
                  <td>{{ bug.priority }}</td>
                  <td>{{ bug.description }}</td>
                  <td v-ripple style="cursor: pointer;" @click="$go(['', 'people', bug.username])">{{ bug.username }}</td>
                  <td v-if="!bug.fixed">
                    <v-icon small class="green--text mr-2" @click="fixBug(bug._id)">mdi-check</v-icon>
                    <v-icon small class="red--text text--lighten-2 mr-2" @click="deleteBug(bug._id)">mdi-close</v-icon>
                  </td>
                  <td v-if="bug.fixed">
                    <v-icon small class="grey--text text--lighten-1 mr-2" @click="unfixBug(bug._id)">mdi-undo-variant</v-icon>
                    <v-icon small class="red--text text--lighten-2 mr-2" @click="deleteBug(bug._id)">mdi-close</v-icon>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <p v-if="bugs.length < 1" class="text-center mt-6 grey--text font-italic">No bugs reported.</p>
        </v-container>
      </v-tab-item>
      <v-tab-item></v-tab-item>
      <v-tab-item></v-tab-item>
      <v-tab-item></v-tab-item>
      <v-tab-item></v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
export default {
  name: 'Developer',
  data() {
    return {
      tab: 0,
      bugs: []
    }
  },
  created() {
    this.$http.get('https://www.theparadigmdev.com/api/bugs').then(response => {
      this.bugs = response.data
    })
  },
  methods: {
    fixBug(bug) {
      this.$http.put(`https://www.theparadigmdev.com/api/bugs/${bug}`).then(response => {
        this.bugs = response.data
      })
    },
    unfixBug(bug) {
      this.$http.get(`https://www.theparadigmdev.com/api/bugs/${bug}`).then(response => {
        this.bugs = response.data
      })
    },
    deleteBug(bug) {
      this.$http.delete(`https://www.theparadigmdev.com/api/bugs/${bug}`).then(response => {
        this.bugs = response.data
      })
    }
  }
}
</script>

<style scoped>

</style>