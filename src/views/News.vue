<template>
	<div class="news">
		<h1 class="display-3 blue--text font-weight-thin text-uppercase" style="margin-top: 50px; text-align: center;">The Paradox</h1>
		<h3 class="display-1 blue-grey--text font-weight-light text-uppercase font-italic" style="text-align: center; margin-bottom: 50px;">Accuracy. Clarity. Legitimacy.</h3>

		<v-card v-for="item in news" :key="item.timestamp">
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">{{ item.title }}</h3>
          <div class="detitem" style="" v-for="(detitem, index) in item.detail" :key="index">{{ detitem }}</div>
        </div>
      </v-card-title>
    </v-card>

	</div>
</template>

<script>
import db from '@/firebase/init'

export default {
	name: 'News',
	data() {
		return {
			news: []
		}
	},
	created() {
    db.collection('news').get().then(snapshot => {
      snapshot.forEach(doc => {
        let item = doc.data()
        item.id = doc.id
        this.news.push(item)
      })
    })
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

div.v-card {
	max-width: 850px;
	min-width: 400px;
	margin: 20px auto;
}
</style>
