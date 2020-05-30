<template>
  <div class="privacy">
    <v-container fluid class="text-center pt-0">
      <v-row>
        <v-col sm="12" class="light-blue darken-3 py-12 elevation-5" style="z-index: 5;">
          <h1 class="display-3 font-weight-thin white--text">Privacy</h1>
        </v-col>
        <!-- <v-col sm="12" class="deep-purple darken-2 elevation-5 py-4">
          <h3 class="mt-2 display-1 grey--text font-weight-light">Paradigm</h3>
        </v-col> -->
      </v-row>
    </v-container>

    <h1 class="display-2">Data we Don't Collect</h1>
    <ul>
      <li>Your name</li>
      <li>Your date of birth</li>
      <li>Your age</li>
      <li>Where you live</li>
      <li></li>
    </ul>

    <h1 class="display-2">Data we Do Collect</h1>
    <ul>
      <li>Whether you are logged in or not</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Privacy'
}
</script>

<style scoped>

</style>