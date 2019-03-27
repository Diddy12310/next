<template>
	<div class="news">
		<div class="title" style="margin: 26px 0px 50px 0px; text-align: center;">
			<h1 class="display-3 blue--text font-weight-thin text-uppercase" style="margin-top: 50px; text-align: center;">The Paradox</h1>
			<h3 class="display-1 blue-grey--text font-weight-light text-uppercase font-italic" style="text-align: center; margin-bottom: 50px;">Accuracy. Transparency. Legitimacy.</h3>
			<v-text-field v-model="searchNews" label="Search..." style="width: 300px; margin: 50px auto 0px auto;" hint="For now, you cannot search within articles."></v-text-field>
		</div>

		<v-card v-for="item in filteredNews" :key="item.id" class="news-home">
			<div v-if="item.uploaded">
				<v-img :src="item.cover"></v-img>

				<v-card-title primary-title>
					<div>
						<h3 class="headline mb-0">{{ item.title }}</h3>
						<h4 class="subheading grey--text">{{ item.author }}&nbsp;&nbsp;|&nbsp;&nbsp;{{ item.timestamp }}</h4>
					</div>
				</v-card-title>
				<!-- <v-divider></v-divider>
				<v-card-text>
					<div class="detitem" v-html="detitem" v-for="(detitem, index) in item.detail" :key="index"></div>
				</v-card-text> -->
				<v-card-actions>
					<v-btn flat color="accent" @click="setNews(item.title, item.author, item.timestamp, item.cover, item.detail)">View Article</v-btn>
				</v-card-actions>
			</div>
    </v-card>


		<v-dialog v-model="newsDialog" max-width="800" v-if="currentNews">
			<v-card>
				<v-img :src="currentNews.cover"></v-img>
				<v-card-title primary-title>
					<div>
						<h3 class="headline mb-0">{{ currentNews.title }}</h3>
						<h4 class="subheading grey--text">{{ currentNews.author }}&nbsp;&nbsp;|&nbsp;&nbsp;{{ currentNews.timestamp }}</h4>
					</div>
				</v-card-title>
				<v-card-text>
					<div class="detitem" v-html="detitem" v-for="(detitem, index) in currentNews.details" :key="index"></div>
				</v-card-text>
				<v-card-actions>
					<v-btn flat color="accent" @click="newsDialog = false">Close</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

	</div>
</template>

<script>
import db from '@/firebase/init'
import moment from 'moment'

export default {
	name: 'Paradox',
	data() {
		return {
			news: [],
			searchNews: '',
			username: '',
			currentNews: null,
			newsDialog: false
		}
	},
	created() {
		this.username = this.$parent.$parent.$parent.username
		let ref = db.collection('news').orderBy("stamp", "desc").limit(25)

		ref.onSnapshot(snapshot => {
			snapshot.docChanges().forEach(change => {
				if(change.type === "added") {
					let doc = change.doc
					this.news.push({
						id: doc.id,
						author: doc.data().author,
						cover: doc.data().cover,
						detail: doc.data().detail,
						timestamp: doc.data().timestamp,
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
						timestamp: doc.data().timestamp,
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
		}
	}
}
</script>

<style scoped>
 .detitem {
	padding-bottom: 10px;
}

.detitem:last-of-type {
	padding-bottom: 0px;
}

div.v-card.news-home {
	max-width: 750px;
	width: 100%;
	margin: 20px auto;
}
</style>
