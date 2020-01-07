<template>
	<div class="news">
		<v-container fluid class="text-center pt-0">
      <v-row>
        <v-col xs="12" cols="12" class="light-blue darken-3 py-12 elevation-5" style="z-index: 5;">
          <h1 class="display-3 font-weight-thin white--text">The Paradox</h1>
        </v-col>
				<v-col xs="12" cols="12" class="blue-grey darken-3 elevation-5 py-4">
					<h3 class="mt-2 display-1 grey--text font-weight-light text-uppercase font-italic">Accuracy. Transparency. Legitimacy.</h3>
					<v-text-field v-if="$vuetify.breakpoint.lgAndUp" v-model="searchNews" label="Search..." color="white" style="width: 300px; position: absolute; top: 5px; right: 15px; z-index: 10;"></v-text-field>
				</v-col>
				<v-col xs="12" cols="12">
					<v-text-field v-if="$vuetify.breakpoint.mdAndDown" v-model="searchNews" label="Search..." style="width: 300px; margin: auto;"></v-text-field>
				</v-col>
      </v-row>
    </v-container>

		<v-card v-for="item in filteredNews" :key="item.id" class="news-home">
			<div v-if="item.uploaded">
				<v-img :src="item.cover"></v-img>

				<v-card-title primary-title>
					<div>
						<h3 class="headline mb-0">{{ item.title }}</h3>
						<h4 class="subtitle-1 grey--text">{{ item.author }}&nbsp;&nbsp;|&nbsp;&nbsp;{{ item.timestamp }}</h4>
					</div>
				</v-card-title>
				<v-divider></v-divider>
				<v-card-actions>
					<v-btn text color="accent" @click="setNews(item.title, item.author, item.timestamp, item.cover, item.detail)">View Article</v-btn>
				</v-card-actions>
			</div>
    </v-card>


		<v-dialog v-model="newsDialog" max-width="800" v-if="currentNews">
			<v-card>
				<v-img :src="currentNews.cover"></v-img>
				<v-card-title primary-title>
					<div>
						<h3 class="headline mb-0">{{ currentNews.title }}</h3>
						<h4 class="subtitle-1 grey--text">{{ currentNews.author }}&nbsp;&nbsp;|&nbsp;&nbsp;{{ currentNews.timestamp }}</h4>
					</div>
				</v-card-title>
				<v-card-text>
					<div class="detitem" v-html="currentNews.details"></div>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-btn text color="accent" @click="newsDialog = false">Close</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-btn color="deep-purple" fab fixed bottom right @click="newNewsDialog = true">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
		<v-dialog v-model="newNewsDialog" max-width="500">
			<v-card>
				<v-card-title>
					<h3 class="headline mb-0">Write a Story</h3>
					<v-spacer></v-spacer>
					<v-btn icon @click="newNewsDialog = false" class="dialog-close-btn">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text>
					<v-text-field label="Title" v-model="newNewsTitle"></v-text-field>
					<v-textarea label="Details" v-model="newNewsDetail"></v-textarea>
					<v-switch v-model="newNewsIsPublished" label="Published"></v-switch>
					<v-text-field label="Cover URL" v-model="newNewsCover"></v-text-field>
					<p class="grey--text font-weight-light" v-if="newNewsCover">Does the story's cover display correctly?</p>
					<v-img max-width="200" :src="newNewsCover" v-if="newNewsCover"></v-img>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-btn :disabled="!newNewsTitle || !newNewsDetail || !newNewsIsPublished || !newNewsCover" text color="accent" @click="submitNews()">Submit</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>


	</div>
</template>

<script>
import { db } from '@/firebase'
import moment from 'moment'

export default {
	name: 'Paradox',
	data() {
		return {
			news: [],
			searchNews: '',
			currentNews: null,
			newsDialog: false,
			newNewsDialog: false,
			newNewsTitle: '',
			newNewsDetail: '',
			newNewsIsPublished: true,
			newNewsCover: ''
		}
	},
	created() {
		let ref = db.collection('news').orderBy("timestamp", "desc").limit(25)

		ref.onSnapshot(snapshot => {
			snapshot.docChanges().forEach(change => {
				if(change.type === "added") {
					let doc = change.doc
					this.news.splice(change.newIndex, 0, {
						id: doc.id,
						author: doc.data().author,
						cover: doc.data().cover,
						detail: doc.data().detail,
						timestamp: moment(doc.data().timestamp).format('LLLL'),
						title: doc.data().title,
						uploaded: doc.data().uploaded,
					})
				}
				if(change.type === "removed") {
					let doc = change.doc
					this.news.splice(change.oldIndex, 1)
				}
				if(change.type === "modified") {
					let doc = change.doc
					this.news.splice(change.oldIndex, 1, {
						id: doc.id,
						author: doc.data().author,
						cover: doc.data().cover,
						detail: doc.data().detail,
						timestamp: moment(doc.data().timestamp).format('LLLL'),
						title: doc.data().title,
						uploaded: doc.data().uploaded
					})
				}
			})
		})
	},
	computed: {
		filteredNews() {
			return this.news.filter(item => {
				return item.title.match(this.searchNews) || item.author.match(this.searchNews) || item.timestamp.match(this.searchNews)
			})
		}
	},
	methods: {
		setNews(title, author, timestamp, cover, details) {
			this.currentNews = {
				title: title,
				author: author,
				timestamp: timestamp,
				cover: cover,
				details: details
			}
			this.newsDialog = true
		},
		submitNews() {
			if (this.newNewsTitle && this.newNewsDetail && this.newNewsIsPublished && this.newNewsCover) {
				db.collection('news').add({
					title: this.newNewsTitle,
					author: this.$root.username,
					detail: this.newNewsDetail,
					uploaded: this.newNewsIsPublished,
					cover: this.newNewsCover,
					timestamp: Date.now()
				}).then(() => {
					this.newNewsDialog = false
					this.newNewsTitle = ''
					this.newNewsDetail = ''
					this.newNewsIsPublished = true
					this.newNewsCover = ''
				})
			} else {
				this.$notify('Please fill in all of the required fields')
			}
		}
	}
}
</script>

<style scoped>
div.v-card.news-home {
	max-width: 750px;
	width: 100%;
	margin: 20px auto;
}
</style>
