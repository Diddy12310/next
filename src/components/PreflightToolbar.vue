<template>
  <v-app-bar app color="#0F1E3C">
    <v-slide-x-transition group>
      <div class="d-flex align-center" key="logo" v-if="!$root.notification">
        <v-img
          contain
          src="../assets/logo.webp"
          width="40"
          style="border-radius: 9999px"
          class="ma-2"
        />
      </div>

      <div class="d-flex" v-else key="notification">
        <v-icon :class="{ [`${$root.notification.class}`]: true }">{{
          $root.notification.icon
        }}</v-icon>
        <p
          class="mb-0 pb-0 ml-2"
          :class="{ [`${$root.notification.class}`]: true }"
        >
          {{ $root.notification.text }}
        </p>
      </div>
    </v-slide-x-transition>

    <v-spacer></v-spacer>

    <p
      class="font-weight-light text-h6 mb-0"
      :class="{
        centralize: $vuetify.breakpoint.smAndUp,
        'text-right': $vuetify.breakpoint.xsOnly,
      }"
    >
      <span v-if="!$root.user.password.includes('$2a$')"
        >Complete Account Creation</span
      >
      <span v-if="$root.user.preflight.in_recovery">Account Recovery</span>
      <span
        v-if="$root.user.preflight.violation"
        class="font-weight-black red--text"
        >NOTICE OF VIOLATION</span
      >
    </p>

    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script>
export default {
  name: "PreflightToolbar",
};
</script>

<style></style>
