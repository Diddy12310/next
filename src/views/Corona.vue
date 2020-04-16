<template>
  <div style="height: calc(100vh - 64px);">
    <v-row no-gutters>
      <v-col sm="12" class="opening">
        <h1 class="display-3 font-weight-black text-center" style="padding-top: 32vh;">CORONAVIRUS (COVID-19)</h1>
        <h1 class="display-1 text-center pt-3">Facts, Figures, and Truths</h1>
      </v-col>
    </v-row>

    <v-row class="symptoms" no-gutters style="height: 500px;">
      <v-col sm="6" class="red darken-4">
        <h1 class="display-2">SYMPTOMS</h1>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'Corona'
}
</script>

<style scoped>
.opening {
  background: url('./../assets/corona/corona.jpg');
	height: calc(100vh - 64px);
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
  /* background-attachment: fixed; */
}
</style>