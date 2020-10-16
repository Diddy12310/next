<template>
  <div>
    <v-toolbar dense color="deep-orange">
      <v-toolbar-title>Flamechat</v-toolbar-title>
    </v-toolbar>

    <main>
      <v-navigation-drawer
        style="margin-top: 48px;"
        class="grey darken-4"
        absolute
        floating
        permanent
        v-model="drawer"
      >
        <v-list>
          <v-list-item-group>
            <v-list-item
              v-for="(chatroom, index) in $root.user.chatrooms"
              :key="index"
              :value="chatroom.id"
              @click="changeChatroom(chatroom, index)"
            >
              <v-list-item-icon
                ><v-icon>{{ chatroom.icon }}</v-icon></v-list-item-icon
              >
              <v-list-item-title>{{ chatroom.name }}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <section style="margin-left: 256px;" v-if="!current">
        Select a chatroom from the left.
      </section>

      <section style="margin-left: 256px;" v-if="current">
        <v-list class="transparent">
          <v-list-item
            v-for="(message, index) in current.messages"
            :key="index"
          >
            <v-list-item-avatar>
              <v-img
                :src="
                  `https://www.theparadigmdev.com/relay/profile-pics/${
                    message.user_id
                  }.jpg`
                "
              ></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="font-weight-medium">
                <span :style="{ color: message.color }">{{
                  message.username
                }}</span>
                <span class="caption grey--text font-weight-light"
                  >&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
                  {{ message.timestamp }}</span
                >
              </v-list-item-title>
              <v-list-item-subtitle>{{ message.content }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </section>

      <footer style="margin-left: 256px;">
        <v-text-field
          hide-details
          v-model="new_message"
          label="New message..."
        ></v-text-field>
      </footer>
    </main>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  name: "Flamechat",
  data() {
    return {
      drawer: true,
      current: false,
      current_index: -1,
      socket: null,
      current_id: "home",
      new_message: "",
    };
  },
  methods: {
    async changeChatroom(chatroom, index) {
      if (this.current) this.socket.disconnect();
      this.current = false;
      this.socket = await io.connect(
        `https://www.theparadigmdev.com/flamechat/${chatroom.id}`
      );
      this.socket.on("data", (data) => {
        this.current = data;
        this.current_index = index;
      });
    },
    async sendMessage() {},
  },
};
</script>

<style scoped>
footer {
  position: absolute;
  width: 100%;
  bottom: 65px;
}
</style>
