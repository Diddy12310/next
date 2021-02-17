<template>
  <div :style="{ height: `calc(100vh - 64px)`, overflowY: 'auto' }">
    <Violation v-if="$root.user.preflight.violation" />
    <Recovery v-if="$root.user.preflight.recovery" />
    <SignUp v-if="$root.user.preflight.creation" />
  </div>
</template>

<script>
import Violation from "./Violation.vue";
import Recovery from "./Recovery.vue";
import SignUp from "./SignUp.vue";

export default {
  name: "Preflight",
  components: {
    Violation,
    Recovery,
    SignUp,
  },
  created() {
    if (!this.$root.user.preflight) this.$router.replace("/");
  },
};
</script>

<style scoped>
</style>