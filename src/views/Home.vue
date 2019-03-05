<template>
	<div class="index">
  	<div class="home">
      <h2 class="display-3 font-weight-thin text-uppercase" style="position: relative; text-align: center; margin: auto; padding-top: 15%;">Welcome to<br>the future</h2>
			<v-btn router to="flamechat" style="margin-top: 20px;" color="primary">Open Flamechat</v-btn>
  	</div>
		<h3 class="display-2" style="text-align: center; margin-top: 20px;">Announcements</h3>
		<v-card v-for="(announcement, index) in announcements" :key="index" style="width: 500px; margin: 20px auto">
			<v-card-title primary-title>
				<div>
					<h3 class="headline mb-0">{{ announcement.title }}</h3>
					<div v-for="item in announcement.detail" :key="item" class="item">{{ item }}</div>
				</div>
			</v-card-title>
		</v-card>
	</div>
</template>

<script>
import db from '@/firebase/init'

export default {
  name: 'Home',
  data() {
    return {
			announcements: []
		}
  },
	methods: {
		reload() {
			location.reload()
		},
		track() {
			this.$ga.page(this.$router)
		}
	},
  created() {
		var dbRef = db.collection('announcements').orderBy('time', 'desc')
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
.home {
	text-align: center;
	height: calc(100vh - 56px);
	background: url('./../assets/home_bg.jpg') center center;
	background-attachment: fixed;
}

h1 {
  text-align: center;
}

.item {
	padding-top: 10px;
}
</style>
