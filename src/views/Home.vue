<template>
	<div class="home">
  	<div style="text-align: center; height: calc(100% - 20px); background: url(./../assets/home_bg.jpg); background-attachment: fixed;" class="home">
      <h2 class="mdl-layout--large-screen-only" style="line-height: 70px; position: relative; text-align: center; margin: auto; padding-top: 15%; color: white;">A social media platform<br>built for the 21st century</h2>
      <h3 class="mdl-layout--small-screen-only" style="line-height: 50px; position: relative; text-align: center; margin: auto; padding-top: 30%; color: white;">A social media platform<br>built for the 21st century</h3>
      <router-link style="margin-top: 20px;" to="flamechat" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">Open Flamechat</router-link>
  	</div>
		<h1>Announcements</h1>
		<div v-for="(announcement, index) in announcements" :key="index" class="announcements mdl-card">
			<div class="mdl-card__title">
				<h3 class="mdl-card__title-text">{{ announcement.title }}</h3>
			</div>
			<div class="mdl-card__supporting-text"></div>
		</div>
	</div>
</template>

<script>
import db from './../../firebase/init'

export default {
  name: 'home',
  data() {
    return {
			announcements: []
		}
  },
  created() {
    db.collection('announcements').get().then(snapshot => {
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

</style>
