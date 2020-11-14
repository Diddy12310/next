<template>
  <div style="margin: auto; max-width: 750px; marign: 32px">
    <h5 class="text-h5 my-4">Effective immediately:</h5>
    <p>
      Your account has been disabled due to the following violation(s)/report(s)
      of violation(s) of our Terms and Conditions:
    </p>
    <ul>
      <li v-html="$root.user.preflight.violation.reports"></li>
    </ul>
    <p class="mt-4">
      Failure to begin to rectify these violations within seven days or failure
      to complete rectification process will result in the following (including,
      but not limited to):
    </p>
    <ul>
      <li v-html="$root.user.preflight.violation.punishments"></li>
    </ul>
    <p class="mt-4">
      To rectify, appeal, view evidence, or ask any questions, please
      <a class="white--text" href="mailto:paradigmdevelop@gmail.com"
        >contact us</a
      >
      immediately.
    </p>
    <p>Sincerely,<br />Conditions Enforcement</p>
  </div>
</template>

<script>
export default {
  name: "ViolationPreflight",
};
</script>

<style>
</style>