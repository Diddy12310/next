<template>
	<div class="index">
  	<div class="home">
      <h2 class="display-3" style="position: relative; text-align: center; margin: auto; padding-top: 15%;">A social media platform<br>built for the 21st century</h2>
			<v-btn router to="flamechat" style="margin-top: 20px;" color="primary">Open Flamechat</v-btn>
  	</div>
		<h3 class="display-2" style="text-align: center; margin-top: 20px;">Announcements</h3>
    <v-card v-for="(announcement, index) in announcements" :key="index" style="width: 500px; margin: 20px auto">
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">{{ announcement.title }}</h3>
          <div>{{ announcement.detail }}</div>
        </div>
      </v-card-title>
    </v-card>
	</div>
</template>

<script>
import db from '@/firebase/init'

export default {
  name: 'home',
  data() {
    return {
			announcements: []
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

div.mdl-card {
  margin: auto;
  margin-bottom: 10px;
  min-height: 0;
}

ul {
  margin-top: 0;
  padding-left: 20px;
}

.mdl-card__supporting-text {
	text-align: left;
	padding-bottom: 15px;
}
</style>
