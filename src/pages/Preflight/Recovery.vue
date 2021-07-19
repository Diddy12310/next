<template>
  <div
    :style="{
      height: `calc(100vh - 64px)`,
      overflowY: 'auto',
    }"
    class="pa-4"
  >
    <div style="max-width: 500px" class="mx-auto">
      <v-text-field
        hide-details
        v-model="recovery.username"
        label="Username"
        prepend-icon="mdi-account"
        class="my-4"
      ></v-text-field>
      <p class="grey--text">Username of account to be recovered.</p>

      <v-text-field
        hide-details
        v-model="recovery.name"
        label="Name"
        prepend-icon="mdi-card-account-details"
        class="my-4"
      >
      </v-text-field>
      <p class="grey--text">
        Your full legal name, first, middle (if applicable), and last.
      </p>

      <v-text-field
        hide-details
        v-model="recovery.email"
        label="Email Address"
        prepend-icon="mdi-email"
        class="my-4"
      >
      </v-text-field>
      <p class="grey--text">
        Your personal email address that you use most often.
      </p>

      <v-text-field
        hide-details
        v-model="recovery.phone"
        label="Phone Number"
        prepend-icon="mdi-phone"
        class="my-4"
      >
      </v-text-field>
      <p class="grey--text">Your personal cell phone number.</p>

      <p class="grey--text">
        A member of our support staff will contact you soon after you submit
        this request to verify it, via email and phone.
      </p>

      <p class="grey--text">
        We take security very seriously, so this process will take some time as
        we analyze your recent actions and verify your identity. If it is
        determined that your account has not been comprimised and this account
        does belong to you, we will reset your password. All personal
        information entered will be deleted upon a successful recovery. If we
        determine this request to be malicious, personal information entered
        will be kept and you will be investigated thoroughly.
      </p>

      <p class="grey--text">
        By clicking Finish, you acknowledge and understand the statement above.
      </p>
      <v-btn
        block
        class="mt-6 mx-auto"
        color="deep-purple darken-4"
        @click="recover()"
        >Finish</v-btn
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "Recovery",
  data() {
    return {
      recovery: {},
    };
  },
  methods: {
    recover() {
      this.$http
        .post(
          `https://www.theparadigmdev.com/api/users/${this.recovery.username}/recover`,
          this.recovery
        )
        .then((response) => {})
        .catch((error) => console.error(error));
    },
  },
};
</script>

<style scoped></style>
