<template>
  <div class="index">
		<v-container fluid grid-list-md>
			<v-layout wrap>
				<v-flex v-for="(item, index) in filteredBooks" :key="index" xs12 sm6 md4 lg3 xl2>
					<v-card class="book-item" ripple :disabled="!item.available" @click="readBook(item.title, item.link)">
						<v-img :src="item.cover">
							<v-card-title class="align-end fill-height" style="background-image: linear-gradient(transparent, #212121);">
								<div style="width: 100%;">
									<h3 class="headline mb-0">{{ item.title }}</h3>
									<div class="d-flex">
										<h4 class="body-2 grey--text">{{ item.author }}</h4>
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

		<v-btn color="deep-purple" fab fixed bottom right @click="newBookDialog = true">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
		<v-dialog v-model="newBookDialog" max-width="500">
			<v-card>
				<v-card-title>
					<h3 class="headline mb-0">Add Book</h3>
					<v-spacer></v-spacer>
					<v-btn icon @click="newBookDialog = false" class="dialog-close-btn">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text>
					<v-text-field label="Book" v-model="newBookTitle"></v-text-field>
					<v-text-field label="Author" v-model="newBookAuthor"></v-text-field>
					<v-text-field label="Genre" v-model="newBookGenre"></v-text-field>
					<v-textarea label="Summary" v-model="newBookSummary"></v-textarea>
					<v-text-field label="Cover URL" v-model="newBookCover"></v-text-field>
					<p class="grey--text font-weight-light" v-if="newBookCover">Does the book's cover display correctly?</p>
					<v-img max-width="200" :src="newBookCover" v-if="newBookCover"></v-img>
				</v-card-text>
				<v-divider></v-divider>
				<v-card-actions>
					<v-btn :disabled="!newBookTitle || !newBookGenre || !newBookSummary || !newBookCover || !newBookGenre" text color="accent" @click="submitBook()">Submit</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
  </div>
</template>

<script>
import { db } from '@/firebase'

export default {
	name: 'Bookshelf',
	props: { search: String },
  data() {
    return {
			bookshelf: [],
			newBookDialog: false,
			newBookTitle: '',
			newBookGenre: '',
			newBookSummary: '',
			newBookCover: '',
			newBookAuthor: ''
    }
	},
  created() {
		this.$root.loadingBar = true
		let ref = db.collection('bookshelf').orderBy("title", "asc")

		ref.onSnapshot(snapshot => {
			snapshot.docChanges().forEach(change => {
				if(change.type === "added") {
					let doc = change.doc
					this.bookshelf.splice(change.newIndex, 0, {
						id: doc.id,
						author: doc.data().author,
						cover: doc.data().cover,
						link: doc.data().link,
						summary: doc.data().summary,
						title: doc.data().title,
						available: doc.data().available
					})
				}
				if(change.type === "removed") {
					let doc = change.doc
					this.bookshelf.splice(change.oldIndex, 1)
				}
				if(change.type === "modified") {
					let doc = change.doc
					this.bookshelf.splice(change.oldIndex, 1, {
						id: doc.id,
						author: doc.data().author,
						cover: doc.data().cover,
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
		filteredBooks() {
			return this.bookshelf.filter(book => {
				return book.title.toLowerCase().includes(this.search.toLowerCase()) || book.author.toLowerCase().includes(this.search.toLowerCase())
			})
		}
	},
	methods: {
		readBook(book, url) {
			window.open(url)
			this.$ga.event(this.$root.username,  + 'is reading ' + book)
		},
		submitBook() {
			if (this.newBookTitle && this.newBookAuthor && this.newBookCover && this.newBookGenre && this.newBookSummary) {
				db.collection('bookshelf').add({
					title: this.newBookTitle,
					author: this.newBookAuthor,
					cover: this.newBookCover,
					available: false,
					link: '',
					genre: this.newBookGenre,
					summary: this.newBookSummary
				}).then(() => {
					this.newBookDialog = false
					this.newBookTitle = ''
					this.newBookAuthor = ''
					this.newBookCover = ''
					this.newBookGenre = ''
					this.newBookSummary = ''
				})
			} else {
				this.$notify('Please fill in all of the required fields')
			}
		}
	}
}
</script>

<style scoped>
@media screen and (min-width: 1240px) {
	div.bookshelf {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-gap: 16px;
		margin-bottom: 32px;
	}
}

@media screen and (max-width: 1240px) {
	div.bookshelf {
		margin-bottom: 32px;
	}
}

h1 {
  text-align: center;
}

.book-item {
	max-width: 400px;
	width: 100%;
	height: 100%;
}

.book-item div.v-card__actions {
	position: absolute;
	bottom: 0px;
	margin-top: 16px;
}
</style>
