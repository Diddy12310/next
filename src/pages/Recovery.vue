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
      ></v-text-field>

      <v-text-field
        hide-details
        v-model="recovery.email"
        label="Email Address"
        prepend-icon="mdi-email"
      >
      </v-text-field>

      <v-text-field
        hide-details
        v-model="recovery.phone"
        label="Phone Number"
        prepend-icon="mdi-phone"
      >
      </v-text-field>

      <v-btn
        block
        class="mt-6 mx-auto"
        color="deep-purple darken-4"
        @click="signUp()"
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
  created() {
    let randomHex = "";
    const characters = "0123456789ABCDEF";
    let charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      randomHex += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }
    this.new_user.color = `#${randomHex}`;
  },
  methods: {
    signUp() {
      // if (this.new_user.password === this.new_user.password_confirm) {
      if (this.new_user.terms === true) {
        var regex = /([0-9A-Za-z_~.-])/gi;
        if (regex.test(this.new_user.username)) {
          this.$http
            .post("https://www.theparadigmdev.com/api/users/register", {
              username: this.new_user.username.toLowerCase(),
              password: this.new_user.password,
              bio: this.new_user.bio,
              color: this.new_user.color,
              rights: {
                admin: false,
                author: false,
                asteroid: false,
                patriot: false,
                developer: false,
                apollo: true,
              },
              moonrocks: 0,
              code: this.invite_code,
              pinned_apps: ["Flamechat", "Drawer", "Broadcast"],
            })
            .then((response) => {
              if (!this.use_default) {
                let formData = new FormData();
                formData.append("files[0]", this.new_user.pic);
                this.$http
                  .post(
                    `https://www.theparadigmdev.com/api/users/${response.data._id}/pic`,
                    formData,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    }
                  )
                  .then((response) => {
                    this.$root.user = response.data;
                    this.$root.router = "Home";
                  })
                  .catch((error) => {
                    console.log("Upload: failed", error);
                  });
              } else {
                this.$root.user = response.data;
                this.$root.router = "Home";
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else
          this.$notify(
            "Username contains invalid special characters",
            "error",
            "mdi-account-plus",
            false,
            3000
          );
      } else
        this.$notify(
          "Read and accept the terms",
          "error",
          "mdi-account-plus",
          false,
          3000
        );
      // } else
      //   this.$notify(
      //     "Passwords do not match",
      //     "error",
      //     "mdi-account-plus",
      //     false,
      //     3000
      //   );
    },
  },
};
</script>

<style scoped></style>
