<template>
  <div class="flamechat">
    <v-navigation-drawer style="width: 74px;" permanent mini-variant absolute>
      <v-list rounded>
        <v-text-field class="mt-0" @keypress.enter="addChatroom()" v-model="add_chatroom_id" label="Add..."></v-text-field>
        <v-list-item-group mandatory v-model="current_id">
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-list-item class="my-2" ripple v-on="on" value="user_home" @click="current = false">
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
          <!-- <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-list-item class="my-2" :v-ripple="true" v-on="on" value="user_dm">
                <v-list-item-icon>
                  <v-icon>mdi-message-lock</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <span>Direct Messages</span>
          </v-tooltip> -->
          <v-divider></v-divider>
          <v-tooltip right v-for="(chatroom, index) in $root.user.chatrooms" :key="index">
            <template v-slot:activator="{ on }">
              <v-list-item class="my-2" :v-ripple="true" v-on="on" :value="chatroom.id" @contextmenu.prevent="showChatroomMenu($event, chatroom.id)" @click="changeChatroom(current.id, chatroom.id)">
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
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-menu v-model="chatroom_menu.open" v-if="chatroom_menu.open" :position-x="chatroom_menu.x" :position-y="chatroom_menu.y" absolute offset-y>
      <v-list dense class="chatroom-menu">
        <v-list-item @click="$noFunc()">
          <v-list-item-icon><v-icon class="blue--text darken-2">mdi-account-multiple-plus</v-icon></v-list-item-icon>
          <v-list-item-title class="blue--text darken-2">Invite a friend</v-list-item-title>
        </v-list-item>
        <v-list-item @click="leaveChatroom()">
          <v-list-item-icon><v-icon class="deep-orange--text">mdi-exit-run</v-icon></v-list-item-icon>
          <v-list-item-title class="deep-orange--text">Leave chatroom</v-list-item-title>
        </v-list-item>
        <v-list-item @click="$noFunc()">
          <v-list-item-icon><v-icon>mdi-content-copy</v-icon></v-list-item-icon>
          <v-list-item-title>Copy ID</v-list-item-title>
        </v-list-item>
        <v-divider v-if="$root.user.username == chatroom_menu.owner || $root.user.rights.admin == true"></v-divider>
        <v-list-item @click="delete_verify_popup = true" v-if="$root.user.username == chatroom_menu.owner || $root.user.rights.admin == true">
          <v-list-item-icon><v-icon class="red--text">mdi-delete</v-icon></v-list-item-icon>
          <v-list-item-title class="red--text">Delete chatroom</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <main v-if="!current_id.includes('user_')">
      <v-toolbar dense :style="{ backgroundColor: current.theme }">
        <v-toolbar-title>Flamechat</v-toolbar-title>
      </v-toolbar>
      <!-- <v-btn @click="createChatroom()">create</v-btn> -->

      <v-list class="messages" v-chat-scroll="{ always: false, smooth: true }" v-if="$vuetify.breakpoint.smAndUp">
        <v-fade-transition group>
          <v-list-item class="d-none" :key="-1"></v-list-item>
          <v-list-item @mouseover="current_message = message" @mouseleave="current_message = false" @dblclick="deleteChat(message._id)" v-for="(message, index) in current.messages" :key="index">
            <v-row v-if="message.type === 'message'">
              <v-col sm="1" class="text-right">
                <v-list-item-avatar @click="viewProfile(message.user_id)" class="mr-0"><v-img :src="message.pic"></v-img></v-list-item-avatar>
              </v-col>
              <v-col sm="10">
                <v-list-item-content>
                  <p v-html="message.content"></p>
                  <v-list-item-subtitle><span class="pr-2" :style="{ color: message.color }">{{ message.username }}</span>|<span class="px-2">{{ message.timestamp }}</span><span v-if="message.edits != 0">|<span class="pl-2">{{ message.edits }} {{ message.edits > 1 ? 'edits' : 'edit' }}</span></span></v-list-item-subtitle>
                </v-list-item-content>
              </v-col>
              <v-col sm="1">
                <v-fade-transition group>
                  <v-btn key="edit" v-if="current_message == message ? message.user_id == $root.user._id ? true : current.owner_id == $root.user._id ? true : $root.user.rights.admin ? true : false : false" small icon color="grey darken-3" @click="editChat(message)"><v-icon>mdi-pencil</v-icon></v-btn>
                  <v-btn key="delete" v-if="current_message == message ? message.user_id == $root.user._id ? true : current.owner_id == $root.user._id ? true : $root.user.rights.admin ? true : false : false" small icon color="grey darken-3" @click="deleteChat(message)"><v-icon>mdi-delete</v-icon></v-btn>
                </v-fade-transition>
              </v-col>
            </v-row>

            <v-list-item-subtitle class="text-center" v-if="message.type === 'left'"><span :style="{ color: message.color }">{{ message.username }}</span> has left</v-list-item-subtitle>
            <v-list-item-subtitle class="text-center" v-if="message.type === 'join'"><span :style="{ color: message.color }">{{ message.username }}</span> has joined</v-list-item-subtitle>
          </v-list-item>
        </v-fade-transition>
      </v-list>

      <v-list class="messages" three-line v-chat-scroll="{ always: false, smooth: true }" v-if="$vuetify.breakpoint.xsOnly">
        <v-fade-transition group>
          <v-list-item class="d-none" :key="-1"></v-list-item>
          <v-list-item @mouseover="current_message = message" @mouseleave="current_message = false" @dblclick="deleteChat(message._id)" v-for="(message, index) in current.messages" :key="index">
            <v-container fluid v-if="message.type === 'message'">
              <v-row no-gutters align="end">
                <v-col sm="6">
                  <v-list-item-avatar class="ma-0"><v-img :src="message.pic"></v-img></v-list-item-avatar>
                </v-col>
                <v-col sm="6" class="text-right">
                  <v-fade-transition group>
                    <v-btn key="edit" v-if="current_message == message ? message.user_id == $root.user._id ? true : current.owner_id == $root.user._id ? true : $root.user.rights.admin ? true : false : false" small icon color="grey darken-3" @click="editChat(message)"><v-icon>mdi-pencil</v-icon></v-btn>
                    <v-btn key="delete" v-if="current_message == message ? message.user_id == $root.user._id ? true : current.owner_id == $root.user._id ? true : $root.user.rights.admin ? true : false : false" small icon color="grey darken-3" @click="deleteChat(message)"><v-icon>mdi-delete</v-icon></v-btn>
                  </v-fade-transition>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col sm="12">
                  <v-list-item-content>
                    <p v-html="message.content"></p>
                    <v-list-item-subtitle><span class="pr-2" :style="{ color: message.color }">{{ message.username }}</span>|<span class="px-2">{{ message.timestamp }}</span><span v-if="message.edits != 0">|<span class="pl-2">{{ message.edits }} {{ message.edits > 1 ? 'edits' : 'edit' }}</span></span></v-list-item-subtitle>
                  </v-list-item-content>
                </v-col>
              </v-row>
            </v-container>

            <v-list-item-subtitle class="text-center" v-if="message.type === 'left'"><span :style="{ color: message.color }">{{ message.username }}</span> has left</v-list-item-subtitle>
            <v-list-item-subtitle class="text-center" v-if="message.type === 'join'"><span :style="{ color: message.color }">{{ message.username }}</span> has joined</v-list-item-subtitle>
          </v-list-item>
        </v-fade-transition>
      </v-list>

      <span class="ml-4 mb-n1 grey--text font-italic body-2" v-if="typers.length > 0"><span v-for="(user, index) in typers" :key="index" :style="{ color: user.color }">{{ user.user }}<span v-if="typers.length - 1 != index">, </span> </span> is typing...</span>
      <v-layout justify-center align-center text-center px-4>
        <v-flex xs11>
          <v-text-field :style="{ marginTop: typers.length > 0 ? '0px' : '24px' }" @keypress="startTyping()" @keypress.enter="sendChat()" v-model="new_message" :label="`Message ${current.name}...`"></v-text-field>
        </v-flex>
        <v-flex xs1>
          <v-btn :style="{ marginTop: typers.length > 0 ? '0px' : '24px' }" text icon @click="sendChat()"><v-icon>mdi-send</v-icon></v-btn>
        </v-flex>
      </v-layout>
    </main>

    <main v-else-if="current_id === 'user_dm'" class="fill-height" style="margin-left: 330px;">
      <v-toolbar dense color="deep-orange">
        <v-toolbar-title>Flamechat: Direct Messages</v-toolbar-title>
      </v-toolbar>

      <v-navigation-drawer absolute style="left: +74px;">
        <v-list nav rounded class="fill-height">
          <v-list-item-group v-model="current_dm">
            <p class="text-center grey--text font-italic mt-12" v-if="$root.user.friends.length < 1">You have no friends.</p>
            <v-list-item v-for="(friend, index) in $root.user.friends" :key="index" :value="friend">
              <v-list-item-avatar><v-img :src="friend.pic"></v-img></v-list-item-avatar>
              <v-list-item-title class="text-uppercase font-weight-medium" :style="{ color: friend.color }">{{ friend.username }}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <!-- <v-list class="messages" v-chat-scroll>
        <v-list-item @dblclick="deleteChat(message._id)" v-for="(message, index) in current_dm.messages" :key="index">
          <v-list-item-avatar><v-img :src="message.pic"></v-img></v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ message.content }}</v-list-item-title>
            <v-list-item-subtitle>{{ message.username }}&nbsp;&nbsp;|&nbsp;&nbsp;{{ message.timestamp }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-layout justify-center align-center text-center px-4>
        <v-flex xs11>
          <v-text-field @keypress.enter="sendChat()" v-model="new_message" :label="`Message ${current_dm.username}...`"></v-text-field>
        </v-flex>
        <v-flex xs1>
          <v-btn text icon @click="sendChat()"><v-icon>mdi-send</v-icon></v-btn>
        </v-flex>
      </v-layout> -->
    </main>
    
    <main v-else-if="current_id === 'user_home'" class="text-center">
      <v-container fluid class="text-center pt-0 mb-4">
        <v-row>
          <v-col sm="12" class="deep-orange py-12 elevation-5">
            <h1 class="display-3 font-weight-thin white--text hidden-sm-and-down">Welcome to Flamechat!</h1>
            <h1 class="display-2 font-weight-thin white--text hidden-md-and-up">Welcome to Flamechat!</h1>
          </v-col>
          <v-col sm="12">
            <p class="title font-weight-regular px-6 pt-6">Select a chatroom from the left.</p>
            <v-btn color="deep-orange" @click="buy_chatroom.popup = true">Buy a Chatroom</v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-divider width="500" class="mx-auto"></v-divider>
      <p class="mt-8 px-4">Direct messages and friends are coming soon.</p>
      <!-- <p class="mt-8 px-4">Here are some pre-made chatrooms. Their ID is below the summary. Type that ID in the Add field above the home icon.</p>
      <v-container fluid>
        <v-row>
          <v-col lg="6" xs="12" cols="12">
            <div class="mt-6">
              <h3 class="display-1">General</h3>
              <p class="mt-4 mb-1">General, miscellaneous chit-chat.</p>
              <p class="font-weight-thin">general</p>
            </div>
            <v-divider></v-divider>
          </v-col>

          <v-col lg="6" xs="12">
            <div class="mt-6">
              <h3 class="display-1">Dev</h3>
              <p class="mt-4 mb-1">This chatroom is for discussing upcoming features, software, and tools from Paradigm.</p>
              <p class="font-weight-thin">dev</p>
            </div>
            <v-divider></v-divider>
          </v-col>
        </v-row>

        <v-row>
          <v-col lg="6" xs="12" cols="12">
            <div class="mt-6">
              <h3 class="display-1">News</h3>
              <p class="mt-4 mb-1">Keep yourself up to date with the latest happenings around the world.</p>
              <p class="font-weight-thin">news</p>
            </div>
            <v-divider></v-divider>
          </v-col>

          <v-col lg="6" xs="12">
            <div class="mt-6">
              <h3 class="display-1">Politics</h3>
              <p class="mt-4 mb-1">Discuss politics in a civilized manner here. Challenge your political opposites.</p>
              <p class="font-weight-thin">politics</p>
            </div>
            <v-divider></v-divider>
          </v-col>
        </v-row>

        <v-row>
          <v-col xs="12">
            <div class="mt-6">
              <h3 class="display-1">Tech</h3>
              <p class="mt-4 mb-1">Talk about new developments in the world of technology.</p>
              <p class="font-weight-thin">tech</p>
            </div>
          </v-col>
        </v-row>
      </v-container> -->
    </main>

    <v-dialog v-model="edit.open" max-width="300" @click:outside="edit = { open: false }">
      <v-card style="text-align: center">
        <v-card-title>Edit Chat</v-card-title>
        <v-card-text>
          <v-text-field @keypress.enter="editChatSave()" v-model="edit.content" label="Message content"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="red" @click="deleteChat(edit)">Delete</v-btn>
          <v-spacer></v-spacer>
          <v-btn text color="blue accent-1" @click="editChatSave()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="buy_chatroom.popup" max-width="450" style="z-index: 1001;">
			<v-card>
				<v-card-title>
					<h3 class="headline mb-0">Buy a Chatroom</h3>
					<v-spacer></v-spacer>
					<v-btn icon @click="buy_chatroom.popup = false" class="dialog-close-btn">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text>
					<p>Chatroom ID: <span class="font-weight-light">{{ buy_chatroom_id }}</span></p>
					<v-text-field v-model="buy_chatroom.name" label="Chatroom Name"></v-text-field>
          <p>Chatroom Color</p>
          <v-color-picker mode="hexa" hide-mode-switch class="mt-3 mb-3 elevation-0" v-model="buy_chatroom.theme"></v-color-picker>
          <p>Icon selection is not ready yet.</p>
					<div v-if="$root.user.moonrocks > 50">
						<img src="@/assets/moonrocks.png" alt="Moonrocks" class="moonrock-img"><span class="moonrock-count font-weight-medium red--text">- 50</span>
						<p class="green--text">You have enough moonrocks to purchase a chatroom.</p>
						<p>New Balance: <span class="font-weight-light">{{ $root.user.moonrocks - 50 }} Moonrocks</span></p>
					</div>
					<div v-if="$root.user.moonrocks == 50">
						<img src="@/assets/moonrocks.png" alt="Moonrocks" class="moonrock-img"><span class="moonrock-count font-weight-medium red--text">- 50</span>
						<p class="orange--text">You have just enough moonrocks to purchase a chatroom.</p>
					</div>
					<div v-if="$root.user.moonrocks < 50">
						<img src="@/assets/moonrocks.png" alt="Moonrocks" class="moonrock-img"><span class="moonrock-count font-weight-medium red--text">- 50</span>
						<p class="red--text">You do <b>not</b> have enough moonrocks to purchase a chatroom.</p>
					</div>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-btn @click="buyChatroom()" color="warning" text>Buy</v-btn>
					<v-btn @click="buy_chatroom.popup = false" text color="blue accent-1">Cancel</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

    <v-dialog v-model="delete_verify_popup" max-width="400">
			<v-card>
				<v-card-title><h3 class="headline mb-0">Delete Chatroom</h3></v-card-title>
				<v-card-text>Are you sure you want to delete this chatroom? A refund will not be issued.</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-btn @click="deleteChatroom()" color="red" text>Yes</v-btn>
					<v-spacer></v-spacer>
					<v-btn @click="delete_verify_popup = false" color="green" text>Cancel</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
  </div>
</template>

<script>
import io from 'socket.io-client'
import moment from 'moment'

var socket
var typingTimeout
export default {
  name: 'Flamechat',
  data() {
    return {
      current: false,
      add_chatroom_id: '',
      current_id: 'user_home',
      current_dm: '',
      current_message: false,
      new_message: '',
      buy_chatroom: {
        popup: false,
        name: '',
        theme: ''
      },
      edit: { open: false },
      chatroom_menu: { open: false },
      delete_verify_popup: false,
      socket,
      typers: []
    }
  },
  computed: {
		buy_chatroom_id() {
			return Math.random().toString(36).substring(7)
		}
	},
  methods: {
    async changeChatroom(from, to) {
      if (from) socket.disconnect()
      socket = await io.connect(`https://www.theparadigmdev.com/flamechat/${to}`)
      socket.on('data', data => {
        this.current = data
      })
      socket.on('send', data => {
        this.current.messages.push(data)
      })
      socket.on('delete', async id => {
        var index = await this.current.messages.findIndex(message => {
          return message._id == id
        })
        await this.current.messages.splice(index, 1)
      })
      socket.on('edit', async data => {
        var index = await this.current.messages.findIndex(message => {
          return message._id == data.oldID
        })
        this.current.messages[index] = data
      })
      socket.on('kill', async () => {
        this.leaveChatroom()
      })
      socket.on('typing', data => {
        let filteredData = data
        let exists = false
        filteredData.forEach(user => {
          if (user.user == this.$root.user.username) exists = true
        })
        if (exists) {
          const index = filteredData.findIndex(user => {
            return this.$root.user.username == user.user
          })
          filteredData.splice(index, 1)
        }
        this.typers = filteredData
      })
    },
    buyChatroom() {
      this.$http.post('https://www.theparadigmdev.com/api/flamechat/chatroom/new', {
        icon: 'mdi-forum',
        id: this.buy_chatroom_id,
        name: this.buy_chatroom.name,
        owner: this.$root.user.username,
        owner_id: this.$root.user._id,
        theme: this.buy_chatroom.theme
      }).then(response => {
        this.$root.socket.emit('new_chatroom')
        this.$http.get(`https://www.theparadigmdev.com/api/users/${this.$root.user.username}/moonrocks/-50`)
        this.$root.user.chatrooms.push(response.data)
        this.changeChatroom(false, response.data.id)
        this.buy_chatroom = {
          popup: false,
          name: '',
          theme: ''
        }
      }).catch(error => console.error(error))
    },
    getChatroom(id) {
      this.$http.get(`https://www.theparadigmdev.com/api/flamechat/chatroom/${id}`).then(response => {
        if (response.data.__v != this.current.__v) this.current = response.data
      }).catch(error => console.error(error))
    },
    addChatroom() {
      this.$http.get(`https://www.theparadigmdev.com/api/users/${this.$root.user.username}/chatroom/${this.add_chatroom_id}/add`).then(response => {
        socket.emit('send', {
          color: this.$root.user.color,
          username: this.$root.user.username,
          user_id: this.$root.user._id,
          pic: this.$root.user.pic,
          timestamp: moment().format('MM/DD/YYYY [at] H:MM a'),
          type: 'join'
        })
        this.$root.user = response.data
        this.add_chatroom_id = ''
      }).catch(error => console.error(error))
    },
    sendChat() {
      if (this.new_message.length > 0) {
        clearTimeout(typingTimeout)
        socket.emit('typing', { user: this.$root.user.username, is: false, color: this.$root.user.color })
        socket.emit('send', {
          color: this.$root.user.color,
          username: this.$root.user.username,
          user_id: this.$root.user._id,
          content: this.new_message,
          pic: this.$root.user.pic,
          timestamp: moment().format('MM/DD/YYYY [at] H:MM a'),
          edits: 0,
          type: 'message'
        })
        this.new_message = ''
      }
    },
    deleteChat(chat) {
      socket.emit('delete', chat._id)
    },
    editChat(chat) {
      this.edit = chat
      this.edit.open = true
    },
    editChatSave() {
      console.log(this.edit)
      socket.emit('edit', this.edit)
      this.edit = { open: false }
    },
    showChatroomMenu(e, id) {
      this.$http.get(`https://www.theparadigmdev.com/api/flamechat/chatroom/${id}`).then(response => {        
        this.chatroom_menu = {
          x: e.clientX,
          y: e.clientY,
          open: false,
          id: id,
          _id: response.data._id,
          name: response.data.name,
          owner: response.data.owner
        }
        this.$nextTick(() => {
          this.chatroom_menu.open = true
        })
      })
    },
    leaveChatroom() {
      if (this.$root.user.username != this.current.owner) {
        this.$http.get(`https://www.theparadigmdev.com/api/users/${this.$root.user.username}/chatroom/${this.chatroom_menu.id}/leave`).then(response => {
          this.$root.user = response.data
          socket.emit('send', {
            color: this.$root.user.color,
            username: this.$root.user.username,
            user_id: this.$root.user._id,
            pic: this.$root.user.pic,
            timestamp: moment().format('MM/DD/YYYY [at] H:MM a'),
            type: 'left'
          })
          this.current_id = 'user_home'
          this.current = false
        })
      } else this.$notify('You can&#39;t leave this chatroom, you own it!', 'warning', 'mdi-warning', true, 3000)
    },
    async deleteChatroom() {
			if (this.chatroom_menu.owner == this.$root.user.username || this.$root.user.rights.admin == true) {
        this.changeChatroom(false, this.chatroom_menu.id)
        socket.emit('kill')
        this.leaveChatroom()
        this.$notify('Chatroom deleted', 'info', 'mdi-delete', false, 3000)
        this.delete_verify_popup = false
        await this.$http.get(`https://www.theparadigmdev.com/api/flamechat/chatroom/${this.chatroom_menu.id}/delete`)
      }
    },
    startTyping() {
      clearTimeout(typingTimeout)
      socket.emit('typing', { user: this.$root.user.username, is: true, color: this.$root.user.color })
      typingTimeout = setTimeout(() => socket.emit('typing', { user: this.$root.user.username, is: false }), 3000)
    },
    viewProfile(uid) {
      this.$root.user.people.blocked.forEach(person => {
        if (person._id != uid) {
          if (uid == this.$root.user._id) this.$root.router = 'account'
          else {
            this.$http.get(`https://www.theparadigmdev.com/api/users/${uid}/info`).then(response => {
              if (!response.data.error) {
                this.$root.profile = response.data
                this.$root.router = 'people'
              } else this.$notify(response.data.error, 'error', 'mdi-alert-circle', false, 3000)
            })
          }
        } else this.$notify('You blocked this person', 'warning', 'mdi-account-cancel', false, 3000)
      })
    }
  },
  mounted() {
    // setInterval(() => {
    //   if (!this.current_id.includes('user_')){
    //     this.$http.get(`https://www.theparadigmdev.com/flamechat/chatroom/${this.current_id}/inspect/${this.current.__v}`).then(response => {
    //       if (response.data.result == true) this.getChatroom()
    //     })
    //   }
    // }, 1000)
  },
  beforeDestroy() {
    this.current = false
    this.current_id = 'user_home'
  }
}
</script>

<style scoped>
.messages {
  height: calc(100vh - 198px);
  overflow-y: auto;
}

main {
  margin-left: 74px;
}

.v-sheet:not(.v-card):not(.v-toolbar):not(.chatroom-menu) {
  background: none !important;
}

.moonrock-count {
  position: relative;
  bottom: 45px;
}

.typers {
  /* position: relative;
  bottom: 16px;
  display: block; */
}
</style>