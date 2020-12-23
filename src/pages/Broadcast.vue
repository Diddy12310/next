<template>
  <div>
    <v-toolbar dense color="indigo darken-2" style="z-index: 1">
      <v-toolbar-title>Broadcast</v-toolbar-title>
      <v-progress-linear
        :active="loading"
        indeterminate
        absolute
        bottom
        color="indigo darken-4"
      ></v-progress-linear>
    </v-toolbar>

    <main
      :style="{
        height: $vuetify.breakpoint.mdAndUp
          ? 'calc(100vh - 112px)'
          : 'calc(100vh - 104px)',
      }"
      style="overflow-y: auto"
      class="pa-4"
    >
      <v-card max-width="500" class="mx-auto mb-4" color="indigo darken-3">
        <v-card-title class="text-h5 font-weight-medium">NEW POST</v-card-title>

        <v-card-text class="pb-0">
          <v-textarea
            outlined
            hide-details
            clearable
            auto-grow
            :label="_getRandomString"
            v-model="new_post.content"
          ></v-textarea>
          <div class="mt-4" v-if="new_post.file">
            <img
              v-if="new_post.file.type.includes('image')"
              id="img"
              style="max-width: 250px"
              :src="new_post.file.uri"
            />
            <video
              controls
              v-else-if="new_post.file.type.includes('video')"
              id="video"
              style="max-width: 250px"
              :src="new_post.file.uri"
            ></video>
            <v-icon v-else style="font-size: 48px">mdi-file</v-icon>
            <v-btn icon color="red" @click="new_post.file = null"
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </div>
        </v-card-text>

        <v-card-actions>
          <v-btn
            :disabled="new_post.file ? true : false"
            icon
            @click="uploader = true"
            color="grey lighten-1"
            ><v-icon>mdi-paperclip</v-icon></v-btn
          >
          <v-spacer></v-spacer>
          <v-btn text @click="post()">Post</v-btn>
        </v-card-actions>
      </v-card>

      <v-card
        max-width="500"
        class="mx-auto mb-4"
        color="indigo darken-3"
        v-for="(post, index) in $root.user.posts"
        :key="index"
      >
        <div v-if="post.file">
          <v-img
            :src="post.file.uri"
            v-if="post.file.type.includes('image')"
          ></v-img>
          <video
            :src="post.file.uri"
            v-else-if="post.file.type.includes('video')"
            controls
            style="max-width: 500px"
          ></video>
          <v-btn v-else @click="window.open(post.file.uri)" text block large
            ><v-icon left>mdi-download</v-icon>{{ post.file.name }}</v-btn
          >
        </div>

        <v-card-text class="pb-0">
          <h5 class="text-h5" v-html="post.content"></h5>
        </v-card-text>

        <v-card-actions>
          <v-row no-gutters align="center" justify="end">
            <v-col>
              <v-list-item class="grow pl-2">
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
                color="grey"
                @click="
                  edit_post = post;
                  edit_post_index = index;
                  edit_post.open = true;
                "
                ><v-icon>mdi-pencil</v-icon></v-btn
              >
              <v-btn
                icon
                color="grey"
                class="mr-2"
                @click="remove(post._id, index)"
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
    </main>

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
            v-model="new_file"
            label="Upload..."
          ></v-file-input
        ></v-card-text>
        <v-card-actions>
          <v-btn
            @click="
              uploader = false;
              new_file = null;
            "
            color="grey darken-1"
            text
            >Cancel</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn @click="upload()" color="blue accent-1" text>Upload</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="edit_post.open"
      max-width="500"
      @click:outside="edit_post = { open: false }"
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
            v-model="edit_post.content"
          ></v-textarea>
          <div class="mt-4" v-if="edit_post.file">
            <img
              v-if="edit_post.file.type.includes('image')"
              id="img"
              style="max-width: 250px"
              :src="edit_post.file.uri"
            />
            <video
              controls
              v-else-if="edit_post.file.type.includes('video')"
              id="video"
              style="max-width: 250px"
              :src="edit_post.file.uri"
            ></video>
            <v-icon v-else style="font-size: 48px">mdi-file</v-icon>
            <v-btn icon color="red" @click="edit_post.file = null"
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            color="red"
            @click="
              remove(edit_post._id, edit_post_index),
                (edit_post = { open: false })
            "
            >Delete</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn icon @click="uploader = true" color="grey lighten-1"
            ><v-icon>mdi-paperclip</v-icon></v-btn
          >
          <v-btn
            text
            @click="update()"
            :disabled="edit_post.content == '' && edit_post.file == null"
            >Save</v-btn
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
      new_post: {
        content: "",
        file: null,
      },
      edit_post: {
        content: "",
        file: null,
        open: false,
      },
      edit_post_index: null,
      new_file: null,
      uploader: false,
      loading: false,

      window,
    };
  },
  computed: {
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
      let data = {
        content: this.new_post.content,
        timestamp: moment().format("MM/DD/YYYY [at] h:mm a"),
        likes: 0,
        reposts: 0,
        file: this.new_post.file,
      };
      this.$root.user.posts.unshift(data);
      this.$http
        .post(
          `https://www.theparadigmdev.com/api/broadcast/${this.$root.user._id}/create`,
          data
        )
        .then((response) => {
          this.new_post.content = "";
          this.new_post.file = null;
        })
        .catch((error) => console.error(error));
    },
    remove(id, index) {
      this.$root.user.posts.splice(index, 1);
      this.$http
        .get(
          `https://www.theparadigmdev.com/api/broadcast/${this.$root.user._id}/delete/${id}`
        )
        .then((response) => {})
        .catch((error) => console.error(error));
    },
    update() {
      this.$root.user.posts[this.edit_post_index] = this.edit_post;
      this.$http
        .put(
          `https://www.theparadigmdev.com/api/broadcast/${this.$root.user._id}/${this.edit_post._id}`,
          this.edit_post
        )
        .then((response) => {
          this.edit_post = { open: false };
        })
        .catch((error) => console.error(error));
    },
    upload() {
      let reader = new FileReader();
      let that = this;
      reader.onloadend = () => {
        if (that.edit_post.open) {
          that.edit_post.file = {
            uri: reader.result,
            name: that.new_file.name,
            size: that.new_file.size + "B",
            type: that.new_file.type,
          };
        } else {
          that.new_post.file = {
            uri: reader.result,
            name: that.new_file.name,
            size: that.new_file.size + "B",
            type: that.new_file.type,
          };
        }
        that.uploader = false;
        that.new_file = null;
      };
      reader.readAsDataURL(this.new_file);
    },
  },
};
</script>

<style scoped>
</style>