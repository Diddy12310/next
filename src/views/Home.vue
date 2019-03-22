<template>
	<div class="index">
		<v-parallax dark :src="homebg" class="paralax">
			<div class="home">
				<h2 class="display-3 font-weight-light text-uppercase" style="position: relative; text-align: center; margin: auto; padding-top: 30vh;">Welcome to<br>the future</h2>
				<v-btn router to="flamechat" style="margin-top: 20px;" color="primary">Open Flamechat</v-btn>
			</div>
		</v-parallax>

		<h1 class="display-3 blue--text font-weight-thin text-uppercase" style="margin: 25px; text-align: center;">Announcements</h1>
		<v-card v-for="(announcement, index) in announcements" :key="index" style="width: 100%; margin: 20px auto; max-width: 600px;">
			<v-card-title primary-title>
				<div>
					<h3 class="headline mb-0">{{ announcement.title }}</h3>
				</div>
			</v-card-title>
			<v-divider></v-divider>
			<v-card-text>
				<div v-for="item in announcement.detail" :key="item" class="item">{{ item }}</div>
			</v-card-text>
		</v-card>
	</div>
</template>

<script>
import db from '@/firebase/init'
import axios from 'axios'

export default {
  name: 'Home',
  data() {
    return {
			announcements: [],
			homebg: 'http://relay.theparadigmdev.com/img/home_bg.jpg'
		}
	},
  created() {
		var dbRef = db.collection('announcements').orderBy('time', 'desc').limit(3)
    dbRef.get().then(snapshot => {
      snapshot.forEach(doc => {
        let announcement = doc.data()
				announcement.id = doc.id
				this.announcements.push(announcement)
      })
		})
  }
}
</script>

<style scoped>
.paralax {
	height: 100% !important;
	background: url('./../assets/home_bg.jpg') center center;
	background-attachment: fixed;
}

.home {
	text-align: center;
	height: calc(100vh - 56px);
}

h1 {
  text-align: center;
}

.item {
	padding-bottom: 10px;
}

.item:last-of-type {
	padding-bottom: 0px;
}
</style>
