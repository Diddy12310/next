<template>
  <div class="index">
		<v-container fluid grid-list-md>
			<v-layout wrap>
				<v-flex v-for="(item, index) in filteredMovies" :key="index" xs12 sm6 md4 lg3 xl2>
					<v-card class="movie-item" ripple :disabled="!item.available" @click="watchMovie(item.title, item.link, item.cover)">
						<v-img :src="item.cover">
							<v-card-title class="align-end fill-height" style="background-image: linear-gradient(transparent, #212121);">
								<div style="width: 100%;">
									<h3 class="headline mb-0">{{ item.title }}</h3>
									<div class="d-flex">
										<h4 class="body-2 grey--text">{{ item.genre }}</h4>
										<v-spacer></v-spacer>
										<h4 class="body-2 red--text font-weight-medium" v-if="!item.available">UNAVAILABLE</h4>
									</div>
								</div>
							</v-card-title>
						</v-img>

						<v-card-text>{{ item.summary }}</v-card-text>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>

		<v-btn color="deep-purple" fab fixed bottom right @click="newMovieDialog = true">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
		<v-dialog v-model="newMovieDialog" max-width="500">
			<v-card>
				<v-card-title>
					<h3 class="headline mb-0">Add Movie</h3>
					<v-spacer></v-spacer>
					<v-btn icon @click="newMovieDialog = false" class="dialog-close-btn">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text>
					<v-text-field label="Movie" v-model="newMovieTitle"></v-text-field>
					<v-text-field label="Genre" v-model="newMovieGenre"></v-text-field>
					<v-textarea label="Summary" v-model="newMovieSummary"></v-textarea>
					<v-text-field label="Cover URL" v-model="newMovieCover"></v-text-field>
					<p class="grey--text font-weight-light" v-if="newMovieCover">Does the movie's cover display correctly?</p>
					<v-img max-width="200" :src="newMovieCover" v-if="newMovieCover"></v-img>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-btn :disabled="!newMovieTitle || !newMovieGenre || !newMovieSummary || !newMovieCover" text color="accent" @click="submitMovie()">Submit</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="watchMovieDialog" max-width="1000">
			<v-card>
				<v-card-title>
					<h3 class="headline mb-0">{{ watchMovieTitle }}</h3>
					<v-spacer></v-spacer>
					<v-btn icon @click="watchMovieDialog = false" class="dialog-close-btn">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-card-title>
				<video autoplay :poster="watchMovieCover" width="1000" :src="watchMovieURL" controls></video>
			</v-card>
		</v-dialog>
  </div>
</template>

<script>
import { db } from '@/firebase'

export default {
	name: 'Movies',
	props: { search: String },
  data() {
    return {
			movies: [],
			newMovieDialog: false,
			newMovieTitle: '',
			newMovieSummary: '',
			newMovieCover: '',
			newMovieGenre: '',
			watchMovieTitle: '',
			watchMovieURL: '',
			watchMovieDialog: false,
			watchMovieCover: ''
    }
  },
  created() {
		this.$root.loadingBar = true
		let ref = db.collection('movies').orderBy("title", "asc")

		ref.onSnapshot(snapshot => {
			snapshot.docChanges().forEach(change => {
				if(change.type === "added") {
					let doc = change.doc
					this.movies.splice(change.newIndex, 0, {
						id: doc.id,
						cover: doc.data().cover,
						genre: doc.data().genre,
						link: doc.data().link,
						summary: doc.data().summary,
						title: doc.data().title,
						available: doc.data().available
					})
				}
				if(change.type === "removed") {
					let doc = change.doc
					this.movies.splice(change.oldIndex, 1)
				}
				if(change.type === "modified") {
					let doc = change.doc
					this.movies.splice(change.oldIndex, 1, {
						id: doc.id,
						cover: doc.data().cover,
						genre: doc.data().genre,
						link: doc.data().link,
						summary: doc.data().summary,
						title: doc.data().title,
						available: doc.data().available
					})
				}
				this.$root.loadingBar = false
			})
		})
	},
	computed: {
		filteredMovies() {
			return this.movies.filter(movie => {
				return movie.title.toLowerCase().includes(this.search.toLowerCase()) || movie.genre.toLowerCase().includes(this.search.toLowerCase())
			})
		}
	},
	methods: {
		logMovie(movie) {
			this.$ga.event(this.$root.username, 'is watching ' + movie)
		},
		submitMovie() {
			if (this.newMovieTitle && this.newMovieSummary && this.newMovieCover && this.newMovieGenre) {
				db.collection('movies').add({
					title: this.newMovieTitle,
					summary: this.newMovieSummary,
					cover: this.newMovieCover,
					available: false,
					link: '',
					genre: this.newMovieGenre
				}).then(() => {
					this.newMovieDialog = false
					this.newMovieTitle = ''
					this.newMovieSummary = ''
					this.newMovieCover = ''
					this.newMovieGenre = ''
				})
			} else {
				this.$notify('Please fill in all of the required fields')
			}
		},
		watchMovie(title, url, cover) {
			this.watchMovieTitle = title
			this.watchMovieURL = url
			this.watchMovieCover = cover
			this.watchMovieDialog = true
			this.logMovie(title)
		}
	}
}
</script>

<style scoped>
@media screen and (min-width: 1240px) {
	div.movies {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-gap: 16px;
		margin-bottom: 32px;
	}
}

@media screen and (max-width: 1240px) {
	div.movies {
		margin-bottom: 32px;
	}
}

h1 {
  text-align: center;
}

div.v-card.movie-item {
	max-width: 400px;
	width: 100%;
	height: 100%;
}

video {
	position: relative;
	bottom: -6px;
  width: 100%;
  height: auto;
}
</style>
