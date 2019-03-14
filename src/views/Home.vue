<template>
	<div class="index">
		<v-parallax dark :src="homebg" class="paralax">
			<div class="home">
				<h2 class="display-3 font-weight-thin text-uppercase" style="position: relative; text-align: center; margin: auto; padding-top: 30vh;">Welcome to<br>the future</h2>
				<v-btn router to="flamechat" style="margin-top: 20px;" color="primary">Open Flamechat</v-btn>
			</div>
		</v-parallax>
		<h3 class="display-2" style="text-align: center; margin-top: 20px;">Announcements</h3>
		<v-card v-for="(announcement, index) in announcements" :key="index" style="width: 60vw; margin: 20px auto">
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

export default {
  name: 'Home',
  data() {
    return {
			announcements: [],
			homebg: 'http://relay.theparadigm.ga/img/home_bg.jpg'
		}
	},
  created() {
		var dbRef = db.collection('announcements').orderBy('time', 'desc').limit(5)
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

.v-parallax {
	background: url('./../assets/home_bg.jpg') center center;
	background-attachment: fixed;
}
</style>
