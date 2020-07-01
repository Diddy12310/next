<template>
	<div class="paradox">
		<v-toolbar dense color="blue darken-2">
			<v-toolbar-title>The Paradox</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-text-field style="max-width: 500px;" v-model="search" label="Search..." color="white" class="mt-7"></v-text-field>
		</v-toolbar>

		<div :style="{ height: `calc(100vh - ${$root.music.open ? '192px' : '112px'})`, overflowY: 'auto' }">
			<v-container>
				<p class="text-center font-italic grey--text mt-12" v-if="filteredNews.length <= 0">No articles.</p>

				<v-card v-for="item in filteredNews" :key="item.id" class="news-home" @click="setNews(item)">
					<div v-if="item.live">
						<v-img :src="item.cover"></v-img>

						<v-card-title primary-title>
							<div>
								<h3 class="text-h5 mb-0">{{ item.title }}</h3>
								<h4 class="text-body-1 grey--text">{{ item.author }}&nbsp;&nbsp;•&nbsp;&nbsp;{{ item.timestamp }}</h4>
							</div>
						</v-card-title>
					</div>
				</v-card>
			</v-container>
		</div>

		<v-dialog v-model="dialog" max-width="800" v-if="current">
			<v-card>
				<v-img :src="current.cover"></v-img>
				<v-card-title primary-title>
					<div>
						<h3 class="text-h5 mb-0">{{ current.title }}</h3>
						<h4 class="text-body-1 grey--text">{{ current.author }}&nbsp;&nbsp;•&nbsp;&nbsp;{{ current.timestamp }}</h4>
					</div>
				</v-card-title>
				<v-card-text>
					<div class="text-body-2" v-html="current.content"></div>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<!-- <v-btn icon @click=""></v-btn> -->
					<v-spacer></v-spacer>
					<v-btn text color="blue accent-1" @click="dialog = false">Close</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-btn v-if="$root.user.rights.author" color="deep-purple" fab fixed bottom right @click="new_news.open = true">
      <v-icon>mdi-plus</v-icon>
    </v-btn>

		<v-dialog v-model="new_news.open" max-width="500">
			<v-card>
				<v-card-title>
					<h3 class="text-h5 mb-0">Write a Story</h3>
					<v-spacer></v-spacer>
					<v-btn icon @click="new_news.open = false" class="dialog-close-btn">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text>
					<v-text-field label="Title" v-model="new_news.title"></v-text-field>
					<v-textarea label="Content" v-model="new_news.content"></v-textarea>
					<v-switch v-model="new_news.live" label="Published"></v-switch>
					<v-text-field label="Cover URL" v-model="new_news.cover"></v-text-field>
					<p class="grey--text font-weight-light" v-if="new_news.cover">Does the story's cover display correctly?</p>
					<v-img max-width="200" :src="new_news.cover" v-if="new_news.cover"></v-img>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-btn :disabled="!new_news.title || !new_news.content || !new_news.cover" text color="blue accent-1" @click="addNews()">Submit</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>


	</div>
</template>

<script>
import moment from 'moment'

export default {
	name: 'Paradox',
	data() {
		return {
			news: [],
			search: '',
			current: false,
			dialog: false,
			new_news: {
				open: false,
				title: '',
				content: '',
				live: true,
				cover: ''
			}
		}
	},
	computed: {
		filteredNews() {
			return this.news.filter(item => {
				return item.title.match(this.searchNews) || item.author.match(this.searchNews) || item.timestamp.match(this.searchNews)
			})
		}
	},
	methods: {
		async getNews() {
			await this.$http.get('https://www.theparadigmdev.com/api/paradox/get').then(response => {
				this.news = response.data
			})
		},
		setNews(item) {
			this.current = item
			this.current.timestamp = moment().format('MM/DD/YYYY [at] h:mm a')
			this.dialog = true
		},
		addNews() {
			if (this.new_news.title && this.new_news.content && this.new_news.cover) {
				this.$http.post('https://www.theparadigmdev.com/api/paradox/add', {
					title: this.new_news.title,
					author: this.$root.user.username,
					content: this.new_news.content,
					live: this.new_news.live,
					cover: this.new_news.cover,
					timestamp: moment().format('MM/DD/YYYY [at] h:mm a')
				}).then(response => {
					this.getNews()
					this.new_news = {
						open: false,
						title: '',
						content: '',
						live: true,
						cover: ''
					}
					this.current = response.data
					this.dialog = true
				})
			}
		}
	},
	async created() {
		await this.getNews()
		if (this.$root.url[1] == 'paradox') {
      this.news.forEach(item => {
        if (this.$root.url[2] == item._id) {
					this.setNews(item)
        }
      })
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
