<template>
  <div class="privacy text-center">
    <v-row class="text-center">
      <v-col
        sm="12"
        class="light-blue darken-3 py-12 elevation-5"
        style="z-index: 5;"
      >
        <h1 class="text-h2 font-weight-thin white--text">Privacy</h1>
      </v-col>
    </v-row>

    <div
      class="px-4"
      :style="{
        height: `calc(100vh - ${$root.music.open ? '300px' : '220px'})`,
        overflowY: 'auto',
      }"
    >
      <h1 class="text-h3 font-weight-light text-uppercase pt-12">
        This is a private platform
      </h1>
      <p class="text-center py-6">
        No personal information about you or any other users will be collected,
        analyzed, interpreted,<br />
        or distributed to any other parties that are not associated with the
        development team at Paradigm.
      </p>

      <img
        src="../assets/logo.png"
        alt="Paradigm logo"
        width="50"
        class="ma-6 mx-auto"
      />

      <p class="text-center py-6 font-weight-black text-uppercase">
        By stating this, we expect the users of this platform to keep it and any
        activities performed on<br />
        it confidential, unless stated otherwise by the development team.
      </p>

      <img
        src="../assets/logo.png"
        alt="Paradigm logo"
        width="50"
        class="ma-6 mx-auto"
      />

      <p class="text-center py-6">
        We are not to be held responsible if a user willingly posts their own
        personal information on a chatroom,<br />
        direct message, Transmission call, username, biography, or profile
        picture.
      </p>

      <p class="grey--text">
        Please read our
        <a @click="$root.view.terms = true">Terms and Conditions</a> for more
        information.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Privacy",
};
</script>

<style scoped></style>
