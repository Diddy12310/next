<template>
  <div>
    <v-toolbar dense color="teal darken-3">
      <v-toolbar-title>Drawer</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-file-input color="white" prepend-icon="mdi-" class="mt-7" id="file" ref="file" v-model="files" multiple label="Upload"></v-file-input>
      <v-btn :disabled="!files" @click="uploadFile()" icon><v-icon>mdi-upload</v-icon></v-btn>
      <v-btn icon @click="getFileList()"><v-icon>mdi-refresh</v-icon></v-btn>
    </v-toolbar>
    <v-container style="height: calc(100vh - 112px); overflow: auto;">
      <v-data-table no-data-text="No files found" :headers="headers" :items="filelist" :items-per-page="10" class="elevation-1" dense v-if="$vuetify.breakpoint.xsOnly">
        <template v-slot:item.action="{ item }">
          <v-icon small class="light-blue--text mr-2" @click="downloadFile(item._id)">mdi-download</v-icon>
          <v-icon small class="red--text mr-2" @click="deleteFile(item._id)">mdi-delete</v-icon>
          <v-icon small class="white--text" @click="startRename(item)">mdi-textbox</v-icon>
        </template>
      </v-data-table>

      <v-data-table no-data-text="No files found" :headers="headers" :items="filelist" :items-per-page="10" class="elevation-1" v-else>
        <template v-slot:item.action="{ item }">
          <v-icon small class="light-blue--text mr-2" @click="downloadFile(item._id)">mdi-download</v-icon>
          <v-icon small class="red--text mr-2" @click="deleteFile(item._id)">mdi-delete</v-icon>
          <v-icon small class="white--text" @click="startRename(item)">mdi-textbox</v-icon>
        </template>
      </v-data-table>
    </v-container>

    <v-dialog v-model="rename.open" max-width="300" @click:outside="rename = { open: false }">
      <v-card style="text-align: center">
        <v-card-title>Rename File</v-card-title>
        <v-card-text>
          <v-text-field @keypress.enter="renameFile(rename._id)" v-model="rename.name" label="File name"></v-text-field>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'Drawer',
  data() {
    return {
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Type', value: 'type' },
        { text: 'Size', value: 'size' },
        { text: 'Uploaded', value: 'date', width: 200 },
        { text: 'Actions', value: 'action', sortable: false, width: 100 }
      ],
      filelist: [],
      files: null,
      rename: { open: false }
    }
  },
  methods: {
    getFileList() {
      this.filelist = []
      this.$http.get(`https://www.theparadigmdev.com/users/${this.$root.user.username}/drawer/list`).then(response => {
        this.filelist = response.data
      }).catch(error => {
        console.error('File list: failed')
      }).finally(() => {})
    },
    uploadFile() {
      let formData = new FormData()
      for (var i = 0; i < this.files.length; i++ ) {
        let file = this.files[i]
        formData.append('files[' + i + ']', file)
      }
      this.$http.post(`https://www.theparadigmdev.com/drawer/${this.$root.user.username}/upload`,
        formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      ).then(() => {
        this.files = null
        this.getFileList()
      })
      .catch(error => {
        console.log('Upload: failed', error)
        this.files = null
        this.getFileList()
      })
    },
    downloadFile(id) {
      window.open(`https://www.theparadigmdev.com/drawer/${this.$root.user.username}/download/${id}`)
    },
    deleteFile(id) {
      this.$http.delete(`https://www.theparadigmdev.com/drawer/${this.$root.user.username}/delete/${id}`).then(response => {
        this.getFileList()
      }).catch(error => {
        this.getFileList()
        console.error('Delete: error', error)
      })
    },
    startRename(item) {
      this.rename = JSON.parse(JSON.stringify(item))
      this.rename.open = true
    },
    renameFile(id) {
      this.$http.post(`https://www.theparadigmdev.com/drawer/${this.$root.user.username}/rename/${id}`, {
        name: this.rename.name
      }).then(response => {
        this.rename = { open: false }
        this.getFileList()
      })
    }
  },
  created() {
    this.getFileList()
  }
}
</script>
