<template>
  <div class="">
    <v-toolbar dense color="#881337" style="z-index: 1">
      <v-toolbar-title>Forum</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-if="$route.path == '/forum'"
        hide-details
        style="max-width: 500px"
        color="white"
        v-model="search"
        label="Search..."
        class="mt-3"
      ></v-text-field>
      <v-btn icon @click="getThreads()"><v-icon>mdi-refresh</v-icon></v-btn>
      <v-progress-linear
        :active="loading"
        indeterminate
        absolute
        bottom
        color="#9F1239"
      ></v-progress-linear>
    </v-toolbar>

    <main
      :style="{
        height: $vuetify.breakpoint.mdAndUp
          ? 'calc(100vh - 112px)'
          : 'calc(100vh - 104px)',
      }"
      v-if="!current"
      style="overflow-y: auto"
      class="pa-4"
    >
      <div style="max-width: 750px; margin: auto">
        <div
          v-if="filteredThreads.length < 1 && !search"
          class="text-center mt-12"
        >
          <v-img
            height="175"
            width="175"
            src="../assets/img/forum.png"
            class="ma-auto mb-3"
          ></v-img>
          <h4 class="text-h4 mb-5">Nobody has posted anything!</h4>
          <v-btn color="#881337" @click="new_thread.open = true"
            >Be the first</v-btn
          >
        </div>

        <div
          v-if="filteredThreads.length < 1 && search"
          class="text-center mt-12"
        >
          <v-img
            height="175"
            width="175"
            src="../assets/img/forum.png"
            class="ma-auto mb-3"
          ></v-img>
          <h4 class="text-h4 mb-5">No results</h4>
          <v-btn color="#881337">New thread</v-btn>
        </div>

        <v-card
          class="pa-4 mb-4"
          style="position: relative"
          v-for="(thread, index) in filteredThreads"
          :key="thread._id"
          @click="getThread(thread._id)"
          @mouseenter="thread_hover = index"
          @mouseleave="thread_hover = -1"
        >
          <div v-if="thread.attachment">
            <v-img
              :src="thread.attachment.uri"
              v-if="thread.attachment.type.includes('image')"
            />
            <video
              :src="thread.attachment.uri"
              v-else-if="thread.attachment.type.includes('video')"
            ></video>
            <audio
              :src="thread.attachment.uri"
              v-else-if="thread.attachment.type.includes('audio')"
            ></audio>
          </div>

          <h1 class="display-1">{{ thread.title }}</h1>
          <div class="d-flex mt-3">
            <v-avatar size="30"
              ><v-img
                :src="`https://www.theparadigm.ga/relay/profile-pics/${thread.user._id}.png`"
              ></v-img
            ></v-avatar>
            <h2 class="subtitle-1 ml-3 grey--text font-weight-light">
              By
              <span
                :style="{ color: thread.user.color }"
                class="font-weight-medium"
                >{{ thread.user.username }}</span
              >
              on {{ thread.timestamp_formatted }}
            </h2>
          </div>
          <p class="mt-6 mb-0" v-html="`${thread.op.substring(0, 300)}...`"></p>
          <v-btn
            color="grey"
            absolute
            bottom
            right
            icon
            @click="deleteThread(index)"
            v-if="
              thread_hover == index &&
              ($root.user._id == thread.user._id || $root.user.rights.admin)
            "
            ><v-icon>mdi-delete</v-icon></v-btn
          >
        </v-card>
      </div>

      <v-dialog v-model="new_thread.open" max-width="650">
        <v-card>
          <v-card-title class="display-1"
            ><input
              placeholder="Thread title..."
              v-model="new_thread.data.title"
          /></v-card-title>

          <v-card-text>
            <p>
              <textarea
                placeholder="Original post..."
                v-model="new_thread.data.op"
              ></textarea>
            </p>
          </v-card-text>

          <v-card-actions>
            <v-btn
              icon
              color="grey"
              @click="uploader = true"
              v-if="!new_thread.data.attachment"
              ><v-icon>mdi-paperclip</v-icon></v-btn
            >
            <v-btn
              v-else
              icon
              color="grey"
              @click="new_thread.data.attachment = false"
              ><v-icon>mdi-close</v-icon></v-btn
            >
            <!-- <v-checkbox
              color="#9F1239"
              class="mt-0"
              hide-details
              label="Post anonymously?"
              v-model="new_thread.anon"
            ></v-checkbox> -->
            <v-spacer></v-spacer>
            <v-btn color="#9F1239" text @click="newThread()">Post</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-btn
        @click="new_thread.open = true"
        v-if="filteredThreads.length > 1"
        fab
        fixed
        bottom
        right
        color="#881337"
        ><v-icon>mdi-plus</v-icon></v-btn
      >
    </main>

    <main
      v-else
      :style="{
        height: $vuetify.breakpoint.mdAndUp
          ? 'calc(100vh - 112px)'
          : 'calc(100vh - 104px)',
      }"
      style="overflow-y: auto"
    >
      <v-container style="max-width: 750px; margin: auto">
        <v-btn
          style="margin-bottom: 30px"
          color="grey"
          text
          @click="$router.push('/forum')"
          ><v-icon left>mdi-chevron-left</v-icon>Back</v-btn
        >
        <h1 class="display-1">{{ current.title }}</h1>

        <v-card
          class="mt-8 pa-4"
          style="position: relative"
          @mouseover="hover = -1"
          @mouseleave="hover = -2"
        >
          <div v-if="current.attachment">
            <v-img
              :src="current.attachment.uri"
              v-if="current.attachment.type.includes('image')"
            />
            <video
              :src="current.attachment.uri"
              v-else-if="current.attachment.type.includes('video')"
            ></video>
            <audio
              :src="current.attachment.uri"
              v-else-if="current.attachment.type.includes('audio')"
            ></audio>
            <a
              class="white--text"
              @click="window.open(current.attachment.uri)"
              v-else
              ><v-icon>mdi-download</v-icon> Download file</a
            >
          </div>
          <p v-html="current.op"></p>
          <div class="d-flex mt-3">
            <v-avatar size="30"
              ><v-img
                :src="`https://www.theparadigm.ga/relay/profile-pics/${current.user._id}.png`"
              ></v-img
            ></v-avatar>

            <h2 class="subtitle-2 grey--text font-weight-light ml-3 mt-1">
              By
              <span
                class="font-weight-medium"
                :style="{ color: current.user.color }"
                >{{ current.user.username }}</span
              >
              on {{ current.timestamp_formatted }}
            </h2>
          </div>

          <div style="position: absolute; bottom: 8px; right: 8px">
            <v-btn
              color="grey"
              icon
              @click="
                deleteThread(
                  filteredThreads.findIndex((item) => item._id == current._id)
                )
              "
              v-if="
                hover == -1 &&
                ($root.user._id == current.user._id || $root.user.rights.admin)
              "
              ><v-icon>mdi-delete</v-icon></v-btn
            >

            <v-btn
              color="grey"
              v-if="hover == -1"
              icon
              @click="
                (new_reply = { open: true, content: '' }),
                  (new_subreply = { open: -1, content: '' })
              "
              ><v-icon>mdi-reply</v-icon></v-btn
            >
          </div>
        </v-card>

        <v-divider class="ma-6"></v-divider>

        <v-card v-if="new_reply.open">
          <v-card-text>
            <textarea
              @keyup.shift.enter="newReply()"
              @keyup.esc="new_reply = { open: false, content: '' }"
              placeholder="New reply..."
              v-model="new_reply.content"
            ></textarea>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="grey"
              icon
              @click="new_reply = { open: false, content: '' }"
              ><v-icon>mdi-delete</v-icon></v-btn
            >
            <v-btn
              icon
              color="grey"
              @click="uploader = true"
              v-if="!new_reply.attachment"
              ><v-icon>mdi-paperclip</v-icon></v-btn
            >
            <v-btn
              v-else
              icon
              color="grey"
              @click="new_reply.attachment = false"
              ><v-icon>mdi-close</v-icon></v-btn
            >
            <v-spacer></v-spacer>
            <v-btn @click="newReply()" color="grey" icon
              ><v-icon>mdi-send</v-icon></v-btn
            >
          </v-card-actions>
        </v-card>

        <v-divider class="ma-6" v-if="new_reply.open"></v-divider>

        <p
          class="text-center font-italic grey--text font-weight-light"
          v-if="current.replies.length < 1"
        >
          No replies in this thread<span v-if="new_reply.open">... yet</span>
        </p>

        <div
          class="mt-3"
          v-for="(reply, index) in current.replies"
          :key="reply._id"
        >
          <v-card
            class="pa-4"
            style="position: relative"
            @mouseover="hover = index"
            @mouseleave="hover = -2"
          >
            <div v-if="reply.attachment">
              <v-img
                :src="reply.attachment.uri"
                v-if="reply.attachment.type.includes('image')"
              />
              <video
                :src="reply.attachment.uri"
                v-else-if="reply.attachment.type.includes('video')"
              ></video>
              <audio
                :src="reply.attachment.uri"
                v-else-if="reply.attachment.type.includes('audio')"
              ></audio>
              <a
                class="white--text"
                @click="window.open(reply.attachment.uri)"
                v-else
                ><v-icon>mdi-download</v-icon> Download file</a
              >
            </div>

            <p v-html="reply.content"></p>
            <div class="d-flex mt-3">
              <v-avatar size="30"
                ><v-img
                  :src="`https://www.theparadigm.ga/relay/profile-pics/${reply.user._id}.png`"
                ></v-img
              ></v-avatar>

              <h2 class="subtitle-2 grey--text font-weight-light ml-3 mt-1">
                By
                <span
                  class="font-weight-medium"
                  :style="{ color: reply.user.color }"
                  >{{ reply.user.username }}</span
                >
                on {{ reply.timestamp_formatted }}
              </h2>
            </div>
            <div style="position: absolute; bottom: 8px; right: 8px">
              <v-btn
                color="grey"
                v-if="
                  hover == index &&
                  ($root.user._id == reply.user._id || $root.user.rights.admin)
                "
                icon
                @click="deleteReply(index)"
                ><v-icon>mdi-delete</v-icon></v-btn
              >

              <v-btn
                color="grey"
                v-if="hover == index"
                icon
                @click="
                  (new_subreply = { open: index, content: '' }),
                    (new_reply = { open: false, content: '' })
                "
                ><v-icon>mdi-reply</v-icon></v-btn
              >
            </div>
          </v-card>

          <v-card v-if="new_subreply.open == index" class="ml-12 mt-3">
            <v-card-text>
              <textarea
                @keyup.shift.enter="newSubreply(reply._id, index)"
                @keyup.esc="new_subreply = { open: -1, content: '' }"
                placeholder="New subreply..."
                v-model="new_subreply.content"
              ></textarea>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="grey"
                icon
                @click="new_subreply = { open: -1, content: '' }"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
              <v-btn
                icon
                color="grey"
                @click="uploader = true"
                v-if="!new_subreply.attachment"
                ><v-icon>mdi-paperclip</v-icon></v-btn
              >
              <v-btn
                v-else
                icon
                color="grey"
                @click="new_subreply.attachment = false"
                ><v-icon>mdi-close</v-icon></v-btn
              >
              <v-spacer></v-spacer>
              <v-btn color="grey" icon @click="newSubreply(reply._id, index)"
                ><v-icon>mdi-send</v-icon></v-btn
              >
            </v-card-actions>
          </v-card>

          <v-divider
            class="my-6 mr-6"
            style="margin-left: 72px"
            v-if="new_subreply.open == index"
          ></v-divider>

          <v-card
            class="ml-12 mt-3 pa-4"
            v-for="(subreply, index) in reply.replies"
            :key="subreply._id"
            @mouseenter="sub_hover = { sub: index, parent: reply._id }"
            @mouseleave="sub_hover = { sub: -1, parent: -1 }"
          >
            <div v-if="reply.attachment">
              <v-img
                :src="subreply.attachment.uri"
                v-if="subreply.attachment.type.includes('image')"
              />
              <video
                :src="subreply.attachment.uri"
                v-else-if="subreply.attachment.type.includes('video')"
              ></video>
              <audio
                :src="subreply.attachment.uri"
                v-else-if="subreply.attachment.type.includes('audio')"
              ></audio>
              <a
                class="white--text"
                @click="window.open(subreply.attachment.uri)"
                v-else
                ><v-icon>mdi-download</v-icon> Download file</a
              >
            </div>

            <p v-html="subreply.content"></p>
            <div class="d-flex mt-3">
              <v-avatar size="30"
                ><v-img
                  :src="`https://www.theparadigm.ga/relay/profile-pics/${subreply.user._id}.png`"
                ></v-img
              ></v-avatar>

              <h2 class="subtitle-2 grey--text font-weight-light ml-3 mt-1">
                By
                <span
                  class="font-weight-medium"
                  :style="{ color: subreply.user.color }"
                  >{{ subreply.user.username }}</span
                >
                on {{ subreply.timestamp_formatted }}
              </h2>
            </div>
            <div style="position: absolute; bottom: 8px; right: 8px">
              <v-btn
                color="grey"
                v-if="
                  sub_hover.sub == index &&
                  sub_hover.parent == reply._id &&
                  ($root.user._id == reply.user._id || $root.user.rights.admin)
                "
                icon
                @click="deleteSubreply(reply._id, subreply._id)"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </div>
          </v-card>
        </div>
      </v-container>
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
          <v-btn @click="parseUpload()" color="blue accent-1" text
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
  name: "Forum",
  data() {
    return {
      threads: [],
      search: "",
      current: false,
      loading: true,
      hover: -2,
      new_thread: {
        open: false,
        anon: false,
        data: {
          title: "",
          op: "",
          attachment: false,
          replies: [],
        },
      },
      new_reply: {
        open: false,
        content: "",
        attachment: false,
      },
      new_subreply: {
        open: -1,
        content: "",
        attachment: false,
      },
      uploader: false,
      file: null,

      thread_hover: -1,
      reply_hover: -1,
      sub_hover: {
        sub: -1,
        parent: -1,
      },

      window,
    };
  },
  computed: {
    filteredThreads() {
      let threads = this.threads.filter((thread) => {
        return (
          thread.title.toLowerCase().includes(this.search.toLowerCase()) ||
          thread._id == this.search
        );
      });

      let sorted = threads.sort((a, b) => b.timestamp - a.timestamp);

      return sorted;
    },
  },
  created() {
    this.getThreads();
  },
  watch: {
    $route(to, from) {
      this.$parseRoute();
    },
  },

  methods: {
    $parseRoute() {
      if (this.$route.path != "/forum") {
        this.getThread(this.$route.params.id);
      } else this.current = false;
    },

    getThreads() {
      this.$http.get("/api/forum").then((response) => {
        this.threads = response.data;
        this.$parseRoute();
        this.loading = false;
      });
    },
    getThread(id) {
      this.$http
        .get(`/api/forum/${id}`)
        .then((response) => {
          this.current = response.data;
          if (this.$route.path != `/forum/${response.data._id}`)
            this.$router.push(`/forum/${response.data._id}`);
        })
        .catch((error) => console.error(error));
    },
    newThread() {
      this.new_thread.data.user = {
        username: this.$root.user.username,
        color: this.$root.user.color,
        _id: this.$root.user._id,
      };
      this.new_thread.data.timestamp = Date.now();
      this.new_thread.data.timestamp_formatted = moment().format(
        "dddd, MMMM Do YYYY [at] h:mm:ss a"
      );
      this.$http
        .post("/api/forum", this.new_thread.data)
        .then((response) => {
          this.current = response.data;
          this.$router.push(`/forum/${response.data._id}`);
          this.threads.unshift(response.data);
          this.new_thread = {
            open: false,
            anon: false,
            data: {
              title: "",
              op: "",
              attachment: "",
              replies: [],
            },
          };
        })
        .catch((error) => console.error(error));
    },
    deleteThread(index) {
      const thread = this.filteredThreads[index];
      this.$http
        .delete(`/api/forum/${thread._id}`)
        .catch((error) => console.error(error));
      this.filteredThreads.splice(index, 1);
      if (this.$route.path != "/forum") this.$router.push("/forum");
    },

    newReply() {
      const data = {
        attachment: this.new_reply.attachment,
        content: this.new_reply.content,
        timestamp: Date.now(),
        timestamp_formatted: moment().format(
          "dddd, MMMM Do YYYY [at] h:mm:ss a"
        ),
        user: {
          username: this.$root.user.username,
          color: this.$root.user.color,
          _id: this.$root.user._id,
        },
        replies: [],
      };
      this.new_reply = { open: false, content: "" };
      this.current.replies.unshift(data);
      this.$http
        .put(`/api/forum/${this.current._id}`, data)
        .catch((error) => console.error(error));
    },
    deleteReply(index) {
      const reply = this.current.replies[index];
      this.$http
        .delete(`/api/forum/${this.current._id}/${reply._id}`)
        .catch((error) => console.error(error));
      this.current.replies.splice(index, 1);
    },

    newSubreply(id, index) {
      const data = {
        attachment: this.new_subreply.attachment,
        content: this.new_subreply.content,
        timestamp: Date.now(),
        timestamp_formatted: moment().format("MM/DD/YYYY [at] h:mm a"),
        user: {
          username: this.$root.user.username,
          color: this.$root.user.color,
          _id: this.$root.user._id,
        },
        replies: [],
      };
      this.new_subreply = { open: -1, content: "" };
      this.current.replies[index].replies.unshift(data);
      this.$http
        .put(`/api/forum/${this.current._id}/${id}`, data)
        .then(
          (response) =>
            (this.current.replies[index].replies[0]._id = response.data._id)
        )
        .catch((error) => console.error(error));
    },
    deleteSubreply(reply, subreply) {
      console.log(reply, subreply);
      let r = this.current.replies.find((item) => item._id == reply);
      let s = r.replies.find((item) => item._id == subreply);
      this.$http
        .delete(`/api/forum/${this.current._id}/${reply}/${subreply}`)
        .catch((error) => console.error(error));
      r.replies.splice(subreply, 1);
    },

    parseUpload() {
      let reader = new FileReader();
      let that = this;
      reader.onloadend = () => {
        const data = {
          uri: reader.result,
          type: that.file.type,
          size: that.file.size + "B",
          name: that.file.name,
        };
        if (that.new_reply.open) {
          that.new_reply.attachment = data;
        } else if (that.new_subreply.open > -1) {
          that.new_subreply.attachment = data;
        } else {
          that.new_thread.data.attachment = data;
        }
        that.uploader = false;
        that.file = null;
      };
      reader.readAsDataURL(this.file);
    },
  },
};
</script>

<style scoped>
</style>