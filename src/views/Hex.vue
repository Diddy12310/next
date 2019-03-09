<template>
  <div class="index">
		<v-container>
			<h1 class="display-3 blue--text font-weight-thin text-uppercase" style="margin: 50px;">Hex</h1>
			<div class="hex">
				<v-card v-for="(hw, index) in hex" :key="index">

					<v-card-title primary-title>
						<div>
							<h3 class="headline mb-0">{{ hw.title }}</h3>
							<h4 class="subheading grey--text">{{ hw.date }} | {{ hw.cost }}</h4>
						</div>
					</v-card-title>
					<v-divider></v-divider>
					<v-card-text>{{ hw.detail }}</v-card-text>
					<v-card-actions>
						<v-btn flat color="accent" :href="hw.buylink">Buy</v-btn>
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
  name: 'Hex',
  data() {
    return {
			hex: []
    }
  },
  created() {
    db.collection('hex').get().then(snapshot => {
      snapshot.forEach(doc => {
				let item = doc.data()
        item.id = doc.id
        this.hex.push(item)
      })
		})
	}
}
</script>

<style scoped>
@media screen and (min-width: 1240px) {
	div.hex {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-gap: 16px;
		margin-bottom: 32px;
	}
}
@media screen and (max-width: 1240px) {
	div.Hex {
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