<template>
  <div style="margin: auto; max-width: 750px; padding: 32px">
    <h5 class="text-h4 my-4 text-uppercase">Effective immediately:</h5>
    <p>
      This account has been disabled due to the following violation(s) of our
      Terms and Conditions:
    </p>
    <ul>
      <li
        v-for="(item, index) in $root.user.preflight.violation.reports"
        :key="index"
        v-html="item"
      ></li>
    </ul>
    <p class="mt-4">
      Pertaining to the following sections of the Terms and Conditions:
    </p>
    <ul>
      <li
        v-for="(item, index) in $root.user.preflight.violation.conditions"
        :key="index"
        v-html="item"
      ></li>
    </ul>
    <p class="mt-4">
      Failure to begin to rectify these violations within seven days or failure
      to complete rectification process will result in the following (including,
      but not limited to):
    </p>
    <ul>
      <li
        v-for="(item, index) in $root.user.preflight.violation.punishments"
        :key="index"
        v-html="item"
      ></li>
    </ul>
    <p class="mt-4">
      We take our Terms and Conditions very seriously. But not at the expense of
      our users. If you believe this is a mistake or some sort of
      misunderstanding,
      <a class="white--text" href="mailto:paradigmdevelop@gmail.com"
        >contact us</a
      >
      immediately.
    </p>
    <p class="mt-4">
      To rectify, appeal, view evidence, or ask any questions, please
      <a class="white--text" href="mailto:paradigmdevelop@gmail.com"
        >contact us</a
      >.
    </p>
  </div>
</template>

<script>
export default {
  name: "ViolationPreflight",
};
</script>

<style>
</style>