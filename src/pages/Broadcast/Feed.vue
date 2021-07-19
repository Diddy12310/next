<template>
  <div>
    <h1 class="display-1 ml-2 mt-2 mb-12 font-weight-light">Feed</h1>

    <div class="text-center" v-if="feed.length < 1">
      <v-img
        class="ma-auto mb-5"
        src="../../assets/img/search.png"
        height="125"
        width="125"
      ></v-img>
      <h4 class="text-h4 mb-2">Your feed is empty</h4>
      <p class="grey--text" v-if="$root.user.people.approved.length < 1">
        You should add some friends! Click the Find button on the left.
      </p>
      <p class="grey--text" v-else>Your friends haven't posted anything yet.</p>
    </div>

    <v-card
      max-width="500"
      class="mx-auto mb-4"
      color="indigo darken-3"
      v-for="(post, index) in feed"
      :key="index"
      @mouseenter="hover = index"
      @mouseleave="hover = -1"
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
        <v-list-item class="grow pl-2">
          <v-list-item-avatar
            color="grey darken-3"
            @click="$router.push(`/broadcast/profile/${post.username}`)"
            style="cursor: pointer"
          >
            <v-img
              class="elevation-6"
              loading="lazy"
              :src="`https://www.theparadigmdev.com/relay/profile-pics/${post.uid}.png`"
            ></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title
              class="font-weight-medium"
              :style="{ color: post.color }"
              >{{ post.username }}</v-list-item-title
            >
            <v-list-item-subtitle>{{
              post.timestamp_formatted
            }}</v-list-item-subtitle>
          </v-list-item-content>
          <div v-if="$root.user.rights.admin && hover == index">
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
            <v-btn icon color="grey" class="mr-2" @click="remove(post, index)"
              ><v-icon>mdi-delete</v-icon></v-btn
            >
          </div>
          <span class="subheading mr-1">{{ post.likes }}</span>
          <v-btn
            @click="
              $root.user.people.approved
                .find((person) => person._id == post.uid)
                .liked_posts.includes(post._id)
                ? unLikePost(post._id, post.uid)
                : likePost(post._id, post.uid)
            "
            :input-value="
              $root.user.people.approved
                .find((person) => person._id == post.uid)
                .liked_posts.includes(post._id)
            "
            icon
          >
            <v-icon>{{
              $root.user.people.approved
                .find((person) => person._id == post.uid)
                .liked_posts.includes(post._id)
                ? "mdi-heart"
                : "mdi-heart-outline"
            }}</v-icon>
          </v-btn>
        </v-list-item>
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
export default {
  name: "BroadcastFeed",
  data() {
    return {
      feed: [],
      people: [],

      edit_post: {
        content: "",
        file: null,
        open: false,
      },
      edit_post_index: null,
      uploader: false,
      new_file: null,
      hover: -1,
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
    get() {
      this.$http
        .get(`/api/broadcast/${this.$root.user._id}`)
        .then((response) => {
          this.feed = response.data;
          this.$http
            .get("/api/users/list")
            .then((response) => {
              this.people = response.data;
              if (this.profile)
                this.profile = response.data.find(
                  (person) => person._id == this.profile._id
                );
              this.loading = false;
            })
            .catch((error) => {
              console.error(error);
              this.loading = false;
            });
        })
        .catch((error) => {
          console.error(error);
          this.loading = false;
        });
    },

    remove(post, index) {
      this.feed.splice(index, 1);
      this.$http
        .get(
          `https://www.theparadigmdev.com/api/broadcast/${post.uid}/delete/${post._id}`
        )
        .then((response) => {})
        .catch((error) => console.error(error));
    },
    update() {
      this.feed[this.edit_post_index] = this.edit_post;
      this.$http
        .put(
          `https://www.theparadigmdev.com/api/broadcast/${
            this.feed[this.edit_post_index].uid
          }/${this.edit_post._id}`,
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
        that.edit_post.file = {
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

    likePost(id, uid) {
      this.loading = true;
      this.feed.find((post) => post._id == id).likes++;
      this.$root.user.people.approved
        .find((person) => person._id == uid)
        .liked_posts.push(id);
      this.$http
        .get(
          `https://www.theparadigmdev.com/api/broadcast/${this.$root.user._id}/like/${uid}/${id}`
        )
        .then((response) => {
          this.loading = false;
          this.$emit("feed", response.data);
        })
        .catch((error) => {
          this.loading = false;
          console.error(error);
        });
    },
    unLikePost(id, uid) {
      this.loading = true;
      this.feed.find((post) => post._id == id).likes--;
      const profile_index = this.$root.user.people.approved.findIndex(
        (person) => person._id == uid
      );
      this.$root.user.people.approved[profile_index].liked_posts.splice(
        this.$root.user.people.approved[profile_index].liked_posts.findIndex(
          (post) => post == id
        ),
        1
      );
      this.$http
        .get(
          `https://www.theparadigmdev.com/api/broadcast/${this.$root.user._id}/unlike/${uid}/${id}`
        )
        .then((response) => {
          this.$emit("feed", response.data);
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          console.error(error);
        });
    },
  },
  created() {
    setTimeout(() => this.get(), 50);
  },
};
</script>