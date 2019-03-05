<template>
  <div class="index">
		<h1>Bookshelf</h1>
		<div class="bookshelf">
			<div v-for="(book, index) in bookshelf" :key="index" class="mdl-card mdl-shadow--4dp">
				<div class="mdl-card__title"><h2 class="mdl-card__title-text">{{ book.title }}</h2></div>
				<div class="mdl-card__media"><img :src="book.cover"></div>
				<div class="mdl-card__supporting-text">
					<h6>By {{ book.author }}</h6>
					<p>{{ book.summary }}</p>
				</div>
				<div class="mdl-card__actions mdl-card--border"><a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" :href="book.link">Download</a></div>
			</div>
		</div>
  </div>
</template>

<script>
import db from '@/firebase/init'

export default {
  name: 'Bookshelf',
  data() {
    return {
      bookshelf: []
    }
  },
  created() {
    db.collection('bookshelf').get().then(snapshot => {
      snapshot.forEach(doc => {
        let book = doc.data()
        book.id = doc.id
        this.bookshelf.push(book)
      })
    })
  }
}
</script>

<style scoped>
.mdl-card__media {
	background-color: black;
}

div.bookshelf {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
}

h1 {
  text-align: center;
}

div.mdl-card {
	margin: auto;
  margin-bottom: 10px;
}
</style>
