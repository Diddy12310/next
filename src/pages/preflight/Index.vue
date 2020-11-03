<template>
  <div :style="{ height: `calc(100vh - 64px)`, overflowY: 'auto' }">
    <Violation v-if="$root.user.preflight.violation" />
  </div>
</template>

<script>
import Violation from "./Violation.vue";

export default {
  name: "Preflight",
  components: {
    Violation,
  },
};
</script>

<style scoped>
</style>