<template>
  <div class="changelog">
  	<h1>Changelog</h1>
    <div class="mdl-card" v-for="change in changelog" :key="change.id">
      <div class="mdl-card__title"><h2 class="mdl-card__title-text">{{ change.title }}</h2><span v-if="change.beta" class="mdl-badge" data-badge="B"></span></div>
      <div class="mdl-card__supporting-text">
        <ul>
          <li v-for="(list, index) in change.body" :key="index">{{ list }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import db from './../../firebase/init'
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

div.mdl-card {
  margin: auto;
  margin-bottom: 10px;
  min-height: 0;
}

ul {
  margin-top: 0;
  padding-left: 20px;
}
</style>
