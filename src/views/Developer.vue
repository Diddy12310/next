<template>
  <div class="developer">
    <v-toolbar dense color="blue-grey darken-4">
      <v-toolbar-title>Developer</v-toolbar-title>
    </v-toolbar>
    <v-tabs v-model="tab" centered background-color="blue-grey darken-4" color="white">
      <v-tab>Dashboard</v-tab>
      <v-tab>Timeline</v-tab>
      <v-tab>Documentation</v-tab>
      <v-tab>Resources</v-tab>
    </v-tabs>
  </div>
</template>

<script>
export default {
  name: 'Developer',
  data() {
    return {
      tab: 0
    }
  }
}
</script>

<style scoped>

</style>