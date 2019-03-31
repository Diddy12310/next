<template>
  <div class="index">
		<v-container>
			<div class="title" style="margin: 26px 0px 50px 0px; text-align: center;">
				<h1 class="display-3 blue--text font-weight-thin text-uppercase">Music</h1>
				<h6 class="headline red--text font-weight-thin">Rights to the items listed below are reserved for their creators.</h6>
				<v-text-field v-model="searchMusic" label="Search..." style="width: 300px; margin: 50px auto 0px auto;" hint="Case sensitive"></v-text-field>
			</div>
			<div class="music">
				<v-card v-for="(item, index) in filteredMusic" :key="index">
					<v-img :src="item.cover"></v-img>

					<v-card-title primary-title>
						<div>
							<h3 class="headline mb-0">{{ item.title }}</h3>
							<h4 class="subheading grey--text">{{ item.author }}&nbsp;&nbsp;|&nbsp;&nbsp;{{ item.duration }}</h4>
							<h4 class="body-2 grey--text">{{ item.album }}</h4>
						</div>
					</v-card-title>
					<v-divider></v-divider>
					<v-card-text></v-card-text>

					<v-card-actions>
						<span v-if="!item.available" class="red--text font-weight-medium" style="margin: 6px;">UNAVAILABLE</span>
						<audio controls class="control" v-if="item.available" @click="logMusic(item.title, item.author)">
							<source :src="item.link" type='audio/mp4'>
							<source :src="item.link" type='audio/ogg; codecs=vorbis'>
							<p>Your browser does not support Music.</p>
						</audio>
					</v-card-actions>
				</v-card>
			</div>
		</v-container>

  </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
export default {
  name: 'Music',
  data() {
    return {
			music: [],
			searchMusic: '',
			username: ''
    }
  },
  created() {
		let ref = db.collection('music').orderBy("title", "asc")

		ref.onSnapshot(snapshot => {
			snapshot.docChanges().forEach(change => {
				if(change.type === "added") {
					let doc = change.doc
					this.music.push({
						id: doc.id,
						album: doc.data().album,
						author: doc.data().author,
						cover: doc.data().cover,
						duration: doc.data().duration,
						link: doc.data().link,
						title: doc.data().title,
						available: doc.data().available
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
						duration: doc.data().duration,
						link: doc.data().link,
						title: doc.data().title,
						available: doc.data().available
					})
				}
			})
		})

		this.username = this.$parent.$parent.$parent.username
    // db.collection('music').get().then(snapshot => {
    //   snapshot.forEach(doc => {
		// 		let item = doc.data()
    //     item.id = doc.id
    //     this.music.push(item)
    //   })
		// })
	},
	computed: {
		filteredMusic() {
			return this.music.filter(item => {
				return item.title.match(this.searchMusic) || item.album.match(this.searchMusic) || item.author.match(this.searchMusic)
			})
		}
	},
	methods: {
		logMusic(music, artist) {
			this.$ga.event('Music', this.username + ' is listening to ' + music + ' by ' + artist)
		}
	}
}
</script>

<style scoped>
@media screen and (min-width: 1240px) {
	div.music {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-gap: 16px;
		margin-bottom: 32px;
	}
}

@media screen and (max-width: 1240px) {
	div.music {
		margin-bottom: 32px;
	}

	div.v-card__text {
		margin-bottom: 30px;
		margin-top: 30px;
		position: relative;
		bottom: 30px;
	}
}

h1 {
  text-align: center;
}

div.v-card {
	margin: 16px auto;
	max-width: 400px;
	width: 100%;
	height: 100%;
}

div.v-card__actions {
	position: absolute;
	bottom: 0px;
}

audio {
	position: relative;
	top: +8px;
	left: -8px;
	width: 100% !important;
	margin: auto;
}
</style>