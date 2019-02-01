<template>
  <div class="changelog">
  	<h1>Changelog</h1>
		<div class="card" v-for="change in changelog" :key="change.id">
			<v-card>
				<v-badge color="blue"><span slot="badge" v-if="change.beta">B</span><v-card-title primary-title><span class="headline">{{ change.title }}</span></v-card-title></v-badge>
				
				<v-card-text>
					<v-list>
						<v-list-tile v-for="(list, index) in change.body" :key="index">
							<v-list-tile-content>
								<v-list-tile-title>{{ list }}</v-list-tile-title>
							</v-list-tile-content>
						</v-list-tile>
					</v-list>
				</v-card-text>
			</v-card>
			<div class="gap"></div>
		</div>
  </div>
</template>

<script>
import db from '@/firebase/init'
export default {
  name:'Changelog',
  data() {
    return {
      changelog: []
    }
  },
  created() {
    db.collection('changelog').get().then(snapshot => {
      snapshot.forEach(doc => {
        let change = doc.data()
        change.id = doc.id
        this.changelog.push(change)
      })
    })
  }
}
</script>

<style scoped>
h1 {
  text-align: center;
}

div.card {
  margin: auto;
  margin-bottom: 20px;
  width: 750px;
}

div.gap {
	height: 16px;
}
</style>
