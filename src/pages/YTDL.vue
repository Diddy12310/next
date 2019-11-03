<template>
  <div class="ytdl">
    <v-text-field label="YouTube URL" v-model="url"></v-text-field>
    <v-btn @click="downloadYTFile()">Save</v-btn>
  </div>
</template>

<script>
import { func } from '@/firebase.js'

export default {
  name: 'YTDL',
  data() {
    return {
      url: ''
    }
  },
  methods: {
    downloadYTFile() {
      var getYTDownloadLink = func.httpsCallable('getYTDownloadLink')
      getYTDownloadLink({ url: this.url }).then(result => {
        console.log(result.data)
      })
    }
  }
}
</script>

<style scoped>

</style>