<template>
  <v-app>
    <v-app-bar app style="background: linear-gradient(135deg, #162fa1 0%, #50336e 100%);">
      <v-toolbar-title>
        <img style="height: 45px; z-index: 10;" src="./assets/rover.png" class="logo">
      </v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer app>
      <v-list dense nav>
        <v-list-item-group v-model="page">
          <v-list-item @click="page = 'books', getFileList()" value="books">
            <v-list-item-icon><v-icon>mdi-bookshelf</v-icon></v-list-item-icon>
            <v-list-item-title>Books</v-list-item-title>
          </v-list-item>
          <v-list-item @click="page = 'img', getFileList()" value="img">
            <v-list-item-icon><v-icon>mdi-image</v-icon></v-list-item-icon>
            <v-list-item-title>Images</v-list-item-title>
          </v-list-item>
          <v-list-item @click="page = 'movies', getFileList()" value="movies">
            <v-list-item-icon><v-icon>mdi-movie</v-icon></v-list-item-icon>
            <v-list-item-title>Movies</v-list-item-title>
          </v-list-item>
          <v-list-item @click="page = 'music', getFileList()" value="music">
            <v-list-item-icon><v-icon>mdi-music-note</v-icon></v-list-item-icon>
            <v-list-item-title>Music</v-list-item-title>
          </v-list-item>
          <v-list-item @click="page = 'profile-pics', getFileList()" value="profile-pics">
            <v-list-item-icon><v-icon>mdi-face-profile</v-icon></v-list-item-icon>
            <v-list-item-title>Profile Pics</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-content style="z-index: 1;">
      <v-container v-if="!file_list" fluid class="text-center pt-0">
        <v-row>
          <v-col xs="12" cols="12" class="deep-purple py-12 elevation-5" style="z-index: 5;">
            <h1 class="display-3 font-weight-thin white--text">Rover</h1>
          </v-col>
          <v-col xs="12" cols="12" class="blue darken-3 elevation-5 py-4">
            <h3 class="mt-2 display-1 grey--text font-weight-thin">Please select a folder from the left.</h3>
          </v-col>
        </v-row>
      </v-container>
      <v-container>
        <v-data-table v-if="file_list" :headers="headers" :items="file_list" :items-per-page="15" class="elevation-4">
          <template v-slot:item.action="{ item }">
            <v-icon small class="light-blue--text mr-2" @click="downloadFile(item)">mdi-download</v-icon>
            <v-icon small @click="openPathCopy(item)">mdi-link</v-icon>
          </template>
        </v-data-table>
      </v-container>
    </v-content>

    <v-dialog width="500" v-model="copy_path_dialog">
      <v-card>
        <v-container fluid>
          <v-row justify="center" align="center">
            <v-col sm="9">
              <v-text-field class="pl-5 pt-2" dense id="copy_path" v-model="path_to_copy"></v-text-field>
            </v-col>
            <v-col sm="3">
              <v-btn text color="blue lighten-2" @click="copyPath()">Copy</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  data() {
    return {
      headers: [
        { text: 'Title', value: 'title' },
        { text: 'Type', value: 'type' },
        { text: 'Size', value: 'size' },
        { text: 'Actions', value: 'action', sortable: false }
      ],
      page: '',
      file_list: null,
      path_to_copy: '',
      copy_path_dialog: false
    }
  },
  methods: {
    downloadFile(item) {
      window.open(`https://relay.theparadigmdev.com/${this.page}/${item.path}`)
    },
    openPathCopy(item) {
      this.path_to_copy = `https://relay.theparadigmdev.com/${this.page}/${item.path}`
      this.copy_path_dialog = true
    },
    copyPath(item) {
      var copyText = document.getElementById('copy_path')

      copyText.select()
      copyText.setSelectionRange(0, 99999)

      document.execCommand('copy')

      this.copy_path_dialog = false
      this.path_to_copy = ''
    },
    getFileList() {
      this.file_list = []
      axios.get(`https://relay.theparadigmdev.com/relay/list/${this.page}`)
        .then(response => {
          response.data.forEach(filename => {
            var data
            if (filename.includes('.')) {
              data = {
                title: filename.slice(0, filename.lastIndexOf('.')),
                type: filename.slice(filename.lastIndexOf('.') + 1),
                path: filename
              }
            } else {
              data = {
                title: filename,
                type: 'folder',
                path: filename
              } 
            }
            this.file_list.push(data)
          })
        })
        .catch(error => {
          console.error('File list: failed')
        })
        .finally(() => {
          console.log('File list: success')
        })
    }
  }
}
</script>

<style scoped>
.logo {
	margin: 0;
  position: absolute;
  top: 50%;
  left: 75px;
  transform: translate(-50%, -50%);
}
</style>