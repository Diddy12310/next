<template>
  <div>
    <h1 class="display-1 ml-2 mt-2 mb-12">
      <v-list-item class="px-0 my-n3">
        <v-list-item-avatar
          ><v-img
            :src="`https://www.theparadigmdev.com/relay/profile-pics/${profile._id}.png`"
          ></v-img
        ></v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title :style="{ color: profile.color }">{{
            profile.username
          }}</v-list-item-title>
          <v-list-item-subtitle v-html="profile.bio"></v-list-item-subtitle>
        </v-list-item-content>

        <div v-if="profile._id != $root.user._id">
          <v-tooltip bottom v-if="is_sent">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon disabled class="mb-2" v-on="on" v-bind="attrs"
                ><v-icon>mdi-account-arrow-right</v-icon></v-btn
              >
            </template>
            <span>Pending...</span>
          </v-tooltip>

          <v-tooltip bottom v-if="is_approved">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-on="on"
                v-bind="attrs"
                @click="removeFriend()"
                icon
                class="mb-2"
                color="blue"
                ><v-icon>mdi-account-minus</v-icon></v-btn
              >
            </template>
            <span>Remove</span>
          </v-tooltip>

          <v-tooltip bottom v-if="is_approved">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-on="on"
                v-bind="attrs"
                @click="
                  ($root.url = ['', 'wire', 'dm', profile.username]),
                    ($root.router = 'Wire')
                "
                icon
                class="mb-2"
                color="grey"
                ><v-icon>mdi-message</v-icon></v-btn
              >
            </template>
            <span>Chat</span>
          </v-tooltip>

          <v-tooltip bottom v-if="!is_blocked && !is_sent && !is_approved">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-on="on"
                v-bind="attrs"
                @click="addFriend()"
                icon
                class="mb-2"
                color="blue"
                ><v-icon>mdi-account-plus</v-icon></v-btn
              >
            </template>
            <span>Add</span>
          </v-tooltip>

          <v-tooltip bottom v-if="!is_blocked && !is_sent && !is_approved">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-on="on"
                v-bind="attrs"
                @click="block_confirmer = true"
                icon
                class="mb-2"
                color="red"
                ><v-icon>mdi-account-cancel</v-icon></v-btn
              >
            </template>
            <span>Block</span>
          </v-tooltip>
        </div>
      </v-list-item>
    </h1>
    <v-card
      max-width="500"
      class="mx-auto mb-4"
      color="indigo darken-3"
      v-for="(post, index) in profile.posts"
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
                  :src="`https://www.theparadigmdev.com/relay/profile-pics/${profile._id}.png`"
                ></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title
                  class="font-weight-medium"
                  :style="{ color: profile.color }"
                  >{{ profile.username }}</v-list-item-title
                >
                <v-list-item-subtitle>{{
                  post.timestamp_formatted
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>

          <v-col class="text-right">
            <v-btn
              v-if="profile._id == $root.user._id || $root.user.rights.admin"
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
              v-if="profile._id == $root.user._id || $root.user.rights.admin"
              icon
              color="grey"
              class="mr-2"
              @click="remove(post._id, index)"
              ><v-icon>mdi-delete</v-icon></v-btn
            >
            <span class="subheading mr-2">{{ post.likes }}</span>
            <v-btn
              v-if="profile._id != $root.user._id && is_approved"
              @click="
                $root.user.people.approved
                  .find((person) => person._id == profile._id)
                  .liked_posts.includes(post._id)
                  ? unLikePost(post._id, index)
                  : likePost(post._id, index)
              "
              :input-value="
                $root.user.people.approved
                  .find((person) => person._id == profile._id)
                  .liked_posts.includes(post._id)
              "
              icon
              class="mr-3"
            >
              <v-icon>{{
                $root.user.people.approved
                  .find((person) => person._id == profile._id)
                  .liked_posts.includes(post._id)
                  ? "mdi-heart"
                  : "mdi-heart-outline"
              }}</v-icon>
            </v-btn>

            <v-icon v-else class="mr-4">mdi-heart</v-icon>
          </v-col>
        </v-row>
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

    <v-dialog max-width="350" v-model="block_confirmer">
      <v-card color="orange">
        <v-card-title class="text-h5 font-weight-medium">CONFIRM</v-card-title>
        <v-card-text>
          If you block {{ $root.profile.username }}, you won't see any of their
          Broadcasts nor be able to DM them. But, you will still see their posts
          in a chatroom.
        </v-card-text>
        <v-card-actions>
          <v-btn text color="grey darken-1" @click="block_confirmer = false"
            >Cancel</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn text @click="blockPerson()">Confirm</v-btn>
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
  name: "BroadcastProfile",
  props: ["profile"],
  data() {
    return {
      edit_post: {
        content: "",
        file: null,
        open: false,
      },
      edit_post_index: null,

      uploader: false,
      new_file: null,
      block_confirmer: false,
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

    is_approved() {
      var is = false;
      this.$root.user.people.approved.forEach((person) => {
        if (this.profile._id === person._id) {
          is = true;
        }
      });
      return is;
    },
    is_sent() {
      var is = false;
      this.$root.user.people.sent.forEach((person) => {
        if (this.profile._id === person._id) is = true;
        this.profile_index = null;
      });
      return is;
    },
    is_blocked() {
      var is = false;
      this.$root.user.people.blocked.forEach((person) => {
        if (this.profile._id === person._id) is = true;
        this.profile_index = null;
      });
      return is;
    },
  },
  methods: {
    addFriend() {
      this.$root.user.people.sent.push({
        liked_posts: [],
        _id: this.profile._id,
        username: this.profile.username,
        color: this.profile.color,
        dm: "",
      });

      this.$http.get(
        `https://www.theparadigmdev.com/api/users/${this.$root.user._id}/people/send/${this.profile._id}`
      );
    },
    removeFriend() {
      const i = this.$root.user.people.approved.findIndex(
        (person) => person._id == this.profile._id
      );
      this.$root.user.people.approved.splice(i, 1);

      this.$http
        .get(
          `https://www.theparadigmdev.com/api/users/${this.$root.user._id}/people/remove/${this.profile._id}`
        )
        .then((response) => {
          this.$root.user = response.data.user;
          this.profile = response.data.profile;
        })
        .catch((error) => console.error(error));
    },
    blockPerson() {
      this.$root.user.people.blocked.push({
        liked_posts: [],
        _id: this.profile._id,
        username: this.profile.username,
        color: this.profile.color,
        dm: "",
      });

      this.$http
        .get(
          `https://www.theparadigmdev.com/api/users/${this.$root.user._id}/people/block/${this.profile._id}`
        )
        .then((response) => {
          this.$root.user = response.data;
          this.profile = false;
          this.$emit("go", "feed");
          this.block_confirmer = false;
        })
        .catch((error) => console.error(error));
    },

    likePost(id, index) {
      this.loading = true;
      this.profile.posts[index].likes++;
      this.$http
        .get(
          `https://www.theparadigmdev.com/api/broadcast/${this.$root.user._id}/like/${this.profile._id}/${id}`
        )
        .then((response) => {
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          console.error(error);
        });
    },
    unLikePost(id, index) {
      this.loading = true;
      this.profile.posts[index].likes--;
      this.$http
        .get(
          `https://www.theparadigmdev.com/api/broadcast/${this.$root.user._id}/unlike/${this.profile._id}/${id}`
        )
        .then((response) => {
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          console.error(error);
        });
    },

    remove(id, index) {
      this.profile.posts.splice(index, 1);
      this.$http
        .get(
          `https://www.theparadigmdev.com/api/broadcast/${this.profile._id}/delete/${id}`
        )
        .then((response) => {})
        .catch((error) => console.error(error));
    },
    update() {
      this.profile.posts[this.edit_post_index] = this.edit_post;
      this.$http
        .put(
          `https://www.theparadigmdev.com/api/broadcast/${this.profile._id}/${this.edit_post._id}`,
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
  },
  created() {
    this.$emit("get");
  },
};
</script>