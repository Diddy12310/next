<template>
  <div>
    <h1 class="display-1 ml-2 mt-2 mb-12 font-weight-light">Find</h1>

    <v-text-field
      style="
        margin: 48px auto 18px auto;
        max-width: 700px;
        padding: 0px 8px 0px 8px;
      "
      class="text-h5"
      solo
      label="Search..."
      v-model="query"
      @keyup.enter="search()"
    ></v-text-field>

    <p
      v-if="!query && results.length < 1"
      class="grey--text font-italic font-weight-light text-center"
    >
      Enter a query for results to appear.
    </p>

    <p
      v-if="query && results.length < 1"
      class="grey--text font-italic font-weight-light text-center"
    >
      No results.
    </p>

    <div v-for="(result, index) in results" :key="index">
      <v-card
        max-width="500"
        class="mx-auto mb-4"
        color="indigo darken-3"
        v-if="result.type == 'post'"
      >
        <div v-if="result.data.file">
          <v-img
            :src="result.data.file.uri"
            v-if="result.data.file.type.includes('image')"
          ></v-img>
          <video
            :src="result.data.file.uri"
            v-else-if="result.data.file.type.includes('video')"
            controls
            style="max-width: 500px"
          ></video>
          <v-btn
            v-else
            @click="window.open(result.data.file.uri)"
            text
            block
            large
            ><v-icon left>mdi-download</v-icon
            >{{ result.data.file.name }}</v-btn
          >
        </div>

        <v-card-text class="pb-0">
          <h5 class="text-h5" v-html="result.data.content"></h5>
        </v-card-text>

        <v-card-actions>
          <v-row no-gutters align="center" justify="end">
            <v-col>
              <v-list-item class="grow pl-2">
                <v-list-item-avatar color="grey darken-3">
                  <v-img
                    class="elevation-6"
                    loading="lazy"
                    :src="`https://www.theparadigmdev.com/relay/profile-pics/${result.data.uid}.png`"
                  ></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title
                    class="font-weight-medium"
                    :style="{ color: result.data.color }"
                    >{{ result.data.username }}</v-list-item-title
                  >
                  <v-list-item-subtitle>{{
                    result.data.timestamp_formatted
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>

            <v-col class="text-right">
              <span class="subheading mr-1">{{ result.data.likes }}</span>
              <v-btn
                @click="
                  $root.user.people.approved
                    .find((person) => person._id == result.data.uid)
                    .liked_posts.includes(result.data._id)
                    ? unLikePost(result.data._id, result.data.uid)
                    : likePost(result.data._id, result.data.uid)
                "
                :input-value="
                  $root.user.people.approved
                    .find((person) => person._id == result.data.uid)
                    .liked_posts.includes(result.data._id)
                "
                icon
                class="mr-3"
              >
                <v-icon>{{
                  $root.user.people.approved
                    .find((person) => person._id == result.data.uid)
                    .liked_posts.includes(result.data._id)
                    ? "mdi-heart"
                    : "mdi-heart-outline"
                }}</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>

      <v-card
        class="mx-auto mb-4"
        v-if="result.type == 'user'"
        max-width="500"
        @click="$router.push(`/broadcast/profile/${result.data.username}`)"
      >
        <v-list-item>
          <v-badge
            style="position: relative; left: -15px"
            bordered
            bottom
            dot
            :offset-x="25"
            offset-y="17"
            color="green"
            :value="result.data.in"
          >
            <v-list-item-avatar>
              <v-img
                :src="`https://www.theparadigmdev.com/relay/profile-pics/${result.data._id}.png`"
              >
              </v-img>
            </v-list-item-avatar>
          </v-badge>
          <v-list-item-content>
            <v-list-item-title
              :style="{ color: result.data.color }"
              class="font-weight-medium"
              >{{ result.data.username }}</v-list-item-title
            >
            <v-list-item-subtitle
              v-html="result.data.bio"
            ></v-list-item-subtitle>
          </v-list-item-content>
          <v-icon>mdi-chevron-right</v-icon>
        </v-list-item>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "BroadcastFind",
  data() {
    return {
      query: "",

      feed: [],
      people: [],
    };
  },
  computed: {
    results() {
      let results = [];

      if (this.query) {
        for (let person of this.people) {
          if (
            person.username.toLowerCase().includes(this.query.toLowerCase()) &&
            person._id !== this.$root.user._id
          ) {
            results.push({
              type: "user",
              data: person,
            });
          }
        }

        for (let post of this.feed) {
          if (post.content.toLowerCase().includes(this.query.toLowerCase())) {
            results.push({
              type: "post",
              data: post,
            });
          }

          if (post.username.toLowerCase().includes(this.query.toLowerCase())) {
            results.push({
              type: "post",
              data: post,
            });
          }
        }
      }

      return results;
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
  },
  created() {
    this.get();
  },
};
</script>