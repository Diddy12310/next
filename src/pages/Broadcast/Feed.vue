<template>
  <div>
    <h1 class="display-1 ml-2 mt-2 mb-12">Feed</h1>

    <v-card
      max-width="500"
      class="mx-auto mb-4"
      color="indigo darken-3"
      v-for="(post, index) in feed"
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
              <v-list-item-avatar
                color="grey darken-3"
                @click="
                  $emit(
                    'person',
                    people.find((person) => person._id == post.uid)
                  )
                "
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
            </v-list-item>
          </v-col>

          <v-col class="text-right">
            <!-- <v-btn
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
              > -->
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
              class="mr-3"
            >
              <v-icon>{{
                $root.user.people.approved
                  .find((person) => person._id == post.uid)
                  .liked_posts.includes(post._id)
                  ? "mdi-heart"
                  : "mdi-heart-outline"
              }}</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "BroadcastFeed",
  props: ["feed", "people"],
  methods: {
    likePost(id, uid) {
      this.loading = true;
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
    this.$emit("get");
  },
};
</script>