<template>
  <div>
    <v-toolbar dense color="teal darken-3">
      <v-toolbar-title>Drawer</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-file-input
        :disabled="uploading"
        style="max-width: 500px"
        color="white"
        prepend-icon="mdi-"
        class="mt-9"
        id="file"
        ref="file"
        v-model="files"
        multiple
        label="Upload..."
      ></v-file-input>
      <v-btn :disabled="!files || uploading" @click="uploadFile()" icon
        ><v-icon>mdi-upload</v-icon></v-btn
      >
      <v-progress-linear
        :background-opacity="0"
        :active="uploading"
        :value="uploadPercentage"
        absolute
        bottom
        color="teal"
      ></v-progress-linear>
    </v-toolbar>
    <v-container
      :style="{
        height: $vuetify.breakpoint.mdAndUp
          ? 'calc(100vh - 112px)'
          : 'calc(100vh - 104px)',
      }"
      style="overflow-y: auto"
    >
      <v-data-table
        no-data-text="No files found"
        :headers="headers"
        :items="$root.user.files"
        :items-per-page="10"
        class="elevation-1"
        dense
        v-if="$vuetify.breakpoint.xsOnly"
      >
        <template v-slot:item.icon="{ item }">
          <v-icon v-if="item.type.includes('image')">mdi-image</v-icon>
          <v-icon v-else-if="item.type.includes('video')">mdi-video</v-icon>
          <v-icon v-else-if="item.type.includes('audio')"
            >mdi-music-note</v-icon
          >
          <v-icon v-else-if="item.type.includes('pdf')">mdi-file-pdf</v-icon>
          <v-icon v-else-if="item.type.includes('workshop')"
            >mdi-file-cloud</v-icon
          >
          <v-icon v-else>mdi-file</v-icon>
        </template>

        <template v-slot:item.action="{ item }">
          <v-icon
            small
            class="light-blue--text mr-2"
            @click="downloadFile(item._id)"
            >mdi-download</v-icon
          >
          <v-icon small class="red--text mr-2" @click="deleteFile(item._id)"
            >mdi-delete</v-icon
          >
          <v-icon
            small
            class="blue-grey--text text--lighten-2 mr-2"
            @click="startRename(item)"
            >mdi-form-textbox</v-icon
          >
          <v-menu offset-y :close-on-content-click="false">
            <template v-slot:activator="{ on }">
              <v-icon
                small
                class="white--text"
                v-on="on"
                @click="getLink(item._id)"
                >mdi-link</v-icon
              >
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-subtitle>{{ link }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>

      <v-data-table
        no-data-text="No files found"
        :headers="headers"
        :items="$root.user.files"
        :items-per-page="10"
        class="elevation-1"
        v-else
      >
        <template v-slot:item.icon="{ item }">
          <v-icon v-if="item.type.includes('image')">mdi-image</v-icon>
          <v-icon v-else-if="item.type.includes('video')">mdi-video</v-icon>
          <v-icon v-else-if="item.type.includes('audio')"
            >mdi-music-note</v-icon
          >
          <v-icon v-else-if="item.type.includes('pdf')">mdi-file-pdf</v-icon>
          <v-icon v-else-if="item.type.includes('workshop')"
            >mdi-file-cloud</v-icon
          >
          <v-icon v-else>mdi-file</v-icon>
        </template>

        <template v-slot:item.action="{ item }">
          <v-icon
            small
            class="light-blue--text mr-2"
            @click="downloadFile(item._id)"
            >mdi-download</v-icon
          >
          <v-icon small class="red--text mr-2" @click="deleteFile(item._id)"
            >mdi-delete</v-icon
          >
          <v-icon
            small
            class="blue-grey--text text--lighten-2 mr-2"
            @click="startRename(item)"
            >mdi-form-textbox</v-icon
          >
          <v-menu offset-y :close-on-content-click="false">
            <template v-slot:activator="{ on }">
              <v-icon
                small
                class="white--text"
                v-on="on"
                @click="getLink(item._id)"
                >mdi-link</v-icon
              >
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

    <v-dialog
      v-model="rename.open"
      max-width="350"
      @click:outside="rename = { open: false }"
    >
      <v-card style="text-align: center">
        <v-card-title class="text-h5 font-weight-medium">RENAME</v-card-title>
        <v-card-text>
          <v-text-field
            hide-details="auto"
            class="mb-1"
            @keypress.enter="renameFile(rename._id)"
            v-model="rename.name"
            label="File name"
          ></v-text-field>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "Drawer",
  data() {
    return {
      headers: [
        { text: "", value: "icon", sortable: false, width: 24 },
        { text: "Name", value: "name" },
        { text: "Type", value: "type" },
        { text: "Size", value: "size" },
        { text: "Uploaded", value: "date", width: 200 },
        { text: "Actions", value: "action", sortable: false, width: 125 },
      ],
      files: null,
      rename: { open: false },
      link: "",
      uploadPercentage: 0,
      uploading: false,
    };
  },
  methods: {
    uploadFile() {
      this.uploading = true;
      let formData = new FormData();
      for (var i = 0; i < this.files.length; i++) {
        let file = this.files[i];
        formData.append(i, file);
      }
      this.$http
        .post(
          `https://www.theparadigmdev.com/api/drawer/${this.$root.user._id}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              this.uploadPercentage = parseInt(
                Math.round((progressEvent.loaded / progressEvent.total) * 100)
              );
            },
            timeout: 0,
          }
        )
        .then((response) => {
          this.$root.user = response.data;
          this.files = null;
          this.uploading = false;
        })
        .catch((error) => {
          console.log("Upload: failed", error);
          this.files = null;
          this.uploading = false;
        });
    },
    downloadFile(id) {
      window.open(
        `https://www.theparadigmdev.com/api/drawer/${this.$root.user._id}/download/${id}`
      );
    },
    deleteFile(id) {
      this.$http
        .delete(
          `https://www.theparadigmdev.com/api/drawer/${this.$root.user._id}/delete/${id}`
        )
        .then((response) => {
          this.$root.user = response.data;
        })
        .catch((error) => {
          console.error("Delete: error", error);
        });
    },
    startRename(item) {
      this.rename = JSON.parse(JSON.stringify(item));
      this.rename.open = true;
    },
    renameFile(id) {
      this.$http
        .post(
          `https://www.theparadigmdev.com/api/drawer/${this.$root.user._id}/rename/${id}`,
          {
            name: this.rename.name,
          }
        )
        .then((response) => {
          this.rename = { open: false };
          this.$root.user = response.data;
        });
    },
    getLink(id) {
      this.link = `https://www.theparadigmdev.com/api/drawer/${this.$root.user._id}/download/${id}`;
    },
  },
};
</script>
