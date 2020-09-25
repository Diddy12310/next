<template>
  <div class="flamechat">
    <v-navigation-drawer style="width: 74px;" permanent mini-variant absolute>
      <v-list rounded>
        <v-text-field
          hide-details="auto"
          class="mt-0"
          @keypress.enter="addChatroom()"
          v-model="add_chatroom_id"
          label="Add..."
        ></v-text-field>
        <v-list-item-group mandatory v-model="current_id">
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-list-item
                class="my-2"
                ripple
                v-on="on"
                value="user_home"
                @click="current = false"
              >
                <v-list-item-icon>
                  <v-icon class="text-center">mdi-home</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <span>Home</span>
          </v-tooltip>
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-list-item
                class="my-2"
                :v-ripple="true"
                v-on="on"
                value="user_dm"
              >
                <v-list-item-icon>
                  <v-icon>mdi-message-lock</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <span>Direct Messages</span>
          </v-tooltip>
          <v-divider></v-divider>
          <draggable
            v-model="$root.user.chatrooms"
            @change="saveChatroomOrder()"
          >
            <template v-for="(chatroom, index) in $root.user.chatrooms">
              <v-tooltip right :key="index">
                <template v-slot:activator="{ on }">
                  <v-list-item
                    class="my-2"
                    :v-ripple="true"
                    v-on="on"
                    :key="index"
                    :value="chatroom.id"
                    @contextmenu.prevent="showChatroomMenu($event, chatroom.id)"
                    @click="changeChatroom(current, chatroom)"
                  >
                    <v-list-item-icon>
                      <v-icon>{{ chatroom.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <span>{{ chatroom.name }}</span>
              </v-tooltip>
            </template>
          </draggable>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-menu
      v-model="chatroom_menu.open"
      v-if="chatroom_menu.open"
      :position-x="chatroom_menu.x"
      :position-y="chatroom_menu.y"
      absolute
      offset-y
    >
      <v-list dense class="chatroom-menu">
        <v-list-item @click="$noFunc()">
          <v-list-item-icon
            ><v-icon class="blue--text darken-2"
              >mdi-account-multiple-plus</v-icon
            ></v-list-item-icon
          >
          <v-list-item-title class="blue--text darken-2"
            >Invite a friend</v-list-item-title
          >
        </v-list-item>
        <v-list-item @click="leaveChatroom()">
          <v-list-item-icon
            ><v-icon class="deep-orange--text"
              >mdi-exit-run</v-icon
            ></v-list-item-icon
          >
          <v-list-item-title class="deep-orange--text"
            >Leave chatroom</v-list-item-title
          >
        </v-list-item>
        <v-list-item @click="$noFunc()">
          <v-list-item-icon><v-icon>mdi-content-copy</v-icon></v-list-item-icon>
          <v-list-item-title>Copy ID</v-list-item-title>
        </v-list-item>
        <v-divider
          v-if="
            $root.user._id == chatroom_menu.owner ||
              $root.user.rights.admin == true
          "
        ></v-divider>
        <v-list-item
          @click="delete_verify_popup = true"
          v-if="
            $root.user._id == chatroom_menu.owner ||
              $root.user.rights.admin == true
          "
        >
          <v-list-item-icon
            ><v-icon class="red--text">mdi-delete</v-icon></v-list-item-icon
          >
          <v-list-item-title class="red--text"
            >Delete chatroom</v-list-item-title
          >
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Chatroom -->
    <main v-if="!current_id.includes('user_')">
      <v-toolbar dense :style="{ backgroundColor: current.theme }">
        <v-toolbar-title>Flamechat</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          icon
          v-if="
            $root.user._id == chatroom_menu.owner ||
              $root.user.rights.admin == true
          "
          @click="people_dialog = true"
          ><v-icon>mdi-account-multiple</v-icon></v-btn
        >
        <v-btn
          icon
          v-if="
            $root.user._id == chatroom_menu.owner ||
              $root.user.rights.admin == true
          "
          @click="purge_confirm = true"
          ><v-icon>mdi-notification-clear-all</v-icon></v-btn
        >
      </v-toolbar>
      <!-- <v-btn @click="createChatroom()">create</v-btn> -->

      <v-list
        :style="{
          height: `calc(100vh - ${$root.music.open ? '278px' : '198px'})`,
          overflowY: 'auto',
        }"
        v-chat-scroll="{ always: false, smooth: true }"
        v-if="
          $vuetify.breakpoint.smAndUp && current_status == 'approved' && current
        "
      >
        <v-fade-transition group>
          <v-list-item class="d-none" :key="-1"></v-list-item>
          <v-list-item
            @mouseover="current_message = message"
            @mouseleave="current_message = false"
            @dblclick="deleteChat(message._id)"
            v-for="(message, index) in current.messages"
            :key="index"
          >
            <v-row v-if="message.type === 'message'">
              <v-col sm="1" cols="12" class="text-right py-0">
                <v-list-item-avatar
                  @click="viewProfile(message.user_id)"
                  class="mr-0"
                  ><v-img
                    loading="lazy"
                    :src="
                      `https://www.theparadigmdev.com/relay/profile-pics/${message.user_id}.jpg`
                    "
                  ></v-img
                ></v-list-item-avatar>
              </v-col>
              <v-col sm="10" cols="12" class="py-0">
                <v-list-item-content>
                  <p
                    style="word-wrap: break-word; max-width: 100%;"
                    v-html="message.content"
                  ></p>
                  <v-list-item-subtitle
                    ><span class="pr-2" :style="{ color: message.color }">{{
                      message.username
                    }}</span
                    >•<span class="px-2">{{ message.timestamp }}</span
                    ><span v-if="message.edits != 0"
                      >•<span class="pl-2"
                        >{{ message.edits }}
                        {{ message.edits > 1 ? "edits" : "edit" }}</span
                      ></span
                    ></v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-col>
              <v-col sm="1" cols="12" class="py-0">
                <v-fade-transition group>
                  <v-btn
                    key="edit"
                    v-if="
                      current_message == message
                        ? message.user_id == $root.user._id
                          ? true
                          : current.owner == $root.user._id
                          ? true
                          : $root.user.rights.admin
                          ? true
                          : false
                        : false
                    "
                    small
                    icon
                    color="grey darken-3"
                    @click="editChat(message)"
                    ><v-icon>mdi-pencil</v-icon></v-btn
                  >
                  <v-btn
                    key="delete"
                    v-if="
                      current_message == message
                        ? message.user_id == $root.user._id
                          ? true
                          : current.owner == $root.user._id
                          ? true
                          : $root.user.rights.admin
                          ? true
                          : false
                        : false
                    "
                    small
                    icon
                    color="grey darken-3"
                    @click="deleteChat(message)"
                    ><v-icon>mdi-delete</v-icon></v-btn
                  >
                </v-fade-transition>
              </v-col>
            </v-row>

            <v-list-item-subtitle
              class="text-center"
              v-if="message.type === 'left'"
              ><span :style="{ color: message.color }">{{
                message.username
              }}</span>
              has left</v-list-item-subtitle
            >
            <v-list-item-subtitle
              class="text-center"
              v-if="message.type === 'join'"
              ><span :style="{ color: message.color }">{{
                message.username
              }}</span>
              has joined</v-list-item-subtitle
            >

            <v-row v-if="message.type === 'file'">
              <v-col sm="1" cols="12" class="text-right py-0">
                <v-list-item-avatar
                  @click="viewProfile(message.user_id)"
                  class="mr-0"
                  ><v-img
                    loading="lazy"
                    :src="
                      `https://www.theparadigmdev.com/relay/profile-pics/${message.user_id}.jpg`
                    "
                  ></v-img
                ></v-list-item-avatar>
              </v-col>
              <v-col sm="10" cols="12" class="py-0">
                <v-list-item-content>
                  <v-card @click="window.open(message.url)" max-width="500">
                    <v-card-title
                      ><v-icon left class="mr-4">mdi-download</v-icon
                      >{{ message.content }}</v-card-title
                    >
                  </v-card>
                  <v-list-item-subtitle
                    ><span class="pr-2" :style="{ color: message.color }">{{
                      message.username
                    }}</span
                    >•<span class="px-2">{{
                      message.timestamp
                    }}</span></v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-col>
              <v-col sm="1" cols="12" class="py-0">
                <v-fade-transition group>
                  <v-btn
                    key="delete"
                    v-if="
                      current_message == message
                        ? message.user_id == $root.user._id
                          ? true
                          : current.owner == $root.user._id
                          ? true
                          : $root.user.rights.admin
                          ? true
                          : false
                        : false
                    "
                    small
                    icon
                    color="grey darken-3"
                    @click="deleteChat(message)"
                    ><v-icon>mdi-delete</v-icon></v-btn
                  >
                </v-fade-transition>
              </v-col>
            </v-row>

            <v-row v-if="message.type === 'image' || message.type == 'video'">
              <v-col sm="1" cols="12" class="text-right py-0">
                <v-list-item-avatar
                  @click="viewProfile(message.user_id)"
                  class="mr-0"
                  ><v-img
                    loading="lazy"
                    :src="
                      `https://www.theparadigmdev.com/relay/profile-pics/${$message.user_id}.jpg`
                    "
                  ></v-img
                ></v-list-item-avatar>
              </v-col>
              <v-col sm="10" cols="12" class="py-0">
                <v-list-item-content class="pt-2">
                  <v-list-item-subtitle
                    ><span class="pr-2" :style="{ color: message.color }">{{
                      message.username
                    }}</span
                    >•<span class="px-2">{{
                      message.timestamp
                    }}</span></v-list-item-subtitle
                  >
                  <img
                    v-if="message.type === 'image'"
                    style="max-width: 250px;"
                    :src="message.url"
                  />
                  <video
                    v-if="message.type === 'video'"
                    style="max-width: 250px;"
                    controls
                    :src="message.url"
                  ></video>
                </v-list-item-content>
              </v-col>
              <v-col sm="1" cols="12" class="py-0">
                <v-fade-transition group>
                  <v-btn
                    key="delete"
                    v-if="
                      current_message == message
                        ? message.user_id == $root.user._id
                          ? true
                          : current.owner == $root.user._id
                          ? true
                          : $root.user.rights.admin
                          ? true
                          : false
                        : false
                    "
                    small
                    icon
                    color="grey darken-3"
                    @click="deleteChat(message)"
                    ><v-icon>mdi-delete</v-icon></v-btn
                  >
                </v-fade-transition>
              </v-col>
            </v-row>
          </v-list-item>
        </v-fade-transition>
      </v-list>

      <v-list
        :style="{
          height: `calc(100vh - ${$root.music.open ? '278px' : '198px'})`,
          overflowY: 'auto',
        }"
        three-line
        v-chat-scroll="{ always: false, smooth: true }"
        v-if="$vuetify.breakpoint.xsOnly && current_status == 'approved'"
      >
        <v-fade-transition group>
          <v-list-item class="d-none" :key="-1"></v-list-item>
          <v-list-item
            @mouseover="current_message = message"
            @mouseleave="current_message = false"
            @dblclick="deleteChat(message._id)"
            v-for="(message, index) in current.messages"
            :key="index"
          >
            <v-container fluid v-if="message.type === 'message'" class="py-0">
              <v-row no-gutters align="end">
                <v-col sm="6">
                  <v-list-item-avatar class="ma-0"
                    ><v-img
                      loading="lazy"
                      :src="
                        `https://www.theparadigmdev.com/relay/profile-pics/${message.user_id}.jpg`
                      "
                    ></v-img
                  ></v-list-item-avatar>
                </v-col>
                <v-col sm="6" class="text-right">
                  <v-fade-transition group>
                    <v-btn
                      key="edit"
                      v-if="
                        current_message == message
                          ? message.user_id == $root.user._id
                            ? true
                            : current.owner == $root.user._id
                            ? true
                            : $root.user.rights.admin
                            ? true
                            : false
                          : false
                      "
                      small
                      icon
                      color="grey darken-3"
                      @click="editChat(message)"
                      ><v-icon>mdi-pencil</v-icon></v-btn
                    >
                    <v-btn
                      key="delete"
                      v-if="
                        current_message == message
                          ? message.user_id == $root.user._id
                            ? true
                            : current.owner == $root.user._id
                            ? true
                            : $root.user.rights.admin
                            ? true
                            : false
                          : false
                      "
                      small
                      icon
                      color="grey darken-3"
                      @click="deleteChat(message)"
                      ><v-icon>mdi-delete</v-icon></v-btn
                    >
                  </v-fade-transition>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col sm="12">
                  <v-list-item-content>
                    <p v-html="message.content"></p>
                    <v-list-item-subtitle
                      ><span class="pr-2" :style="{ color: message.color }">{{
                        message.username
                      }}</span
                      >•<span class="px-2">{{ message.timestamp }}</span
                      ><span v-if="message.edits != 0"
                        >•<span class="pl-2"
                          >{{ message.edits }}
                          {{ message.edits > 1 ? "edits" : "edit" }}</span
                        ></span
                      ></v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-col>
              </v-row>
            </v-container>

            <v-list-item-subtitle
              class="text-center"
              v-if="message.type === 'left'"
              ><span :style="{ color: message.color }">{{
                message.username
              }}</span>
              has left</v-list-item-subtitle
            >
            <v-list-item-subtitle
              class="text-center"
              v-if="message.type === 'join'"
              ><span :style="{ color: message.color }">{{
                message.username
              }}</span>
              has joined</v-list-item-subtitle
            >

            <v-container fluid v-if="message.type === 'file'">
              <v-row no-gutters align="end">
                <v-col sm="6">
                  <v-list-item-avatar class="ma-0"
                    ><v-img
                      loading="lazy"
                      :src="
                        `https://www.theparadigmdev.com/relay/profile-pics/${message.user_id}.jpg`
                      "
                    ></v-img
                  ></v-list-item-avatar>
                </v-col>
                <v-col sm="6" class="text-right">
                  <v-fade-transition group>
                    <v-btn
                      key="delete"
                      v-if="
                        current_message == message
                          ? message.user_id == $root.user._id
                            ? true
                            : current.owner == $root.user._id
                            ? true
                            : $root.user.rights.admin
                            ? true
                            : false
                          : false
                      "
                      small
                      icon
                      color="grey darken-3"
                      @click="deleteChat(message)"
                      ><v-icon>mdi-delete</v-icon></v-btn
                    >
                  </v-fade-transition>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col sm="12">
                  <v-list-item-content>
                    <v-card @click="window.open(message.url)" max-width="350">
                      <v-card-title>{{ message.content }}</v-card-title>
                    </v-card>
                    <v-list-item-subtitle
                      ><span class="pr-2" :style="{ color: message.color }">{{
                        message.username
                      }}</span
                      >•<span class="px-2">{{
                        message.timestamp
                      }}</span></v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-col>
              </v-row>
            </v-container>

            <v-container
              fluid
              v-if="message.type === 'image' || message.type === 'video'"
            >
              <v-row no-gutters align="end">
                <v-col sm="6">
                  <v-list-item-avatar class="ma-0"
                    ><v-img
                      loading="lazy"
                      :src="
                        `https://www.theparadigmdev.com/relay/profile-pics/${message.user_id}.jpg`
                      "
                    ></v-img
                  ></v-list-item-avatar>
                </v-col>
                <v-col sm="6" class="text-right">
                  <v-fade-transition group>
                    <v-btn
                      key="delete"
                      v-if="
                        current_message == message
                          ? message.user_id == $root.user._id
                            ? true
                            : current.owner == $root.user._id
                            ? true
                            : $root.user.rights.admin
                            ? true
                            : false
                          : false
                      "
                      small
                      icon
                      color="grey darken-3"
                      @click="deleteChat(message)"
                      ><v-icon>mdi-delete</v-icon></v-btn
                    >
                  </v-fade-transition>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col sm="12">
                  <v-list-item-content>
                    <v-list-item-subtitle
                      ><span class="pr-2" :style="{ color: message.color }">{{
                        message.username
                      }}</span
                      >•<span class="px-2">{{
                        message.timestamp
                      }}</span></v-list-item-subtitle
                    >
                    <img v-if="message.type == 'image'" :src="message.url" />
                    <video
                      v-if="message.type == 'video'"
                      controls
                      :src="message.url"
                    ></video>
                  </v-list-item-content>
                </v-col>
              </v-row>
            </v-container>
          </v-list-item>
        </v-fade-transition>
      </v-list>

      <v-fade-transition leave-absolute v-if="current_status == 'approved'">
        <span
          class="ml-4 mb-n1 grey--text font-italic text-body-2"
          v-if="typers.length > 0"
          ><span
            v-for="(user, index) in typers"
            :key="index"
            :style="{ color: user.color }"
            >{{ user.user }}<span v-if="typers.length - 1 != index">, </span>
          </span>
          is typing...</span
        >
      </v-fade-transition>
      <v-layout
        justify-center
        align-center
        text-center
        px-4
        v-if="current_status == 'approved'"
      >
        <v-flex xs10>
          <v-text-field
            hide-details="auto"
            :style="{ marginTop: typers.length > 0 ? '0px' : '24px' }"
            @keypress="startTyping()"
            @keypress.enter="sendChat()"
            v-model="new_message"
            :label="`Message ${current.name}...`"
          ></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-btn
            :style="{ marginTop: typers.length > 0 ? '0px' : '24px' }"
            text
            icon
            @click="sendChat()"
            :disabled="new_message == ''"
            ><v-icon>mdi-send</v-icon></v-btn
          >
          <v-btn
            :style="{ marginTop: typers.length > 0 ? '0px' : '24px' }"
            text
            icon
            @click="uploader = true"
            ><v-icon>mdi-paperclip</v-icon></v-btn
          >
        </v-flex>
      </v-layout>

      <div v-if="current_status == 'requested'" class="text-center">
        <h1 class="text-h4 mt-12">You have requested to join this chatroom</h1>
        <v-btn
          @click="rejectRequest($root.user._id)"
          class="mt-6"
          color="blue lighten-1"
          text
          ><v-icon left>mdi-undo-variant</v-icon>Retract</v-btn
        >
      </div>
    </main>

    <!-- DM -->
    <main
      v-if="current_id === 'user_dm'"
      class="fill-height"
      style="margin-left: 148px;"
    >
      <v-toolbar dense color="deep-orange">
        <v-toolbar-title>Flamechat: Direct Messages</v-toolbar-title>
      </v-toolbar>

      <v-navigation-drawer
        mini-variant
        permanent
        absolute
        style="width: 74px; left: +74px;"
      >
        <v-list nav rounded class="fill-height">
          <v-list-item-group v-model="current_dm">
            <p
              class="text-center grey--text font-italic mt-12"
              v-if="$root.user.people.approved.length < 1"
            >
              You have no friends.
            </p>
            <v-tooltip
              right
              v-for="(friend, index) in approved_friends"
              :key="index"
            >
              <template v-slot:activator="{ on }">
                <v-list-item
                  v-on="on"
                  @click="changeDM(current, friend)"
                  :value="friend.dm"
                >
                  <v-badge
                    style="position: relative; left: -15px;"
                    bordered
                    bottom
                    dot
                    offset-x="25"
                    offset-y="17"
                    color="green"
                    :value="friend.in"
                  >
                    <v-list-item-avatar
                      ><v-img
                        loading="lazy"
                        :src="
                          `https://www.theparadigmdev.com/relay/profile-pics/${friend._id}.jpg`
                        "
                      ></v-img
                    ></v-list-item-avatar>
                  </v-badge>
                </v-list-item>
              </template>
              <span :style="{ color: friend.color }">{{
                friend.username
              }}</span>
            </v-tooltip>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <v-list
        :style="{
          height: `calc(100vh - ${$root.music.open ? '278px' : '198px'})`,
          overflowY: 'auto',
        }"
        v-chat-scroll="{ always: false, smooth: true }"
        v-if="$vuetify.breakpoint.smAndUp && current_dm"
      >
        <v-fade-transition group>
          <v-list-item class="d-none" :key="-1"></v-list-item>
          <v-list-item
            @mouseover="current_message = message"
            @mouseleave="current_message = false"
            @dblclick="deleteChat(message._id)"
            v-for="(message, index) in current.messages"
            :key="index"
          >
            <v-row v-if="message.type === 'message'">
              <v-col sm="1" cols="12" class="text-right py-0">
                <v-list-item-avatar
                  @click="viewProfile(message.user_id)"
                  class="mr-0"
                  ><v-img
                    loading="lazy"
                    :src="
                      `https://www.theparadigmdev.com/relay/profile-pics/${message.user_id}.jpg`
                    "
                  ></v-img
                ></v-list-item-avatar>
              </v-col>
              <v-col sm="10" cols="12" class="py-0">
                <v-list-item-content>
                  <p
                    style="word-wrap: break-word; max-width: 100%;"
                    v-html="message.content"
                  ></p>
                  <v-list-item-subtitle
                    ><span class="pr-2" :style="{ color: message.color }">{{
                      message.username
                    }}</span
                    >•<span class="px-2">{{ message.timestamp }}</span
                    ><span v-if="message.edits != 0"
                      >•<span class="pl-2"
                        >{{ message.edits }}
                        {{ message.edits > 1 ? "edits" : "edit" }}</span
                      ></span
                    ></v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-col>
              <v-col sm="1" cols="12" class="py-0">
                <v-fade-transition group>
                  <v-btn
                    key="edit"
                    v-if="
                      current_message == message
                        ? message.user_id == $root.user._id
                          ? true
                          : false
                        : false
                    "
                    small
                    icon
                    color="grey darken-3"
                    @click="editChat(message)"
                    ><v-icon>mdi-pencil</v-icon></v-btn
                  >
                  <v-btn
                    key="delete"
                    v-if="
                      current_message == message
                        ? message.user_id == $root.user._id
                          ? true
                          : false
                        : false
                    "
                    small
                    icon
                    color="grey darken-3"
                    @click="deleteChat(message)"
                    ><v-icon>mdi-delete</v-icon></v-btn
                  >
                </v-fade-transition>
              </v-col>
            </v-row>

            <v-row v-if="message.type === 'file'">
              <v-col sm="1" cols="12" class="text-right py-0">
                <v-list-item-avatar
                  @click="viewProfile(message.user_id)"
                  class="mr-0"
                  ><v-img
                    loading="lazy"
                    :src="
                      `https://www.theparadigmdev.com/relay/profile-pics/${message.user_id}.jpg`
                    "
                  ></v-img
                ></v-list-item-avatar>
              </v-col>
              <v-col sm="10" cols="12" class="py-0">
                <v-list-item-content>
                  <v-card @click="window.open(message.url)" max-width="500">
                    <v-card-title
                      ><v-icon left class="mr-4">mdi-download</v-icon
                      >{{ message.content }}</v-card-title
                    >
                  </v-card>
                  <v-list-item-subtitle
                    ><span class="pr-2" :style="{ color: message.color }">{{
                      message.username
                    }}</span
                    >•<span class="px-2">{{
                      message.timestamp
                    }}</span></v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-col>
              <v-col sm="1" cols="12" class="py-0">
                <v-fade-transition group>
                  <v-btn
                    key="delete"
                    v-if="
                      current_message == message
                        ? message.user_id == $root.user._id
                          ? true
                          : current.owner == $root.user._id
                          ? true
                          : $root.user.rights.admin
                          ? true
                          : false
                        : false
                    "
                    small
                    icon
                    color="grey darken-3"
                    @click="deleteChat(message)"
                    ><v-icon>mdi-delete</v-icon></v-btn
                  >
                </v-fade-transition>
              </v-col>
            </v-row>

            <v-row v-if="message.type === 'image' || message.type == 'video'">
              <v-col sm="1" cols="12" class="text-right py-0">
                <v-list-item-avatar
                  @click="viewProfile(message.user_id)"
                  class="mr-0"
                  ><v-img
                    loading="lazy"
                    :src="
                      `https://www.theparadigmdev.com/relay/profile-pics/${message.user_id}.jpg`
                    "
                  ></v-img
                ></v-list-item-avatar>
              </v-col>
              <v-col sm="10" cols="12" class="py-0">
                <v-list-item-content class="pt-2">
                  <v-list-item-subtitle
                    ><span class="pr-2" :style="{ color: message.color }">{{
                      message.username
                    }}</span
                    >•<span class="px-2">{{
                      message.timestamp
                    }}</span></v-list-item-subtitle
                  >
                  <img
                    v-if="message.type === 'image'"
                    style="max-width: 250px;"
                    :src="message.url"
                  />
                  <video
                    v-if="message.type === 'video'"
                    style="max-width: 250px;"
                    controls
                    :src="message.url"
                  ></video>
                </v-list-item-content>
              </v-col>
              <v-col sm="1" cols="12" class="py-0">
                <v-fade-transition group>
                  <v-btn
                    key="delete"
                    v-if="
                      current_message == message
                        ? message.user_id == $root.user._id
                          ? true
                          : current.owner == $root.user._id
                          ? true
                          : $root.user.rights.admin
                          ? true
                          : false
                        : false
                    "
                    small
                    icon
                    color="grey darken-3"
                    @click="deleteChat(message)"
                    ><v-icon>mdi-delete</v-icon></v-btn
                  >
                </v-fade-transition>
              </v-col>
            </v-row>
          </v-list-item>
        </v-fade-transition>
      </v-list>

      <v-list
        :style="{
          height: `calc(100vh - ${$root.music.open ? '278px' : '198px'})`,
          overflowY: 'auto',
        }"
        three-line
        v-chat-scroll="{ always: false, smooth: true }"
        v-if="$vuetify.breakpoint.xsOnly"
      >
        <v-fade-transition group>
          <v-list-item class="d-none" :key="-1"></v-list-item>
          <v-list-item
            @mouseover="current_message = message"
            @mouseleave="current_message = false"
            @dblclick="deleteChat(message._id)"
            v-for="(message, index) in current.messages"
            :key="index"
          >
            <v-container fluid v-if="message.type === 'message'">
              <v-row no-gutters align="end">
                <v-col sm="6">
                  <v-list-item-avatar class="ma-0"
                    ><v-img
                      loading="lazy"
                      :src="
                        `https://www.theparadigmdev.com/relay/profile-pics/${message.user_id}.jpg`
                      "
                    ></v-img
                  ></v-list-item-avatar>
                </v-col>
                <v-col sm="6" class="text-right">
                  <v-fade-transition group>
                    <v-btn
                      key="edit"
                      v-if="
                        current_message == message
                          ? message.user_id == $root.user._id
                            ? true
                            : false
                          : false
                      "
                      small
                      icon
                      color="grey darken-3"
                      @click="editChat(message)"
                      ><v-icon>mdi-pencil</v-icon></v-btn
                    >
                    <v-btn
                      key="delete"
                      v-if="
                        current_message == message
                          ? message.user_id == $root.user._id
                            ? true
                            : false
                          : false
                      "
                      small
                      icon
                      color="grey darken-3"
                      @click="deleteChat(message)"
                      ><v-icon>mdi-delete</v-icon></v-btn
                    >
                  </v-fade-transition>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col sm="12">
                  <v-list-item-content>
                    <p v-html="message.content"></p>
                    <v-list-item-subtitle
                      ><span class="pr-2" :style="{ color: message.color }">{{
                        message.username
                      }}</span
                      >•<span class="px-2">{{ message.timestamp }}</span
                      ><span v-if="message.edits != 0"
                        >•<span class="pl-2"
                          >{{ message.edits }}
                          {{ message.edits > 1 ? "edits" : "edit" }}</span
                        ></span
                      ></v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-col>
              </v-row>
            </v-container>

            <v-container fluid v-if="message.type === 'file'">
              <v-row no-gutters align="end">
                <v-col sm="6">
                  <v-list-item-avatar class="ma-0"
                    ><v-img
                      loading="lazy"
                      :src="
                        `https://www.theparadigmdev.com/relay/profile-pics/${message.user_id}.jpg`
                      "
                    ></v-img
                  ></v-list-item-avatar>
                </v-col>
                <v-col sm="6" class="text-right">
                  <v-fade-transition group>
                    <v-btn
                      key="delete"
                      v-if="
                        current_message == message
                          ? message.user_id == $root.user._id
                            ? true
                            : current.owner == $root.user._id
                            ? true
                            : $root.user.rights.admin
                            ? true
                            : false
                          : false
                      "
                      small
                      icon
                      color="grey darken-3"
                      @click="deleteChat(message)"
                      ><v-icon>mdi-delete</v-icon></v-btn
                    >
                  </v-fade-transition>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col sm="12">
                  <v-list-item-content>
                    <v-card @click="window.open(message.url)" max-width="350">
                      <v-card-title>{{ message.content }}</v-card-title>
                    </v-card>
                    <v-list-item-subtitle
                      ><span class="pr-2" :style="{ color: message.color }">{{
                        message.username
                      }}</span
                      >•<span class="px-2">{{
                        message.timestamp
                      }}</span></v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-col>
              </v-row>
            </v-container>

            <v-container
              fluid
              v-if="message.type === 'image' || message.type === 'video'"
            >
              <v-row no-gutters align="end">
                <v-col sm="6">
                  <v-list-item-avatar class="ma-0"
                    ><v-img
                      loading="lazy"
                      :src="
                        `https://www.theparadigmdev.com/relay/profile-pics/${message.user_id}.jpg`
                      "
                    ></v-img
                  ></v-list-item-avatar>
                </v-col>
                <v-col sm="6" class="text-right">
                  <v-fade-transition group>
                    <v-btn
                      key="delete"
                      v-if="
                        current_message == message
                          ? message.user_id == $root.user._id
                            ? true
                            : current.owner == $root.user._id
                            ? true
                            : $root.user.rights.admin
                            ? true
                            : false
                          : false
                      "
                      small
                      icon
                      color="grey darken-3"
                      @click="deleteChat(message)"
                      ><v-icon>mdi-delete</v-icon></v-btn
                    >
                  </v-fade-transition>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col sm="12">
                  <v-list-item-content>
                    <v-list-item-subtitle
                      ><span class="pr-2" :style="{ color: message.color }">{{
                        message.username
                      }}</span
                      >•<span class="px-2">{{
                        message.timestamp
                      }}</span></v-list-item-subtitle
                    >
                    <img v-if="message.type == 'image'" :src="message.url" />
                    <video
                      v-if="message.type == 'video'"
                      controls
                      :src="message.url"
                    ></video>
                  </v-list-item-content>
                </v-col>
              </v-row>
            </v-container>
          </v-list-item>
        </v-fade-transition>
      </v-list>

      <v-fade-transition leave-absolute v-if="current_dm">
        <span
          class="ml-4 mb-n1 grey--text font-italic text-body-2"
          v-if="typers.length > 0"
          ><span
            v-for="(user, index) in typers"
            :key="index"
            :style="{ color: user.color }"
            >{{ user.user }}<span v-if="typers.length - 1 != index">, </span>
          </span>
          is typing...</span
        >
      </v-fade-transition>
      <v-layout justify-center align-center text-center px-4 v-if="current_dm">
        <v-flex xs10>
          <v-text-field
            hide-details="auto"
            :style="{ marginTop: typers.length > 0 ? '0px' : '24px' }"
            @keypress="startTyping()"
            @keypress.enter="sendChat()"
            v-model="new_message"
            :label="`Message ${current_dm_person}...`"
          ></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-btn
            :style="{ marginTop: typers.length > 0 ? '0px' : '24px' }"
            :disabled="new_message == ''"
            text
            icon
            @click="sendChat()"
            ><v-icon>mdi-send</v-icon></v-btn
          >
          <v-btn
            :style="{ marginTop: typers.length > 0 ? '0px' : '24px' }"
            text
            icon
            @click="uploader = true"
            ><v-icon>mdi-paperclip</v-icon></v-btn
          >
        </v-flex>
      </v-layout>
    </main>

    <!-- Home -->
    <main v-if="current_id === 'user_home'" class="text-center">
      <v-row>
        <v-col sm="12" class="deep-orange py-12 elevation-5">
          <h1 class="text-h2 font-weight-thin white--text hidden-sm-and-down">
            Welcome to Flamechat!
          </h1>
          <h1 class="text-h3 font-weight-thin white--text hidden-md-and-up">
            Welcome to Flamechat!
          </h1>
        </v-col>
        <v-col sm="12">
          <p class="title font-weight-regular px-6 pt-6">
            Select a chatroom from the left.
          </p>
          <v-btn color="deep-orange" @click="buy_chatroom.popup = true"
            >Buy a Chatroom</v-btn
          >
        </v-col>
      </v-row>
      <v-divider width="500" class="mx-auto"></v-divider>
      <p class="mt-8 px-4">
        Direct messages are accessible under the Home button.
      </p>
      <!-- <p class="mt-8 px-4">Here are some pre-made chatrooms. Their ID is below the summary. Type that ID in the Add field above the home icon.</p>
      <v-container fluid>
        <v-row>
          <v-col lg="6" xs="12" cols="12">
            <div class="mt-6">
              <h3 class="text-h4">General</h3>
              <p class="mt-4 mb-1">General, miscellaneous chit-chat.</p>
              <p class="font-weight-thin">general</p>
            </div>
            <v-divider></v-divider>
          </v-col>

          <v-col lg="6" xs="12">
            <div class="mt-6">
              <h3 class="text-h4">Dev</h3>
              <p class="mt-4 mb-1">This chatroom is for discussing upcoming features, software, and tools from Paradigm.</p>
              <p class="font-weight-thin">dev</p>
            </div>
            <v-divider></v-divider>
          </v-col>
        </v-row>

        <v-row>
          <v-col lg="6" xs="12" cols="12">
            <div class="mt-6">
              <h3 class="text-h4">News</h3>
              <p class="mt-4 mb-1">Keep yourself up to date with the latest happenings around the world.</p>
              <p class="font-weight-thin">news</p>
            </div>
            <v-divider></v-divider>
          </v-col>

          <v-col lg="6" xs="12">
            <div class="mt-6">
              <h3 class="text-h4">Politics</h3>
              <p class="mt-4 mb-1">Discuss politics in a civilized manner here. Challenge your political opposites.</p>
              <p class="font-weight-thin">politics</p>
            </div>
            <v-divider></v-divider>
          </v-col>
        </v-row>

        <v-row>
          <v-col xs="12">
            <div class="mt-6">
              <h3 class="text-h4">Tech</h3>
              <p class="mt-4 mb-1">Talk about new developments in the world of technology.</p>
              <p class="font-weight-thin">tech</p>
            </div>
          </v-col>
        </v-row>
      </v-container> -->
    </main>

    <v-dialog
      v-model="edit.open"
      max-width="350"
      @click:outside="edit = { open: false }"
    >
      <v-card style="text-align: center">
        <v-card-title class="text-h5 font-weight-medium"
          >EDIT CHAT</v-card-title
        >
        <v-card-text>
          <v-text-field
            hide-details="auto"
            @keypress.enter="editChatSave()"
            v-model="edit.content"
            label="Message content"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="red" @click="deleteChat(edit), (edit.open = false)"
            >Delete</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn text color="blue accent-1" @click="editChatSave()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="buy_chatroom.popup"
      max-width="450"
      style="z-index: 1001;"
    >
      <v-card>
        <v-card-title>
          <v-card-title class="text-h5 font-weight-medium ma-0 pa-0"
            >BUY A CHATROOM</v-card-title
          >
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="buy_chatroom.popup = false"
            class="dialog-close-btn"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-text-field
            hide-details="auto"
            class="mb-4"
            v-model="buy_chatroom.name"
            label="Chatroom Name"
          ></v-text-field>
          <p>Chatroom Color</p>
          <v-color-picker
            mode="hexa"
            hide-mode-switch
            class="mt-3 mb-3 elevation-0"
            v-model="buy_chatroom.theme"
          ></v-color-picker>
          <p>Icon selection is not ready yet.</p>
          <div v-if="$root.user.moonrocks > 50">
            <img
              src="@/assets/moonrocks.png"
              alt="Moonrocks"
              class="moonrock-img"
            /><span class="moonrock-count font-weight-medium red--text"
              >- 50</span
            >
            <p class="green--text">
              You have enough moonrocks to purchase a chatroom.
            </p>
            <p class="mb-0">
              New Balance:
              <span class="font-weight-light"
                >{{ $root.user.moonrocks - 50 }} Moonrocks</span
              >
            </p>
          </div>
          <div v-if="$root.user.moonrocks == 50">
            <img
              src="@/assets/moonrocks.png"
              alt="Moonrocks"
              class="moonrock-img"
            /><span class="moonrock-count font-weight-medium red--text"
              >- 50</span
            >
            <p class="orange--text mb-0">
              You have just enough moonrocks to purchase a chatroom.
            </p>
          </div>
          <div v-if="$root.user.moonrocks < 50">
            <img
              src="@/assets/moonrocks.png"
              alt="Moonrocks"
              class="moonrock-img"
            /><span class="moonrock-count font-weight-medium red--text"
              >- 50</span
            >
            <p class="red--text mb-0">
              You do <b>not</b> have enough moonrocks to purchase a chatroom.
            </p>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-btn
            @click="buy_chatroom = { popup: false }"
            text
            color="grey darken-1"
            >Cancel</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn @click="buyChatroom()" color="blue accent-1" text>Buy</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="delete_verify_popup" max-width="350">
      <v-card color="orange">
        <v-card-title class="text-h5 font-weight-medium">CONFIRM</v-card-title>
        <v-card-text
          >Are you sure you want to delete this chatroom? A refund will not be
          issued.</v-card-text
        >
        <v-card-actions>
          <v-btn @click="delete_verify_popup = false" color="grey darken-1" text
            >Cancel</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn @click="deleteChatroom()" color="white" text>Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="purge_confirm" max-width="350">
      <v-card color="orange">
        <v-card-title class="text-h5 font-weight-medium">CONFIRM</v-card-title>
        <v-card-text
          >Are you sure you want to purge this chatroom? All messages will be
          deleted.</v-card-text
        >
        <v-card-actions>
          <v-btn @click="purge_confirm = false" color="grey darken-2" text
            >Cancel</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn @click="purgeChatroom()" color="white" text>Yes</v-btn>
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
            prepend-icon=""
            id="file"
            ref="file"
            v-model="file"
            multiple
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
          <v-btn @click="uploadFileAndSend()" color="blue accent-1" text
            >Upload</v-btn
          >
        </v-card-actions>
        <v-progress-linear
          :active="upload_file_loading"
          :indeterminate="true"
          absolute
          bottom
          color="deep-purple accent-4"
        ></v-progress-linear>
      </v-card>
    </v-dialog>

    <v-dialog
      v-if="current && !current_dm"
      v-model="people_dialog"
      style="z-index: 1000;"
      max-width="500"
    >
      <v-card>
        <v-card-title class="text-h5 font-weight-medium">PEOPLE</v-card-title>
        <v-card-text>
          Approved
          <v-list>
            <v-list-item v-if="current.people.approved.length <= 0">
              <v-list-item-title class="text-center grey--text font-italic"
                >Nobody is in this chatroom.</v-list-item-title
              >
            </v-list-item>

            <v-list-item
              v-for="(person, index) in current.people.approved"
              :key="index"
            >
              <v-list-item-avatar
                ><v-img
                  loading="lazy"
                  :src="
                    `https://www.theparadigmdev.com/relay/profile-pics/${message.user_id}.jpg`
                  "
                ></v-img
              ></v-list-item-avatar>
              <v-row>
                <v-col sm="8" class="py-0">
                  <v-list-item-content>
                    <v-list-item-title
                      class="font-weight-medium"
                      :style="{ color: person.color }"
                      >{{ person.username }}</v-list-item-title
                    >
                    <v-list-item-subtitle>{{
                      person._id
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-col>
                <v-col sm="4" align-self="center" class="text-right py-0">
                  <v-btn icon color="red" @click="removePerson(person._id)"
                    ><v-icon>mdi-close</v-icon></v-btn
                  >
                </v-col>
              </v-row>
            </v-list-item>
          </v-list>

          Requested
          <v-list>
            <v-list-item v-if="current.people.requested.length <= 0">
              <v-list-item-title class="text-center grey--text font-italic"
                >Nobody has requested to join this chatroom.</v-list-item-title
              >
            </v-list-item>

            <v-list-item
              v-for="(person, index) in current.people.requested"
              :key="index"
            >
              <v-list-item-avatar
                ><v-img
                  loading="lazy"
                  :src="
                    `https://www.theparadigmdev.com/relay/profile-pics/${message.user_id}.jpg`
                  "
                ></v-img
              ></v-list-item-avatar>
              <v-row>
                <v-col sm="8" class="py-0">
                  <v-list-item-content>
                    <v-list-item-title
                      class="font-weight-medium"
                      :style="{ color: person.color }"
                      >{{ person.username }}</v-list-item-title
                    >
                    <v-list-item-subtitle>{{
                      person._id
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-col>
                <v-col sm="4" align-self="center" class="text-right py-0">
                  <v-btn icon color="green" @click="approveRequest(person._id)"
                    ><v-icon>mdi-check</v-icon></v-btn
                  >
                  <v-btn icon color="red" @click="rejectRequest(person._id)"
                    ><v-icon>mdi-close</v-icon></v-btn
                  >
                </v-col>
              </v-row>
            </v-list-item>
          </v-list>

          Banned
          <v-list>
            <v-list-item v-if="current.people.banned.length <= 0">
              <v-list-item-title class="text-center grey--text font-italic"
                >Nobody has been banned in this chatroom.</v-list-item-title
              >
            </v-list-item>

            <v-list-item
              v-for="(person, index) in current.people.banned"
              :key="index"
            >
              <v-list-item-avatar
                ><v-img
                  loading="lazy"
                  :src="
                    `https://www.theparadigmdev.com/relay/profile-pics/${message.user_id}.jpg`
                  "
                ></v-img
              ></v-list-item-avatar>
              <v-row>
                <v-col sm="8" class="py-0">
                  <v-list-item-content>
                    <v-list-item-title
                      class="font-weight-medium"
                      :style="{ color: person.color }"
                      >{{ person.username }}</v-list-item-title
                    >
                    <v-list-item-subtitle>{{
                      person._id
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-col>
                <v-col sm="4" align-self="center" class="text-right py-0">
                  <v-btn icon color="green" @click="unban(person._id)"
                    ><v-icon>mdi-minus</v-icon></v-btn
                  >
                </v-col>
              </v-row>
            </v-list-item>
          </v-list>
          <v-row no-gutters>
            <v-col sm="10">
              <v-autocomplete
                v-model="ban_username"
                :items="people"
                :search-input.sync="search"
                hide-no-data
                label="Username"
                clearable
                item-text="username"
                item-color="color"
              ></v-autocomplete>
            </v-col>
            <v-col class="mt-4 text-center" sm="2"
              ><v-btn
                color="blue lighten-1"
                icon
                @click="ban()"
                :disabled="!ban_username"
                ><v-icon>mdi-cancel</v-icon></v-btn
              ></v-col
            >
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import io from "socket.io-client";
import moment from "moment";
import draggable from "vuedraggable";

var socket;
var typingTimeout;
export default {
  name: "Flamechat",
  data() {
    return {
      current: false,
      add_chatroom_id: "",
      current_index: null,
      current_id: "user_home",
      current_dm: "",
      current_dm_person: "",
      current_message: false,
      new_message: "",
      buy_chatroom: {
        popup: false,
        name: "",
        theme: "#FF0000",
      },
      edit: { open: false },
      chatroom_menu: { open: false },
      delete_verify_popup: false,
      socket,
      typers: [],
      current_status: "",
      people_dialog: false,
      ban_username: "",
      purge_confirm: false,
      uploader: false,
      file: null,
      window,
      search: "",
      people: [],
      upload_file_loading: false,
    };
  },
  components: {
    draggable,
  },
  computed: {
    approved_friends() {
      var friends = [];
      this.$root.user.people.approved.forEach(async (person) => {
        const index = this.people.findIndex((p) => {
          return p._id == person._id;
        });
        person.in = this.people[index].in;
        friends.push(person);
      });
      return friends;
    },
  },
  methods: {
    async changeChatroom(from, to) {
      this.current = false;
      this.current_dm = this.approved_friends[0]._id;
      this.current_dm_person = this.approved_friends[0].username;
      if (from) socket.disconnect();
      socket = await io.connect(
        `https://www.theparadigmdev.com/flamechat/${to.id}`
      );
      this.current_status = to.status;
      socket.on("data", (data) => {
        this.current = data;
        if (this.$root.user.chatrooms) {
          this.current_index = this.$root.user.chatrooms.findIndex(
            (chatroom) => {
              return chatroom.id == to.id;
            }
          );
          if (
            this.$root.user.chatrooms[this.current_index].status == "requested"
          )
            socket.emit("people", to.id);
        }
      });
      socket.on("send", (data) => {
        this.current.messages.push(data);
      });
      socket.on("delete", async (id) => {
        var index = await this.current.messages.findIndex((message) => {
          return message._id == id;
        });
        await this.current.messages.splice(index, 1);
      });
      socket.on("edit", async (data) => {
        var index = await this.current.messages.findIndex((message) => {
          return message._id == data.oldID;
        });
        this.current.messages[index] = data;
      });
      socket.on("kill", async () => {
        this.leaveChatroom();
      });
      socket.on("typing", (data) => {
        let filteredData = data;
        let exists = false;
        filteredData.forEach((user) => {
          if (user.user == this.$root.user.username) exists = true;
        });
        if (exists) {
          const index = filteredData.findIndex((user) => {
            return this.$root.user.username == user.user;
          });
          filteredData.splice(index, 1);
        }
        this.typers = filteredData;
      });
      socket.on("people", (data) => (this.current.people = data));
      socket.on("purge", () => (this.current.messages = []));
    },
    async changeDM(from, to) {
      this.current = false;
      if (from) socket.disconnect();
      socket = await io.connect(
        `https://www.theparadigmdev.com/flamechat/${to.dm}`
      );
      this.current_dm_person = to.username;
      socket.on("data", (data) => {
        this.current = data;
      });
      socket.on("send", (data) => {
        this.current.messages.push(data);
      });
      socket.on("delete", async (id) => {
        var index = await this.current.messages.findIndex((message) => {
          return message._id == id;
        });
        await this.current.messages.splice(index, 1);
      });
      socket.on("edit", async (data) => {
        var index = await this.current.messages.findIndex((message) => {
          return message._id == data.oldID;
        });
        this.current.messages[index] = data;
      });
      socket.on("kill", async () => {
        this.leaveChatroom();
      });
      socket.on("typing", (data) => {
        let filteredData = data;
        let exists = false;
        filteredData.forEach((user) => {
          if (user.user == this.$root.user.username) exists = true;
        });
        if (exists) {
          const index = filteredData.findIndex((user) => {
            return this.$root.user.username == user.user;
          });
          filteredData.splice(index, 1);
        }
        this.typers = filteredData;
      });
    },
    buyChatroom() {
      this.$http
        .post("https://www.theparadigmdev.com/api/flamechat/chatroom/new", {
          icon: "mdi-forum",
          name: this.buy_chatroom.name,
          owner: this.$root.user._id,
          theme: this.buy_chatroom.theme,
        })
        .then((response) => {
          this.$root.socket.emit("new_chatroom");
          this.$http.get(
            `https://www.theparadigmdev.com/api/users/${this.$root.user._id}/moonrocks/-50`
          );
          this.$root.user.chatrooms.push(response.data);
          this.changeChatroom(false, response.data.id);
          this.buy_chatroom = {
            popup: false,
            name: "",
            theme: "",
          };
        })
        .catch((error) => console.error(error));
    },
    addChatroom() {
      this.$http
        .get(
          `https://www.theparadigmdev.com/api/users/${this.$root.user._id}/chatroom/${this.add_chatroom_id}/request`
        )
        .then((response) => {
          if (!response.data.error) {
            this.$root.user = response.data;
            this.add_chatroom_id = "";
          } else
            this.$notify(
              "You cannot join this chatroom",
              "error",
              "mdi-cancel",
              true,
              3000
            );
        })
        .catch((error) => console.error(error));
    },
    sendChat() {
      if (this.new_message.length > 0) {
        clearTimeout(typingTimeout);
        socket.emit("typing", {
          user: this.$root.user.username,
          is: false,
          color: this.$root.user.color,
        });
        socket.emit("send", {
          color: this.$root.user.color,
          username: this.$root.user.username,
          user_id: this.$root.user._id,
          content: this.new_message,
          timestamp: moment().format("MM/DD/YYYY [at] h:mm a"),
          edits: 0,
          type: "message",
        });
        this.new_message = "";
      }
    },
    deleteChat(chat) {
      socket.emit("delete", chat._id);
    },
    editChat(chat) {
      this.edit = chat;
      this.edit.open = true;
    },
    editChatSave() {
      console.log(this.edit);
      socket.emit("edit", this.edit);
      this.edit = { open: false };
    },
    showChatroomMenu(e, id) {
      console.log(id);
      this.$http
        .get(`https://www.theparadigmdev.com/api/flamechat/chatroom/${id}`)
        .then((response) => {
          this.chatroom_menu = {
            x: e.clientX,
            y: e.clientY,
            open: false,
            id: id,
            _id: response.data._id,
            name: response.data.name,
            owner: response.data.owner,
          };
          this.$nextTick(() => {
            this.chatroom_menu.open = true;
          });
        });
    },
    leaveChatroom() {
      if (this.$root.user._id != this.current.owner) {
        this.$http
          .get(
            `https://www.theparadigmdev.com/api/users/${this.$root.user._id}/chatroom/${this.chatroom_menu.id}/leave`
          )
          .then((response) => {
            this.$root.user = response.data;
            socket.emit("send", {
              color: this.$root.user.color,
              username: this.$root.user.username,
              user_id: this.$root.user._id,
              timestamp: moment().format("MM/DD/YYYY [at] h:mm a"),
              type: "left",
            });
            this.current_id = "user_home";
            this.current = false;
          });
      } else
        this.$notify(
          "You can&#39;t leave this chatroom, you own it!",
          "warning",
          "mdi-warning",
          true,
          3000
        );
    },
    async deleteChatroom() {
      if (
        this.chatroom_menu.owner == this.$root.user._id ||
        this.$root.user.rights.admin == true
      ) {
        this.changeChatroom(false, this.chatroom_menu.id);
        socket.emit("kill");
        this.leaveChatroom();
        this.$notify("Chatroom deleted", "info", "mdi-delete", false, 3000);
        this.delete_verify_popup = false;
        await this.$http.get(
          `https://www.theparadigmdev.com/api/flamechat/chatroom/${this.chatroom_menu.id}/delete`
        );
      }
    },
    startTyping() {
      clearTimeout(typingTimeout);
      socket.emit("typing", {
        user: this.$root.user.username,
        is: true,
        color: this.$root.user.color,
      });
      typingTimeout = setTimeout(
        () =>
          socket.emit("typing", { user: this.$root.user.username, is: false }),
        3000
      );
    },
    viewProfile(uid) {
      this.$root.user.people.blocked.forEach((person) => {
        if (person._id != uid) {
          if (uid == this.$root.user._id) this.$root.router = "account";
          else {
            this.$http
              .get(`https://www.theparadigmdev.com/api/users/${uid}/info`)
              .then((response) => {
                if (!response.data.error) {
                  this.$root.profile = response.data;
                  this.$root.router = "people";
                } else
                  this.$notify(
                    response.data.error,
                    "error",
                    "mdi-alert-circle",
                    false,
                    3000
                  );
              });
          }
        } else
          this.$notify(
            "You blocked this person",
            "warning",
            "mdi-account-cancel",
            false,
            3000
          );
      });
    },
    removePerson(id) {
      if (id != this.current.owner) {
        this.$http
          .get(
            `https://www.theparadigmdev.com/api/flamechat/chatroom/${this.current_id}/remove/${id}`
          )
          .then((response) => {
            socket.emit("send", {
              color: response.data.color,
              username: response.data.username,
              user_id: response.data._id,
              timestamp: moment().format("MM/DD/YYYY [at] h:mm a"),
              type: "left",
            });
            socket.emit("people", this.current_id);
          });
      } else
        this.$notify(
          "You can&#39;t remove this person, they own this chatroom!",
          "warning",
          "mdi-warning",
          true,
          3000
        );
    },
    approveRequest(id) {
      this.$http
        .get(
          `https://www.theparadigmdev.com/api/flamechat/chatroom/${this.current_id}/request/${id}/approve`
        )
        .then((response) => {
          socket.emit("send", {
            color: response.data.color,
            username: response.data.username,
            user_id: response.data._id,
            timestamp: moment().format("MM/DD/YYYY [at] h:mm a"),
            type: "join",
          });
          socket.emit("people", this.current_id);
        })
        .catch((error) => console.error(error));
    },
    rejectRequest(id) {
      this.$http
        .get(
          `https://www.theparadigmdev.com/api/flamechat/chatroom/${this.current_id}/request/${id}/reject`
        )
        .then(() => socket.emit("people", this.current_id))
        .catch((error) => console.error(error));
    },
    ban() {
      this.$http
        .get(
          `https://www.theparadigmdev.com/api/flamechat/chatroom/${this.current_id}/ban/${this.ban_username}`
        )
        .then(() => socket.emit("people", this.current_id))
        .catch((error) => console.error(error));
    },
    unban(id) {
      this.$http
        .get(
          `https://www.theparadigmdev.com/api/flamechat/chatroom/${this.current_id}/unban/${id}`
        )
        .then(() => socket.emit("people", this.current_id))
        .catch((error) => console.error(error));
    },
    purgeChatroom() {
      this.$http
        .get(
          `https://www.theparadigmdev.com/api/flamechat/chatroom/${this.current_id}/purge`
        )
        .then(() => {
          socket.emit("purge");
          this.purge_confirm = false;
        })
        .catch((error) => console.error(error));
    },
    uploadFileAndSend() {
      this.upload_file_loading = true;
      let formData = new FormData();
      formData.append("file", this.file[0]);
      if (this.current_dm) {
        this.$http
          .post(
            `https://www.theparadigmdev.com/api/flamechat/dm/${this.current_dm}/file`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((response) => {
            let data = {
              color: this.$root.user.color,
              username: this.$root.user.username,
              user_id: this.$root.user._id,
              timestamp: moment().format("MM/DD/YYYY [at] h:mm a"),
              content: this.file[0].name,
              url: `https://www.theparadigmdev.com/relay/flamechat/dm/${this.current_dm}/${this.file[0].name}`,
              type: "",
            };
            if (this.file.type.includes("image")) data.type = "image";
            else if (this.file.type.includes("video")) data.type = "video";
            else data.type = "file";
            socket.emit("send", data);
            this.upload_file_loading = false;
            this.file = null;
            this.uploader = false;
          })
          .catch((error) => {
            console.log("Upload: failed", error);
            this.file = null;
          });
      } else {
        this.$http
          .post(
            `https://www.theparadigmdev.com/api/flamechat/chatroom/${this.current_id}/file`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((response) => {
            let data = {
              color: this.$root.user.color,
              username: this.$root.user.username,
              user_id: this.$root.user._id,
              timestamp: moment().format("MM/DD/YYYY [at] h:mm a"),
              content: this.file[0].name,
              url: `https://www.theparadigmdev.com/relay/flamechat/chatroom/${this.current_id}/${this.file[0].name}`,
              type: "",
            };
            if (this.file[0].type.includes("image")) data.type = "image";
            else if (this.file[0].type.includes("video")) data.type = "video";
            else data.type = "file";
            socket.emit("send", data);
            this.upload_file_loading = false;
            this.file = null;
            this.uploader = false;
          })
          .catch((error) => {
            console.log("Upload: failed", error);
            this.file = null;
          });
      }
    },
    saveChatroomOrder() {
      this.$http
        .post(
          `https://www.theparadigmdev.com/api/users/${this.$root.user._id}/chatroomOrder`,
          this.$root.user.chatrooms
        )
        .then((response) => {
          this.$root.user = response.data;
        });
    },
  },
  async mounted() {
    this.$http
      .get("https://www.theparadigmdev.com/api/users/shortlist")
      .then((response) => (this.people = response.data));

    if (this.$root.url[1] == "flamechat") {
      if (this.$root.url[2] != "dm") {
        await this.$root.user.chatrooms.forEach(async (chatroom) => {
          if (this.$root.url[2] == chatroom.id) {
            await this.changeChatroom(this.current, chatroom);
            this.current_id = this.$root.url[2];
          }
        });
      } else {
        await this.$root.user.people.approved.forEach(async (person) => {
          if (this.$root.url[3] == person.username) {
            await this.changeDM(this.current, person);
            this.current_dm = person.dm;
            this.current_id = "user_dm";
            this.current_dm_person = person.username;
          }
        });
      }
    }
  },
  beforeDestroy() {
    this.current = false;
    this.current_id = "user_home";
  },
};
</script>

<style scoped>
main {
  margin-left: 74px;
}

.v-sheet:not(.v-card):not(.v-toolbar):not(.chatroom-menu):not(.v-select-list) {
  background: none !important;
}
</style>
