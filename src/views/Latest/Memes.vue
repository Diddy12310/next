<template>
	<div class="memes">
		<v-container>
			<h1 class="display-3 blue--text font-weight-thin text-uppercase" style="margin: 26px 0px 50px 0px; text-align: center;">Latest Memes</h1>
			<div v-for="post in meirl" :key="post.data.id">
				<v-card v-if="!post.data.is_video" style="max-width: 800px; margin: 20px auto">
					<v-img :src="post.data.url"></v-img>
					<v-card-title primary-title>
						<div>
							<h3 class="headline mb-0">{{ post.data.title }}</h3>
							<h4 class="subheading grey--text">{{ post.data.author }}</h4>
						</div>
					</v-card-title>
				</v-card>
			</div>
		</v-container>
	</div>
</template>

<script>
import axios from 'axios'

export default {
	name: 'Latest Memes',
	data() {
		return {
			meirl: []
		}
	},
	created() {
		axios.get('https://www.reddit.com/r/me_irl.json')
			.then(response => {
				let data = response.data.data.children
				this.meirl = data
			})
			.catch(function (error) {
				// handle error
				console.log(error)
			})
			.then(function () {
				// always executed
			})

	}
}
</script>

<style scoped>

</style>
