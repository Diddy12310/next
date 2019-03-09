<template>
  <div class="index">
		<v-container>
			<h1 class="display-3 blue--text font-weight-thin text-uppercase" style="margin: 50px;">Music</h1>
			<div class="music">
				<v-card v-for="(item, index) in music" :key="index">
					<v-img :src="item.cover"></v-img>

					<v-card-title primary-title>
						<div>
							<h3 class="headline mb-0">{{ item.title }}</h3>
							<h4 class="subheading grey--text">{{ item.author }}&nbsp;&nbsp;|&nbsp;&nbsp;{{ item.duration }}</h4>
							<h4 class="body-2 grey--text">{{ item.album }}</h4>
						</div>
					</v-card-title>
					<v-divider></v-divider>
					<v-card-text></v-card-text>

					<v-card-actions>
						<audio controls class="control">
							<source :src="item.link" type='audio/mp4'>
							<!-- The next two lines are only executed if the browser doesn't support MP4 files -->
							<source :src="item.link" type='audio/ogg; codecs=vorbis'>
							<!-- The next line will only be executed if the browser doesn't support the <audio> tag-->
							<p>Your user agent does not support the HTML5 Audio element.</p>
						</audio>
					</v-card-actions>
				</v-card>
			</div>
		</v-container>

  </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
export default {
  name: 'Music',
  data() {
    return {
			music: []
    }
  },
  created() {
    db.collection('music').get().then(snapshot => {
      snapshot.forEach(doc => {
				let item = doc.data()
        item.id = doc.id
        this.music.push(item)
      })
		})
	}
}
</script>

<style scoped>
@media screen and (min-width: 1240px) {
	div.music {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-gap: 16px;
		margin-bottom: 32px;
	}
}

@media screen and (max-width: 1240px) {
	div.music {
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
	max-width: 375px;
	width: 400px;
	height: 100%;
}

div.v-card__actions {
	position: absolute;
	bottom: 0px;
}

audio {
	position: relative;
	top: +8px;
	left: -8px;
	width: 375px !important;
}
</style>