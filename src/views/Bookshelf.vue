<template>
  <div class="index">
		<v-container>
			<div class="title" style="margin: 26px 0px 50px 0px; text-align: center;">
				<h1 class="display-3 blue--text font-weight-thin text-uppercase">Bookshelf</h1>
				<h6 class="headline red--text font-weight-thin">Rights to the items listed below are reserved for their creators.</h6>
				<v-text-field v-model="searchBook" label="Search..." style="width: 300px; margin: 50px auto 0px auto;" hint="Case sensitive"></v-text-field>
			</div>
			<div class="bookshelf">
				<v-card v-for="(book, index) in filteredBook" :key="index">
					<v-img :src="book.cover"></v-img>
					<v-card-title primary-title>
						<div>
							<h3 class="headline mb-0">{{ book.title }}</h3>
							<h4 class="subheading grey--text">By {{ book.author }}</h4>
						</div>
					</v-card-title>
					<v-divider></v-divider>
					<v-card-text>{{ book.summary }}</v-card-text>
					<v-card-actions>
						<v-btn v-if="book.available" flat color="accent" :href="book.link" @click="logBook(book.title)">Read</v-btn>
						<span v-if="!book.available" class="red--text font-weight-medium" style="margin: 6px;">UNAVAILABLE</span>
					</v-card-actions>
				</v-card>
			</div>
		</v-container>
  </div>
</template>

<script>
import db from '@/firebase'
import firebase,{ messaging } from 'firebase'

export default {
  name: 'Bookshelf',
  data() {
    return {
			bookshelf: [],
			searchBook: ''
    }
	},
  created() {
		let ref = db.collection('bookshelf').orderBy("title", "asc")

		ref.onSnapshot(snapshot => {
			snapshot.docChanges().forEach(change => {
				if(change.type === "added") {
					let doc = change.doc
					this.bookshelf.push({
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
			})
		})
	},
	computed: {
		filteredBook() {
			return this.bookshelf.filter(book => {
				return book.title.match(this.searchBook) || book.author.match(this.searchBook)
			})
		}
	},
	methods: {
		logBook(book) {
			this.$ga.event(this.$root.username,  + 'is reading ' + book)
			this.inquiryEvent(this.$root.username, 'is reading ' + book, 'Bookshelf', this.$root.accountColor)
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
	margin-top: 16px;
}
</style>
