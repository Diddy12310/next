<template>
  <div class="index">
		<v-container fluid grid-list-md>
			<v-layout wrap>
				<v-flex v-for="(item, index) in filteredMusic" :key="index" xs12 sm6 md4 lg3 xl2>
					<v-card class="music-item" ripple :disabled="!item.available" @click="$root.music_player = item, $root.music_player.open = true, $root.music_player.playing = true">
						<v-img :src="item.cover">
							<v-card-title class="align-end fill-height" style="background-image: linear-gradient(transparent, #212121);">
								<div style="width: 100%;">
									<h3 class="headline mb-0">{{ item.title }}</h3>
									<h4 class="body-2 grey--text">{{ item.author }}&nbsp;&nbsp;|&nbsp;&nbsp;{{ item.album }}</h4>
									<div class="d-flex">
										<h4 class="body-2 grey--text">{{ item.genre }}</h4>
										<v-spacer></v-spacer>
										<h4 class="body-2 red--text font-weight-medium" v-if="!item.available">UNAVAILABLE</h4>
									</div>
								</div>
							</v-card-title>
						</v-img>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>

		<v-btn color="deep-purple" fab fixed bottom right @click="newMusicDialog = true">
      <v-icon>mdi-plus</v-icon>
    </v-btn>

		<v-dialog v-model="newMusicDialog" max-width="500">
			<v-card>
				<v-card-title>
					<h3 class="headline mb-0">Add Song</h3>
					<v-spacer></v-spacer>
					<v-btn icon @click="newMusicDialog = false" class="dialog-close-btn">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text>
					<v-text-field label="Song" v-model="newMusicTitle"></v-text-field>
					<v-text-field label="Album" v-model="newMusicAlbum"></v-text-field>
					<v-text-field label="Artist" v-model="newMusicArtist"></v-text-field>
					<v-text-field label="Genre" v-model="newMusicGenre"></v-text-field>
					<v-text-field label="Cover URL" v-model="newMusicCover"></v-text-field>
					<p class="grey--text font-weight-light" v-if="newMusicCover">Does the song's cover display correctly?</p>
					<v-img max-width="200" :src="newMusicCover" v-if="newMusicCover"></v-img>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-btn :disabled="!newMusicAlbum || !newMusicArtist || !newMusicCover || !newMusicGenre || !newMusicTitle" text color="accent" @click="submitSong()">Submit</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
  </div>
</template>

<script>
import { db } from '@/firebase'

export default {
	name: 'Music',
	props: { search: String },
  data() {
    return {
			music: [],
			newMusicDialog: false,
			newMusicTitle: null,
			newMusicAlbum: null,
			newMusicArtist: null,
			newMusicCover: null,
			newMusicGenre: null,
			current_playing: {}
    }
  },
  created() {
		this.$root.loadingBar = true
		let ref = db.collection('music').orderBy("title", "asc")

		ref.onSnapshot(snapshot => {
			snapshot.docChanges().forEach(change => {
				if(change.type === "added") {
					let doc = change.doc
					this.music.splice(change.newIndex, 0, {
						id: doc.id,
						album: doc.data().album,
						author: doc.data().author,
						cover: doc.data().cover,
						link: doc.data().link,
						title: doc.data().title,
						available: doc.data().available,
						genre: doc.data().genre
					})
				}
				if(change.type === "removed") {
					let doc = change.doc
					this.music.splice(change.oldIndex, 1)
				}
				if(change.type === "modified") {
					let doc = change.doc
					this.music.splice(change.oldIndex, 1, {
						id: doc.id,
						album: doc.data().album,
						author: doc.data().author,
						cover: doc.data().cover,
						link: doc.data().link,
						title: doc.data().title,
						available: doc.data().available,
						genre: doc.data().genre
					})
				}
				this.$root.loadingBar = false
			})
		})
	},
	computed: {
		filteredMusic() {
			return this.music.filter(item => {
				if (item.title.toLowerCase().includes(this.search.toLowerCase()) || item.album.toLowerCase().includes(this.search.toLowerCase()) || item.author.toLowerCase().includes(this.search.toLowerCase()) || item.genre.toLowerCase().includes(this.search.toLowerCase())) {
					item.loaded = false
					return item
				}
			})
		}
	},
	methods: {
		logMusic(music) {
			this.$ga.event('Music', this.$root.username + ' is listening to ' + music)
		},
		submitSong() {
			if (this.newMusicTitle && this.newMusicAlbum && this.newMusicArtist && this.newMusicCover && this.newMusicGenre) {
				db.collection('music').add({
					album: this.newMusicAlbum,
					author: this.newMusicArtist,
					title: this.newMusicTitle,
					cover: this.newMusicCover,
					available: false,
					link: '',
					genre: this.newMusicGenre
				}).then(() => {
					this.newMusicDialog = false
					this.newMusicTitle = ''
					this.newMusicAlbum = ''
					this.newMusicArtist = ''
					this.newMusicCover = ''
					this.newMusicGenre = ''
				})
			} else {
				this.$notify('Please fill in all of the required fields')
			}
		}
	}
}
</script>

<style scoped>
h1 {
  text-align: center;
}

div.v-card.music-item {
	max-width: 400px;
	width: 100%;
	margin: auto;
	height: 100%;
}
</style>