<template>
  <div>
    <v-toolbar dense color="teal darken-3">
      <v-toolbar-title>Drawer</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <input type="file" name="file" id="file" ref="file"> -->
      <v-file-input color="white" prepend-icon="mdi-" class="mt-7" id="file" ref="file" v-model="files" multiple label="Upload"></v-file-input>
      <v-btn @click="uploadFile()" icon><v-icon>mdi-upload</v-icon></v-btn>
      <v-btn icon @click="getFileList()"><v-icon>mdi-refresh</v-icon></v-btn>
    </v-toolbar>
    <v-container>
      <v-data-table :headers="headers" :items="filelist" :items-per-page="10" class="elevation-1">
        <template v-slot:item.action="{ item }">
          <v-icon small class="light-blue--text mr-2" @click="downloadFile(item)">mdi-download</v-icon>
          <v-icon small class="red--text" @click="deleteFile(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import FileSaver from 'file-saver'

export default {
  name: 'App',
  data() {
    return {
      headers: [
        { text: 'Title', value: 'title' },
        { text: 'Type', value: 'type' },
        { text: 'Size', value: 'size' },
        { text: 'Uploaded', value: 'date' },
        { text: 'Actions', value: 'action', sortable: false }
      ],
      filelist: [],
      files: null
    }
  },
  methods: {
    getFileList() {
      this.filelist = []
      axios.get(`https://relay.theparadigmdev.com/files/${this.$root.username}`)
        .then(response => {
          response.data.forEach(filename => {
            var data = {
              title: filename.slice(0, filename.lastIndexOf('.')),
              type: filename.slice(filename.lastIndexOf('.') + 1),
              path: filename
            }
            this.filelist.push(data)
          })
        })
        .catch(error => {
          console.error('File list: failed')
        })
        .finally(() => {
          console.log('File list: success')
        })
    },
    uploadFile() {
      let formData = new FormData()
      for (var i = 0; i < this.files.length; i++ ) {
        let file = this.files[i]
        formData.append('files[' + i + ']', file)
      }
      axios.post(`https://relay.theparadigmdev.com/upload/${this.$root.username}`,
        formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      ).then(() => {
        console.log('Upload: success')
        this.files = null
        this.$nextTick(() => { this.getFileList() })
      })
      .catch(error => {
        console.log('Upload: failed', error)
        this.files = null
        this.$nextTick(() => { this.getFileList() })
      })
      // this.$nextTick(() => { this.getFileList() })
    },
    downloadFile(item) {
      window.open(`https://relay.theparadigmdev.com/download/${this.$root.username}/${item.path}`)
      console.log('Download: success')
    },
    deleteFile(item) {
      var that = this
      axios.delete(`https://relay.theparadigmdev.com/file/${this.$root.username}/${item.path}`)
        .then(response => {
          this.getFileList()
          console.log('Delete: success')
        })
        .catch(error => {
          this.getFileList()
          console.error('Delete: error', error)
        })
      this.getFileList()
    }
  },
  created() {
    this.getFileList()
  }
}
</script>
