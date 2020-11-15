<template>
  <div class="broadcast">
    <v-toolbar dense color="indigo darken-2" style="z-index: 1">
      <v-toolbar-title>Broadcast</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        hide-details="auto"
        style="max-width: 500px"
        color="white"
        class="mt-4"
        label="Search..."
        v-model="search"
      ></v-text-field>
      <v-progress-linear
        :active="loading"
        indeterminate
        absolute
        bottom
        color="indigo darken-4"
      ></v-progress-linear>
    </v-toolbar>

    <div
      :style="{
        height: $vuetify.breakpoint.mdAndUp
          ? 'calc(100vh - 112px)'
          : 'calc(100vh - 104px)',
      }"
      style="overflow-y: auto"
      class="pa-4"
    >
      <v-fade-transition group>
        <v-card
          class="mx-auto mx-4"
          color="indigo darken-3"
          max-width="500"
          key="new"
        >
          <v-card-title class="text-h5 font-weight-medium"
            >NEW POST</v-card-title
          >
          <v-card-text class="text-h5">
            <v-textarea
              outlined
              clearable
              class="pb-0 pt-0"
              auto-grow
              hide-details
              @keypress.shift.enter.exact.prevent="post()"
              :label="_getRandomString"
              background-color="transparent"
              v-model="content"
            ></v-textarea>
            <div class="mt-4" v-for="(file, index) in files" :key="index">
              <img
                v-if="file.type.includes('image')"
                id="img"
                style="max-width: 250px"
                :src="file.uri"
              />
              <video
                controls
                v-else-if="file.type.includes('video')"
                id="video"
                style="max-width: 250px"
                :src="file.uri"
              ></video>
              <v-icon v-else style="font-size: 48px">mdi-file</v-icon>
              <v-btn icon color="red" @click="files.splice(index, 1)"
                ><v-icon>mdi-close</v-icon></v-btn
              >
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn
              icon
              @click="uploader = true"
              color="grey lighten-1"
              :disabled="files.length > 4"
              ><v-icon>mdi-paperclip</v-icon></v-btn
            >
            <v-spacer></v-spacer>
            <v-btn
              text
              color="white"
              :disabled="files.length < 1 && content == ''"
              @click="post()"
              >Post</v-btn
            >
          </v-card-actions>
        </v-card>

        <v-card
          class="mx-auto mt-4 mx-4"
          color="indigo darken-3"
          max-width="500"
          v-for="(post, index) in filteredPosts"
          :key="index"
        >
          <div v-for="(file, i) in post.files" :key="i" v-show="!edit.open">
            <v-img :src="file.uri" v-if="file.type.includes('image')"></v-img>
            <video
              :src="file.uri"
              v-else-if="file.type.includes('video')"
              controls
              style="max-width: 500px"
            ></video>
            <v-btn v-else @click="window.open(file.uri)" text block large
              ><v-icon left>mdi-download</v-icon>{{ file.name }}</v-btn
            >
          </div>

          <v-card-text class="text-h5" v-html="post.content"></v-card-text>

          <v-card-actions>
            <v-row no-gutters align="center" justify="end">
              <v-col>
                <v-list-item class="grow">
                  <v-list-item-avatar color="grey darken-3">
                    <v-img
                      class="elevation-6"
                      loading="lazy"
                      :src="`https://www.theparadigmdev.com/relay/profile-pics/${$root.user._id}.png`"
                    ></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title
                      class="font-weight-medium"
                      :style="{ color: $root.user.color }"
                      >{{ $root.user.username }}</v-list-item-title
                    >
                    <v-list-item-subtitle>{{
                      post.timestamp
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>

              <v-col class="text-right">
                <v-btn
                  icon
                  @click="
                    edit = post;
                    files = edit.files;
                    edit.open = true;
                  "
                  ><v-icon>mdi-pencil</v-icon></v-btn
                >
                <v-btn icon class="mr-2" @click="remove(post._id)"
                  ><v-icon>mdi-delete</v-icon></v-btn
                >
                <v-icon class="mr-1">mdi-heart</v-icon>
                <span class="subheading mr-6">{{ post.likes }}</span>
                <!-- <span class="mr-1">·</span>
                <v-icon class="mr-1 grey--text">mdi-share-variant</v-icon>
                <span class="subheading mr-6 grey--text">{{ post.reposts }}</span> -->
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-fade-transition>
    </div>

    <v-dialog
      v-model="edit.open"
      max-width="500"
      @click:outside="edit = { open: false }"
    >
      <v-card color="indigo darken-3">
        <v-card-title class="text-h5 font-weight-medium"
          >EDIT POST</v-card-title
        >
        <v-card-text>
          <v-textarea
            outlined
            clearable
            class="pb-0 pt-2"
            auto-grow
            hide-details
            :label="_getRandomString"
            background-color="transparent"
            v-model="edit.content"
          ></v-textarea>
          <div class="mt-4" v-if="edit.file_path && !file">
            <img
              v-show="edit.file_type == 'image'"
              id="img"
              :src="`https://www.theparadigmdev.com/relay/broadcast/${$root.user._id}/${edit.file_path}`"
              style="max-width: 250px"
            />
            <video
              controls
              v-show="edit.file_type == 'video'"
              id="video"
              style="max-width: 250px"
            ></video>
            <v-icon v-show="edit.file_type == 'file'" style="font-size: 48px"
              >mdi-file</v-icon
            >
            <v-btn
              icon
              color="red"
              @click="
                edit.file_path = null;
                edit.file_type = null;
              "
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </div>
          <div class="mt-4" v-for="(file, index) in files" :key="index">
            <img
              v-if="file.type.includes('image')"
              id="img"
              style="max-width: 250px"
              :src="file.uri"
            />
            <video
              controls
              v-else-if="file.type.includes('video')"
              id="video"
              style="max-width: 250px"
              :src="file.uri"
            ></video>
            <v-icon v-else style="font-size: 48px">mdi-file</v-icon>
            <v-btn icon color="red" @click="files.splice(index, 1)"
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="red" @click="remove(edit._id), (edit.open = false)"
            >Delete</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn icon @click="uploader = true" color="grey lighten-1"
            ><v-icon>mdi-paperclip</v-icon></v-btn
          >
          <v-btn
            text
            @click="updatePost()"
            :disabled="(edit.content == '', (files = []))"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="uploader" max-width="350">
      <v-card>
        <v-card-title class="text-h5 font-weight-medium"
          >UPLOAD FILE</v-card-title
        >
        <v-card-text
          ><v-file-input
            hide-details="auto"
            prepend-icon=""
            id="file"
            ref="file"
            v-model="file"
            label="Upload..."
          ></v-file-input
        ></v-card-text>
        <v-card-actions>
          <v-btn
            @click="
              uploader = false;
              file = null;
            "
            color="grey darken-1"
            text
            >Cancel</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn @click="previewUpload()" color="blue accent-1" text
            >Upload</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "Broadcast",
  data() {
    return {
      content: "",
      search: "",
      uploader: false,
      file: null,
      image_delete_button: false,
      window,
      edit: {
        open: false,
      },
      loading: false,
      files: [],
    };
  },
  computed: {
    filteredPosts() {
      if (this.$root.user.posts) {
        return this.$root.user.posts.filter((item) => {
          return item.content.toLowerCase().includes(this.search.toLowerCase());
        });
      }
    },
    _getRandomString() {
      const strings = [
        "How goes it?",
        "What's up?",
        "'Sup?",
        "Whatcha up to?",
        "How's it going?",
        "Speak your mind...",
        "What's up buttercup?",
        "What's crackin'?",
        "What's shakin' bacon?",
      ];
      const index = Math.floor(Math.random() * strings.length);
      return strings[index];
    },
  },
  methods: {
    post() {
      this.loading = true;
      let data = {
        content: this.content,
        timestamp: moment().format("MM/DD/YYYY [at] h:mm a"),
        likes: 0,
        reposts: 0,
        files: this.files,
      };
      this.$http
        .post(
          `https://www.theparadigmdev.com/api/broadcast/${this.$root.user._id}/create`,
          data
        )
        .then((response) => {
          this.$root.user.posts = response.data.posts;
          this.content = "";
          this.files = [];
          this.loading = false;
        })
        .catch((error) => console.error(error));
    },
    remove(id) {
      this.$http
        .get(
          `https://www.theparadigmdev.com/api/broadcast/${this.$root.user._id}/delete/${id}`
        )
        .then((response) => (this.$root.user.posts = response.data))
        .catch((error) => console.error(error));
    },
    updatePost() {
      this.loading = true;
      if (this.file) {
        this.edit.file_path = this.file.name;
        if (this.file.type.includes("image")) this.edit.file_type = "image";
        else if (this.file.type.includes("video"))
          this.edit.file_type = "video";
        else this.edit.file_type = "file";
      }
      this.$http
        .put(
          `https://www.theparadigmdev.com/api/broadcast/${this.$root.user._id}/${this.edit._id}`,
          this.edit
        )
        .then((response) => {
          this.loading = false;
          if (this.file) {
            this.loading = true;
            let formData = new FormData();
            formData.append("file", this.file);
            this.$http
              .post(
                `https://www.theparadigmdev.com/api/broadcast/${this.$root.user._id}/file/${response.data.post_id}`,
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              )
              .then((response) => {
                this.file = null;
                this.loading = false;
              });
          }
          this.$root.user.posts = response.data.posts;
          this.edit = { open: false };
        })
        .catch((error) => console.error(error));
    },
    previewUpload() {
      // this.edit.file_type = null;
      // this.edit.file_path = null;
      // if (this.file.type.includes("image")) {
      //   this.file_type = "image";
      //   this.edit.file_type = "image";
      //   let imgs = document.querySelectorAll("#img");
      //   for (let i = 0; i < imgs.length; i++) {
      //     imgs[i].src = URL.createObjectURL(this.file);
      //   }
      // } else if (this.file.type.includes("video")) {
      //   this.file_type = "video";
      //   this.edit.file_type = "video";
      //   let videos = document.querySelectorAll("#video");
      //   for (let i = 0; i < imgs.length; i++) {
      //     imgs[i].src = URL.createObjectURL(this.file);
      //   }
      // } else {
      //   this.file_type = "file";
      //   this.edit.file_type = "file";
      // }
      // this.uploader = false;

      var reader = new FileReader();
      let that = this;
      console.log(this.file);
      reader.onloadend = function () {
        let data = {
          uri: reader.result,
          name: that.file.name,
          size: that.file.size + "B",
          type: that.file.type,
        };
        that.files.push(data);
        that.uploader = false;
        that.file = null;
        console.log(that);
      };
      reader.readAsDataURL(this.file);
    },
  },
};
</script>

<style scoped>
</style>