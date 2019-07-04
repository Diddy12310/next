<template>
  <div>
    <v-card>
      <v-card-title>
        <span>Report a Bug</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="$root.bugreport_dialog = false" class="dialog-close-btn">
					<v-icon>close</v-icon>
				</v-btn>
      </v-card-title>
      <v-card-text>
        Report any bugs you find here.
        <v-text-field label="Title" v-model="bug_title"></v-text-field>
        <v-select :items="bug_categories" label="Category" v-model="bug_category"></v-select>
        <v-autocomplete :items="bug_locations" label="Location" v-model="bug_location"></v-autocomplete>
        <v-slider label="Importance" v-model="bug_importance" thumb-label max="10"></v-slider>
        <v-textarea label="Description" v-model="bug_body" hint="You can style the description by using HTML."></v-textarea>
        <div>
					<img src="@/assets/moonrocks.png" alt="Moonrocks" class="moonrock-img"><span class="moonrock-count font-weight-medium green--text">+ 15</span>
					<p>If this bug exists, you will be awarded 15 Moonrocks.</p>
					<p>New Balance: <span class="font-weight-light">{{ $root.moonrocks + 15 }} Moonrocks</span></p>
				</div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="accent" @click="submitBug()">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { db } from '@/firebase'

export default {
  name: 'BugReport',
  data() {
    return {
      bug_title: '',
      bug_body: '',
      bug_category: '',
      bug_importance: '',
      bug_location: '',
      bug_categories: ['Feature', 'UI', 'Link/Button', 'Unexpected response'],
      bug_locations: ['Toolbar', 'Navigation drawer', 'Footer', 'Home', 'Flamechat', 'The Paradox', 'Satellite', 'Asteroid', 'Scorecard', 'Drawer', 'Media', 'Weather', 'Latest Memes', 'Roadmap', 'Terms and Conditions', 'Network Status', 'Contracting', 'Relay', 'Databank', 'Account', 'Terminal', 'Support', 'Report a Bug', 'Write']
    }
  },
  methods: {
    submitBug() {
      if (this.bug_title && this.bug_body && this.bug_category && this.bug_importance && this.bug_location) {
        db.collection('bugs').add({
          username: this.$root.username,
          title: this.bug_title,
          body: this.bug_body,
          category: this.bug_category,
          importance: this.bug_importance
        }).then(() => {
          this.$root.feedback = 'Bug report submitted!'
          this.$root.snackbar = true
        })
      } else {
        this.$root.feedback = 'Fill in all of the fields!'
        this.$root.snackbar = true
      }
    }
  }
}
</script>

<style scoped>

</style>
