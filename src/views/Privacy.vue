<template>
  <div class="privacy text-center">
    <v-container fluid class="text-center pt-0">
      <v-row>
        <v-col sm="12" class="light-blue darken-3 py-12 elevation-5" style="z-index: 5;">
          <h1 class="text-h2 font-weight-thin white--text">Privacy</h1>
        </v-col>
      </v-row>
    </v-container>

    <div class="scrollable-shell px-4">
      <h1 class="text-h3 font-weight-light text-uppercase pt-12">This is a private platform</h1>
      <p class="text-center py-6">
        No personal information about you or any other users will be collected, analyzed, interpreted,<br>
        or distributed to any other parties that are not associated with the development team at Paradigm.
      </p>

      <img src="../assets/plogo.png" alt="Paradigm logo" height="50" class="ma-6">

      <p class="text-center py-6 font-weight-black text-uppercase">
        By stating this, we expect the users of this platform to keep it and any activities performed on<br>
        it confidential, unless stated otherwise by the development team.
      </p>

      <img src="../assets/plogo.png" alt="Paradigm logo" height="50" class="ma-6">

      <p class="text-center py-6">
        We are not to be held responsible if a user willingly posts their own personal information on a chatroom,<br>
        direct message, Transmission call, username, biography, or profile picture.
      </p>

      <p class="grey--text">Please read our <a href="https://github.com/Paradigm-Dev/paradigm/blob/master/TERMS.md">Terms and Conditions</a> for more information.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Privacy'
}
</script>

<style scoped>
.scrollable-shell {
  height: calc(100vh - 220px);
  overflow-y: auto;
}
</style>