<template>
  <div style="overflow: auto; height: calc(100vh - 64px)">
    <v-toolbar dense color="teal darken-2">
      <v-toolbar-title>Drawer</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="newFolder()"><v-icon>mdi-folder-plus</v-icon></v-btn>
    </v-toolbar>
    <v-container>
      <p>
        <v-btn
          x-small
          icon
          color="grey"
          @click="cd(resolvePath(split_path.length - 2))"
          :disabled="
            current_path == '/' ||
            current_path == `/mnt/drawer/${$root.user._id}`
          "
          ><v-icon>mdi-chevron-left</v-icon></v-btn
        >
        <span
          @click="cd(resolvePath(index))"
          style="cursor: pointer"
          class="subtitle-2 font-weight-regular grey--text"
          v-for="(item, index) in split_path"
          :key="index"
        >
          / {{ item }}</span
        >
      </p>

      <v-simple-table
        fixed-header
        height="calc(100vh - 180px)"
        style="background: transparent"
        v-if="current.length > 0"
      >
        <template v-slot:default>
          <thead>
            <tr>
              <th
                class="text-left"
                style="width: 56px; background: #1a1a1a !important"
              ></th>
              <th class="text-left" style="background: #1a1a1a !important">
                Name
              </th>
              <th
                class="text-left"
                style="width: 200px; background: #1a1a1a !important"
              >
                Type
              </th>
              <th
                class="text-left"
                style="width: 200px; background: #1a1a1a !important"
              >
                Size
              </th>
              <th
                class="text-left"
                style="width: 200px; background: #1a1a1a !important"
              >
                Modified
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              style="cursor: pointer"
              v-for="item in current"
              :key="item._id"
              @contextmenu="showActionMenu($event), (action_menu_item = item)"
              @click="item.dir ? cd(item.path) : downloadFile(item)"
            >
              <td style="width: 56px">
                <v-icon v-if="item.dir">mdi-folder-open</v-icon>
                <v-icon v-else-if="item.type.includes('image')"
                  >mdi-image</v-icon
                >
                <v-icon v-else-if="item.type.includes('video')"
                  >mdi-video</v-icon
                >
                <v-icon v-else-if="item.type.includes('audio')"
                  >mdi-music-note</v-icon
                >
                <v-icon v-else-if="item.type.includes('pdf')"
                  >mdi-file-pdf</v-icon
                >
                <v-icon v-else-if="item.type.includes('workshop')"
                  >mdi-file-cloud</v-icon
                >
                <v-icon v-else>mdi-file</v-icon>
              </td>
              <td>
                {{
                  item.dir
                    ? item.name
                    : $root.user.preferences.drawer.show_file_types
                    ? item.name
                    : item.name.substring(0, item.name.lastIndexOf("."))
                }}
              </td>
              <td style="width: 200px">
                {{ item.dir ? "folder" : item.type }}
              </td>
              <td style="width: 200px">
                {{ item.size == "0 B" ? "" : item.size }}
              </td>
              <td style="width: 200px">{{ item.modified }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <div v-else class="text-center pt-2">
        <v-img
          height="125"
          width="125"
          src="../assets/img/empty_folder.png"
          class="ma-auto mb-5"
        ></v-img>
        <h4 class="text-h4 mb-5">There are no files in this folder</h4>
        <v-btn color="teal darken-3" @click="uploader = true"
          >Upload File</v-btn
        >
      </div>
    </v-container>

    <v-menu
      v-if="action_menu_item"
      v-model="action_menu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
    >
      <v-list dense>
        <v-list-item @click="deleteFile(action_menu_item.path)">
          <v-list-item-icon
            ><v-icon class="red--text">mdi-delete</v-icon></v-list-item-icon
          >
          <v-list-item-title class="red--text">Delete</v-list-item-title>
        </v-list-item>

        <v-list-item @click="startRename(action_menu_item)">
          <v-list-item-icon
            ><v-icon class="grey--text"
              >mdi-form-textbox</v-icon
            ></v-list-item-icon
          >
          <v-list-item-title class="grey--text">Rename</v-list-item-title>
        </v-list-item>

        <v-list-item
          v-if="!action_menu_item.dir"
          @click="getLink(action_menu_item.path)"
        >
          <v-list-item-icon
            ><v-icon class="blue--text"
              >mdi-link-variant</v-icon
            ></v-list-item-icon
          >
          <v-list-item-title class="blue--text">Copy link</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu
      v-if="settings_menu"
      v-model="settings_menu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
    >
      <v-list dense>
        <v-list-item @click="signOut()">
          <v-list-item-avatar
            ><v-img
              :src="`https://www.theparadigmdev.com/relay/profile-pics/${$root.user._id}.png`"
            ></v-img
          ></v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
              class="font-weight-medium"
              :style="{ color: $root.user.color }"
              >{{ $root.user.username }}</v-list-item-title
            >
            <v-list-item-subtitle>Click to sign out</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          @click="
            ($root.user.preferences.drawer.show_file_types =
              !$root.user.preferences.drawer.show_file_types),
              updatePrefs()
          "
        >
          <v-list-item-icon
            ><v-icon>{{
              $root.user.preferences.drawer.show_file_types
                ? "mdi-checkbox-marked"
                : "mdi-checkbox-blank-outline"
            }}</v-icon></v-list-item-icon
          >
          <v-list-item-title>Show file extensions</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

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

    <v-dialog v-model="uploader" max-width="350" :persistent="uploading">
      <v-card style="text-align: center">
        <v-card-title class="text-h5 font-weight-medium"
          >UPLOAD FILE
          <v-spacer></v-spacer>
          <v-btn
            color="grey darken-1"
            @click="(files = null), (uploader = false)"
            icon
            class="mr-n2"
            :disabled="uploading"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-card-title>

        <v-card-text>
          <v-file-input
            :disabled="uploading"
            style="max-width: 500px"
            color="teal darken-2"
            prepend-icon=""
            hide-details
            id="file"
            ref="file"
            v-model="file"
            label="Upload..."
          ></v-file-input>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="teal darken-2" @click="uploadFile()">Upload</v-btn>
        </v-card-actions>

        <v-progress-linear
          color="teal darken-2"
          v-show="uploading"
          :value="uploadPercentage"
        ></v-progress-linear>
      </v-card>
    </v-dialog>

    <v-btn
      v-if="current.length > 0"
      fab
      fixed
      bottom
      right
      color="teal darken-3"
      @click="uploader = true"
      ><v-icon>mdi-plus</v-icon></v-btn
    >
  </div>
</template>

<script>
import generateObjectId from "../helpers/generateObjectId";

export default {
  name: "Drawer",
  data: () => ({
    file: null,
    rename: { open: false },
    uploader: false,
    uploadPercentage: 0,
    uploading: false,
    current: [],
    current_path: "/",

    action_menu_item: null,
    action_menu: false,
    settings_menu: false,
    x: 0,
    y: 0,
  }),
  computed: {
    split_path() {
      let array = this.current_path.split("/");
      array.shift();
      array.shift();
      array.shift();
      array[0] = this.$root.user.username;
      return array;
    },
  },
  async created() {
    let interval;
    let that = this;
    async function loadFiles() {
      clearInterval(interval);
      if (!that.$root.user.preferences) {
        that.$root.user.preferences = {
          drawer: {
            show_file_types: false,
          },
        };
        that.updatePrefs();
      } else if (!that.$root.user.preferences.drawer) {
        that.$root.user.preferences.drawer = {
          show_file_types: false,
        };
      }
      const stats = await that.$http.get(
        `https://www.theparadigmdev.com/api/drawer/${
          that.$root.user._id
        }/${encodeURIComponent(`/mnt/drawer/${that.$root.user._id}`)}`
      );
      that.current = stats.data.files;
    }

    if (this.$root.user) {
      loadFiles();
    } else {
      interval = setInterval(() => {
        loadFiles();
      }, 500);
    }
  },
  methods: {
    updatePrefs() {
      this.$http
        .post("https://www.theparadigmdev.com/api/users/update", {
          old: this.$root.user.username,
          preferences: this.$root.user.preferences,
        })
        .then((response) => {
          this.$root.user = response.data;
        })
        .catch((error) => console.error(error));
    },

    showActionMenu(e) {
      e.preventDefault();
      this.x = e.clientX;
      this.y = e.clientY;
      this.$nextTick(() => {
        this.action_menu = true;
      });
    },
    showSettingsMenu(e) {
      e.preventDefault();
      this.x = e.clientX;
      this.y = e.clientY;
      this.$nextTick(() => {
        this.settings_menu = true;
      });
    },

    async cd(target) {
      const data = await this.$http.get(
        `https://www.theparadigmdev.com/api/drawer/${
          this.$root.user._id
        }/${encodeURIComponent(target)}`
      );

      if (target == this.$root.username) {
        this.current = data.data.files;
        this.current_path = "/";
      } else {
        this.current = data.data.files;
        this.current_path = target;
      }
    },
    resolvePath(index) {
      let path = `/mnt/drawer/${this.$root.user._id}`;
      for (let i = 1; i <= index; i++) {
        path += `/${this.split_path[i]}`;
      }
      return path;
    },
    newFolder() {
      const path =
        this.current_path == "/"
          ? `/mnt/drawer/${this.$root.user._id}`
          : this.current_path;
      this.$http
        .put(
          `https://www.theparadigmdev.com/api/drawer/${
            this.$root.user._id
          }/${encodeURIComponent(path)}`
        )
        .then((response) => {
          if (response.data.error)
            this.$notify(
              response.data.error,
              "red--text",
              "mdi-folder-open",
              3000
            );
          else this.current = response.data.files;
          this.uploader = false;
        });
    },
    uploadFile() {
      this.uploading = true;
      let reader = new FileReader();
      let that = this;
      reader.onloadend = () => {
        const chunkSize = 1000000;
        const sessionID = generateObjectId();
        let start = 0;
        let count = 0;
        let file_name = that.file.name;
        const final = reader.result.substring(reader.result.indexOf(",") + 1);
        let uploadChunk = () => {
          that.$http
            .post(
              `https://www.theparadigmdev.com/api/drawer/${
                that.$root.user._id
              }/${encodeURIComponent(
                that.current_path == "/"
                  ? `/mnt/drawer/${that.$root.user._id}`
                  : that.current_path
              )}`,
              {
                base64: final.slice(
                  start,
                  start + chunkSize > reader.result.length
                    ? reader.result.length
                    : start + chunkSize
                ),
                name: file_name,
                session: sessionID,
                final: start + chunkSize > reader.result.length ? true : false,
              }
            )
            .then((response) => {
              count++;
              const total = reader.result.length / chunkSize;
              that.uploadPercentage = (count / total) * 100;
              start + chunkSize > reader.result.length
                ? (start = reader.result.length)
                : (start += chunkSize);
              if (start < reader.result.length) uploadChunk();
              else {
                that.current = response.data.files;
                that.file = null;
                that.uploading = false;
                that.uploader = false;
              }
            })
            .catch((error) => {
              console.log("Upload: failed", error);
              that.file = null;
              that.uploading = false;
              that.uploader = false;
              that.uploadPercentage = 0;
            });
        };
        uploadChunk();

        // that.new_post.file = {
        //   uri: reader.result,
        //   name: that.new_file.name,
        //   size: that.new_file.size + "B",
        //   type: that.new_file.type,
        // };
        // that.uploader = false;
        // that.new_file = null;
      };
      reader.readAsDataURL(this.file);
    },
    downloadFile(item) {
      window.open(
        `https://www.theparadigmdev.com/api/drawer/${
          this.$root.user._id
        }/download/${encodeURIComponent(item.path)}`
      );
    },
    deleteFile(path) {
      this.$http
        .delete(
          `https://www.theparadigmdev.com/api/drawer/${
            this.$root.user._id
          }/${encodeURIComponent(path)}`
        )
        .then((response) => {
          this.current = response.data.files;
        })
        .catch((error) => {
          console.error("Delete: error", error);
        });
    },
    startRename(item) {
      this.rename = JSON.parse(JSON.stringify(item));
      this.rename.open = true;
    },
    renameFile() {
      this.$http
        .post(
          `https://www.theparadigmdev.com/api/drawer/${this.$root.user._id}/rename`,
          {
            old: this.rename.path,
            new:
              this.rename.path.substring(
                0,
                this.rename.path.lastIndexOf("/") + 1
              ) + this.rename.name,
          }
        )
        .then((response) => {
          this.rename = { open: false };
          this.current = response.data.files;
        });
    },
    getLink(path) {
      navigator.clipboard.writeText(
        `https://www.theparadigmdev.com/api/drawer/${
          this.$root.user._id
        }/get/${encodeURIComponent(path)}`
      );
    },
  },
};
</script>

<style scoped>
</style>