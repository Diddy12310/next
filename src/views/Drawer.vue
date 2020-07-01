<template>
  <div>
    <v-toolbar dense color="teal darken-3">
      <v-toolbar-title>Drawer</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-file-input style="max-width: 500px;" color="white" prepend-icon="mdi-" class="mt-7" id="file" ref="file" v-model="files" multiple label="Upload"></v-file-input>
      <v-btn :disabled="!files" @click="uploadFile()" icon><v-icon>mdi-upload</v-icon></v-btn>
      <v-btn icon @click="getFileList()"><v-icon>mdi-refresh</v-icon></v-btn>
    </v-toolbar>
    <v-container :style="{ height: `calc(100vh - ${$root.music.open ? '192px' : '112px'})`, overflowY: 'auto' }">
      <v-data-table no-data-text="No files found" :headers="headers" :items="filelist" :items-per-page="10" class="elevation-1" dense v-if="$vuetify.breakpoint.xsOnly">
        <template v-slot:item.action="{ item }">
          <v-icon small class="light-blue--text mr-2" @click="downloadFile(item._id)">mdi-download</v-icon>
          <v-icon small class="red--text mr-2" @click="deleteFile(item._id)">mdi-delete</v-icon>
          <v-icon small class="blue-grey--text text--lighten-2 mr-2" @click="startRename(item)">mdi-form-textbox</v-icon>
          <v-menu offset-y :close-on-content-click="false">
            <template v-slot:activator="{ on }">
              <v-icon small class="white--text" v-on="on" @click="getLink(item._id)">mdi-link</v-icon>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-subtitle>{{ link }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>

      <v-data-table no-data-text="No files found" :headers="headers" :items="filelist" :items-per-page="10" class="elevation-1" v-else>
        <template v-slot:item.action="{ item }">
          <v-icon small class="light-blue--text mr-2" @click="downloadFile(item._id)">mdi-download</v-icon>
          <v-icon small class="red--text mr-2" @click="deleteFile(item._id)">mdi-delete</v-icon>
          <v-icon small class="blue-grey--text text--lighten-2 mr-2" @click="startRename(item)">mdi-form-textbox</v-icon>
          <v-menu offset-y :close-on-content-click="false">
            <template v-slot:activator="{ on }">
              <v-icon small class="white--text" v-on="on" @click="getLink(item._id)">mdi-link</v-icon>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-subtitle>{{ link }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-container>

    <v-dialog v-model="rename.open" max-width="350" @click:outside="rename = { open: false }">
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
        { text: 'Actions', value: 'action', sortable: false, width: 125 }
      ],
      filelist: [],
      files: null,
      rename: { open: false },
      link: ''
    }
  },
  methods: {
    getFileList() {
      this.filelist = []
      this.$http.get(`https://www.theparadigmdev.com/api/users/${this.$root.user._id}/drawer/list`).then(response => {
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
      this.$http.post(`https://www.theparadigmdev.com/api/drawer/${this.$root.user._id}/upload`,
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
      window.open(`https://www.theparadigmdev.com/api/drawer/${this.$root.user._id}/download/${id}`)
    },
    deleteFile(id) {
      this.$http.delete(`https://www.theparadigmdev.com/api/drawer/${this.$root.user._id}/delete/${id}`).then(response => {
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
      this.$http.post(`https://www.theparadigmdev.com/api/drawer/${this.$root.user._id}/rename/${id}`, {
        name: this.rename.name
      }).then(response => {
        this.rename = { open: false }
        this.getFileList()
      })
    },
    getLink(id) {
      this.link = `https://www.theparadigmdev.com/api/drawer/${this.$root.user._id}/download/${id}`
    }
  },
  created() {
    this.getFileList()
  }
}
</script>
