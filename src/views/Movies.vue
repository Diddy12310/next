<template>
  <div class="index">
		<v-container>
			<h1 class="display-3 blue--text font-weight-thin text-uppercase" style="margin: 26px 0px 50px 0px;">Movies</h1>
			<div class="movies">
				<v-card v-for="(movie, index) in movies" :key="index">
					<v-img :src="movie.cover"></v-img>

					<v-card-title primary-title>
						<div>
							<h3 class="headline mb-0">{{ movie.title }}</h3>
							<h4 class="subheading grey--text">{{ movie.duration }}</h4>
						</div>
					</v-card-title>
					<v-divider></v-divider>
					<v-card-text>{{ movie.summary }}</v-card-text>

					<v-card-actions>
						<v-btn v-if="movie.available" flat color="accent" :href="movie.link">Watch</v-btn>
						<span v-if="!movie.available" class="red--text font-weight-medium" style="margin: 6px;">UNAVAILABLE</span>
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
  name: 'Movies',
  data() {
    return {
			movies: []
    }
  },
  created() {
    db.collection('movies').orderBy("title", "asc").get().then(snapshot => {
      snapshot.forEach(doc => {
        let movie = doc.data()
				movie.id = doc.id
				
        this.movies.push(movie)
      })
		})
	}
}
</script>

<style scoped>
@media screen and (min-width: 1240px) {
	div.movies {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-gap: 16px;
		margin-bottom: 32px;
	}
}

@media screen and (max-width: 1240px) {
	div.movies {
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
	margin-top: 16px;
}
</style>
