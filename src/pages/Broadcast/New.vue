<template>
  <div>
    <h1 class="display-1 ml-2 mt-2 mb-12">New</h1>

    <v-card max-width="500" class="mx-auto mb-4" color="indigo darken-3">
      <v-card-text class="pb-0">
        <v-textarea
          outlined
          hide-details
          clearable
          rows="3"
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
  </div>
</template>

<script>
export default {
  name: "BroadcastNew",
  data() {
    return {
      new_post: {
        content: "",
        file: null,
      },
      new_file: null,
      uploader: false,
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
        timestamp: Date.now(),
        timestamp_formatted: moment().format("M/D/YYYY [at] h:mm a"),
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
    upload() {
      let reader = new FileReader();
      let that = this;
      reader.onloadend = () => {
        that.new_post.file = {
          uri: reader.result,
          name: that.new_file.name,
          size: that.new_file.size + "B",
          type: that.new_file.type,
        };
        that.uploader = false;
        that.new_file = null;
      };
      reader.readAsDataURL(this.new_file);
    },
  },
};
</script>