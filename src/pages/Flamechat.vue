<template>
  <div class="flamechat">
    <v-navigation-drawer permanent mini-variant absolute>
      <v-list rounded>
        <v-text-field class="mt-0" @keypress.enter="addChatroom()" v-model="add_chatroom_id" label="Add..."></v-text-field>
        <v-list-item-group mandatory v-model="current_chatroom_index">
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-list-item ripple v-on="on" :value="-1">
                <v-list-item-icon>
                  <v-icon>mdi-home</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <span>Home</span>
          </v-tooltip>
          <v-tooltip right v-for="(chatroom, index) in $root.my_chatrooms" :key="chatroom.id">
            <template v-slot:activator="{ on }">
              <v-list-item :v-ripple="true" v-on="on" @contextmenu.prevent="showChatroomMenu($event, chatroom.id, index)" @click="setChatroom(chatroom.id)" :value="index">
                <v-list-item-icon>
                  <!-- <v-img :src="chatroom.pic"></v-img> -->
                  <v-icon>{{ chatroom.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <span>{{ chatroom.name }}</span>
          </v-tooltip>
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-list-item :v-ripple="true" v-on="on" :value="-2">
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
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-menu v-model="chatroom_menu.open" v-if="chatroom_menu.open" :position-x="chatroom_menu.x" :position-y="chatroom_menu.y" absolute offset-y>
      <v-list dense>
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
        <v-divider v-if="$root.username == chatroom_menu.owner || $root.isAdmin == true"></v-divider>
        <v-list-item @click="delete_verify_popup = true" v-if="$root.username == chatroom_menu.owner || $root.isAdmin == true">
          <v-list-item-icon><v-icon class="red--text">mdi-delete</v-icon></v-list-item-icon>
          <v-list-item-title class="red--text">Delete chatroom</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <main v-if="current_chatroom_index > -1" style="margin-left: 80px;">
      <v-toolbar dense :color="current_chatroom.theme ? current_chatroom.theme : 'deep-orange'">
        <v-spacer></v-spacer>
        <v-toolbar-title>{{ current_chatroom.name }}</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <div class="messages pt-4" v-chat-scroll="{always: false, smooth: true}">
        <v-layout pb-4 wrap v-for="(message, index) in current_chatroom.messages" :key="index" align-start @mouseover="current_message = message" @click="current_message = message">
          <v-flex xs1 text-center>
            <v-btn text icon x-large><v-avatar><v-img :src="message.pic"></v-img></v-avatar></v-btn>
          </v-flex>
          <v-flex v-if="$root.isAdmin || $root.username == message.name" xs9 pl-2 @dblclick="startEditing(message.content, index)">
            <span class="font-weight-medium text-uppercase title" :style="{ 'color': message.color }">{{ message.name }}</span>
            <span class="font-weight-light caption grey--text pl-2">{{ message.timestamp }}</span><span class="font-weight-light caption grey--text pl-1" v-if="message.editing">editing, press enter to save</span><br>
            <span v-html="message.content" v-if="!message.editing"></span>
            <input style="width: 100%; outline: none;" @keypress.enter="editChat()" type="text" v-if="message.editing" v-model="edit_message">
          </v-flex>
          <v-flex v-if="!$root.isAdmin && !$root.username == message.name" xs9 pl-2>
            <span class="font-weight-medium text-uppercase title" :style="{ 'color': message.color }">{{ message.name }}</span>
            <span class="font-weight-light caption grey--text pl-2">{{ message.timestamp }}</span><br>
            <span v-html="message.content"></span>
          </v-flex>
          <v-flex xs2 text-right pr-4>
            <v-tooltip bottom open-delay="1000">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" class="admin-btn" icon small color="warning" v-if="$root.isAdmin || $root.username == message.name" @click.prevent="startEditing(message.content, index)" v-model="message.editing"><v-icon>mdi-pencil</v-icon></v-btn>
              </template>
              <span>Edit</span>
            </v-tooltip>
            <v-tooltip bottom open-delay="1000">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" class="admin-btn" icon small color="error" v-if="$root.isAdmin || $root.username == message.name" @click.prevent="deleteChat(message.id)"><v-icon>mdi-delete</v-icon></v-btn>
              </template>
              <span>Delete</span>
            </v-tooltip>
          </v-flex>
        </v-layout>
      </div>
      <v-layout justify-center align-center text-center px-4>
        <v-flex xs11>
          <v-text-field @keypress.enter="sendChat()" v-model="new_message" :label="`Message ${current_chatroom.name}...`"></v-text-field>
        </v-flex>
        <v-flex xs1>
          <v-btn text icon @click="sendChat()"><v-icon>mdi-send</v-icon></v-btn>
        </v-flex>
      </v-layout>
    </main>

    <main v-if="current_chatroom_index === -2">
      <v-toolbar dense color="deep-orange">
        <v-spacer></v-spacer>
        <v-toolbar-title>Direct Messages</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
    </main>

    <main v-if="current_chatroom_index === -1" style="margin-left: 80px; text-align: center;">
      <v-container fluid class="text-center pt-0 mb-4">
        <v-row>
          <v-col sm="12" class="deep-orange py-12 elevation-5">
            <h1 class="display-3 font-weight-thin white--text">Welcome to Flamechat!</h1>
          </v-col>
          <v-col sm="12">
            <p class="title font-weight-regular px-6 pt-6">Select a chatroom from the left.</p>
            <v-btn color="deep-orange" @click="buy_chatroom.popup = true">Buy a Chatroom</v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-divider width="500" class="mx-auto"></v-divider>
      <p class="mt-8 px-4">Here are some pre-made chatrooms. Their ID is below the summary. Type that ID in the Add field above the home icon.</p>
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
      </v-container>
    </main>

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

    <v-dialog v-model="buy_chatroom.popup" max-width="450">
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
          <p>Icon selection is not implemented yet.</p>
					<div v-if="$root.moonrocks > 50">
						<img src="@/assets/moonrocks.png" alt="Moonrocks" class="moonrock-img"><span class="moonrock-count font-weight-medium red--text">- 50</span>
						<p class="green--text">You have enough moonrocks to purchase a chatroom.</p>
						<p>New Balance: <span class="font-weight-light">{{ $root.moonrocks - 50 }} Moonrocks</span></p>
					</div>
					<div v-if="$root.moonrocks == 50">
						<img src="@/assets/moonrocks.png" alt="Moonrocks" class="moonrock-img"><span class="moonrock-count font-weight-medium red--text">- 50</span>
						<p class="orange--text">You have just enough moonrocks to purchase a chatroom.</p>
					</div>
					<div v-if="$root.moonrocks < 50">
						<img src="@/assets/moonrocks.png" alt="Moonrocks" class="moonrock-img"><span class="moonrock-count font-weight-medium red--text">- 50</span>
						<p class="red--text">You do <b>not</b> have enough moonrocks to purchase a chatroom.</p>
					</div>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-btn @click="buyChatroom()" color="warning" text>Buy</v-btn>
					<v-btn @click="buy_chatroom.popup = false" text color="accent">Cancel</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
  </div>
</template>

<script>
import { db, app } from '@/firebase.js'
import moment from 'moment'

export default {
  name: 'Flamechat',
  data() {
    return {
      current_chatroom: {},
      current_message: {},
      flamechat_enable: true,
      chatroom_menu: {},
      new_message: '',
      edit_message: '',
      add_chatroom_id: '',
      current_chatroom_index: -1,
      delete_verify_popup: false,
      purge_verify_popup: false,
      buy_chatroom: {
        popup: false,
        name: '',
        theme: ''
      }
    }
  },
  computed: {
		buy_chatroom_id() {
			return Math.random().toString(36).substring(7)
		}
	},
  methods: {
    showChatroomMenu(e, id, index) {
      db.collection('flamechat').doc(id).get().then(doc => {
        this.chatroom_menu = {
          x: e.clientX,
          y: e.clientY,
          open: false,
          id: id,
          name: doc.data().name,
          index: index,
          owner: doc.data().owner,
          theme: doc.data().theme,
          icon: doc.data().icon
        }
        this.$nextTick(() => {
          this.chatroom_menu.open = true
        })
      })
    },
    // muteChatroom(value) {
    //   db.collection('users').doc(this.$root.username).update({
    //     chatrooms: app.firestore.FieldValue.arrayRemove({
    //       id: this.chatroom_menu.id,
    //       name: this.chatroom_menu.name,
    //       muted: !value
    //     }),
    //     chatrooms: app.firestore.FieldValue.arrayUnion({
    //       id: this.chatroom_menu.id,
    //       name: this.chatroom_menu.name,
    //       muted: value
    //     })
    //   })
    //   this.chatroom_menu.muted = value
    // }
    setChatroom(id) {
			db.collection('flamechat').doc(id).get().then(doc => {
				if (doc.exists) {
          this.current_chatroom = {
            name: doc.data().name,
            owner: doc.data().name,
            id: doc.data().id,
            messages: [],
            icon: doc.data().icon,
            theme: doc.data().theme
          }
					let ref = db.collection('flamechat').doc(id).collection('messages').orderBy('timestamp', 'asc')
					// this.editing = null
					// this.editMessage = ''
					// this.editor = false
					ref.onSnapshot(snapshot => {
						snapshot.docChanges().forEach(change => {
							if(change.type === "added") {
								let doc = change.doc
								this.current_chatroom.messages.push({
									id: doc.id,
									name: doc.data().name,
									content: doc.data().content,
									color: doc.data().color,
									timestamp: moment(doc.data().timestamp).format('MMMM Do YYYY, h:mm:ss a'),
                  pic: doc.data().pic,
                  editing: false
								})
							}
							if(change.type === "removed") {
								let doc = change.doc
								this.current_chatroom.messages.splice(change.oldIndex, 1)
							}
							if(change.type === "modified") {
								let doc = change.doc
								this.current_chatroom.messages.splice(change.oldIndex, 1, {
									id: doc.id,
									name: doc.data().name,
									content: doc.data().content,
									color: doc.data().color,
									timestamp: moment(doc.data().timestamp).format('MMMM Do YYYY, h:mm:ss a'),
									pic: doc.data().pic,
                  editing: false
								})
							}
						})
					}, error => {
            console.error(error)
          })
				} else {
					this.$notify('Chatroom does not exist')
					db.collection('users').doc(this.$root.username).update({
						chatrooms: app.firestore.FieldValue.arrayRemove({ id: this.current_chatroom.id, name: this.current_chatroom.name, theme: this.current_chatroom.theme, icon: this.current_chatroom.icon, owner: this.current_chatroom.owner })
					})
				}
			})
    },
    sendChat() {
			if(this.new_message) {
				db.collection('flamechat').doc(this.current_chatroom.id).collection('messages').add({
					name: this.$root.username,
					content: this.new_message,
					color: this.$root.accountColor,
					timestamp: Date.now(),
					pic: this.$root.accountPic,
					chatroom_id: this.current_chatroom.id,
					chatroom: this.current_chatroom.name
				}).catch(error => {
					console.log(error.message)
					this.$notify('Your message did not send successfully!')
					this.$ga.event(this.$root.username, 'error: ' + error.message)
				})
				this.$notify('Your message sent successfully!')
				this.$ga.event(this.$root.username, 'sent ' + this.new_message + ' on ' + this.current_chatroom.name)
				this.new_message = null
			} else {
				this.$notify('Your message did not send sucessfully!')
				this.$ga.event(this.$root.username, 'error: they tried and failed to send a message')
			}
    },
    editChat(id) {
			db.collection('flamechat').doc(this.current_chatroom.id).collection('messages').doc(this.current_message.id).update({
				content: this.edit_message
			}).then(() => {
				this.$notify('Message edited successfully.')
				this.$ga.event(this.$root.username, 'edited ' + this.edit_message + ' on ' + this.current_chatroom.name)
				this.edit_message = ''
			}).catch(error => {
				this.$notify(error.message)
				this.$ga.event(this.$root.username, 'error: ' + error.message)
			})
		},
    deleteChat(id) {
			db.collection('flamechat').doc(this.current_chatroom.id).collection('messages').doc(id).delete().then(() => {
				this.$notify('Message deleted successfully')
				this.$ga.event(this.$root.username, 'deleted a message on ' + this.current_chatroom.name)
			}).catch(error => {
				this.$ga.event(this.$root.username, 'error: ' + error.message)
			})
    },
    leaveChatroom() {
      console.log(this.$root.username)
			db.collection('users').doc(this.$root.username).update({
				chatrooms: app.firestore.FieldValue.arrayRemove({ name: this.chatroom_menu.name, id: this.chatroom_menu.id, theme: this.chatroom_menu.theme, icon: this.chatroom_menu.icon, owner: this.chatroom_menu.owner })
			}).then(() => {
        this.current_chatroom_index = -1
      }).catch(error => console.error(error))
    },
    addChatroom() {
			db.collection('flamechat').doc(this.add_chatroom_id).get().then(doc => {
				if (doc.exists) {
					var new_chatroom_name = doc.data().name
					db.collection('users').doc(this.$root.username).update({
						chatrooms: app.firestore.FieldValue.arrayUnion({ id: this.add_chatroom_id, name: new_chatroom_name, theme: doc.data().theme, icon: doc.data().icon, owner: doc.data().owner })
					}).then(() => {
            this.add_chatroom_id = ''
          })
				} else {
					this.$notify('Chatroom does not exist')
				}
			})
    },
    startEditing(existing_content, index) {
      if (this.edit_message !== '') this.$notify('You may only edit one message at a time')
      if (this.edit_message === '') {
        this.edit_message = existing_content
        this.current_chatroom.messages[index].editing = true
      }
    },
    deleteChatroom() {
			if (this.chatroom_menu.owner == this.$root.username || this.$root.isAdmin == true) {
				db.collection('flamechat').doc(this.chatroom_menu.id).delete().then(() => {
          this.leaveChatroom()
          this.$notify('Chatroom deleted')
          this.delete_verify_popup = false
				})
			}
    },
    buyChatroom() {
      if (this.$root.moonrocks >= 50) {
        db.collection('flamechat').doc(this.buy_chatroom_id).set({
          name: this.buy_chatroom.name,
          id: this.buy_chatroom_id,
          theme: this.buy_chatroom.theme,
          owner: this.$root.username
        }).then(() => {
          db.collection('users').doc(this.$root.username).update({
            chatrooms: app.firestore.FieldValue.arrayUnion({ name: this.buy_chatroom.name, id: this.buy_chatroom_id, theme: this.buy_chatroom.theme, icon: 'mdi-forum', owner: this.$root.username }),
            moonrocks: app.firestore.FieldValue.increment(-50)
          }).then(() => {
            this.setChatroom(this.buy_chatroom_id)
            this.buy_chatroom.popup = false
          })
        })
      } else {
        this.$notify('You do not have enough Moonrocks to buy a chatroom')
      }
		}
  },
  // created() {
  //   this.$root.my_chatrooms.forEach(chatroom => {
  //     db.collection('flamechat').doc(chatroom.id).get().then(doc => {
  //       var data = doc.data()
  //       chatroom.theme = doc.data().theme
  //       chatroom.icon = doc.data().icon
  //       chatroom.owner = doc.data().owner
  //     })
  //   })
  // }
}
</script>

<style scoped>
.messages {
  height: calc(100vh - 175px);
  overflow-y: auto;
}
</style>
