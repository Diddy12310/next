<template>
	<div class="news">
		<h1 class="display-3 blue--text font-weight-thin text-uppercase" style="margin-top: 50px; text-align: center;">The Paradox</h1>
		<h3 class="display-1 blue-grey--text font-weight-light text-uppercase font-italic" style="text-align: center; margin-bottom: 50px;">Accuracy. Transparency. Legitimacy.</h3>

		<v-card v-for="item in news" :key="item.timestamp">
			<div v-if="item.uploaded">
				<v-img :src="item.cover"></v-img>

				<v-card-title primary-title>
					<div>
						<h3 class="headline mb-0">{{ item.title }}</h3>
						<h4 class="subheading grey--text">{{ item.author }} | {{ item.timestamp }}</h4>
					</div>
				</v-card-title>
				<v-divider></v-divider>
				<v-card-text>
					<div class="detitem" v-html="detitem" v-for="(detitem, index) in item.detail" :key="index"></div>
				</v-card-text>
			</div>
    </v-card>

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
			username: ''
		}
	},
	created() {
		this.username = this.$parent.$parent.$parent.username
		let ref = db.collection('news').orderBy("stamp", "desc")

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
	max-width: 750px;
	width: 100%;
	margin: 20px auto;
}
</style>
