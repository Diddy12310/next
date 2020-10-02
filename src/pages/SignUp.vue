<template>
  <div
    :style="{
      height: `calc(100vh - 64px)`,
      overflowY: 'auto',
    }"
    class="pa-4"
  >
    <div class="text-center" v-if="!invite_code_verified">
      <input
        v-model="invite_code"
        type="text"
        placeholder="Invite Code"
        class="text-center text-h3 font-weight-light mb-6 mt-12"
        style="width: 100%; font-family: 'Roboto-Mono';"
      />
      <span class="grey--text text-left"
        >Enter the invite code you received from the nominating core team
        member.<br />
        Please note that it is case sensitive.</span
      ><br />
      <v-btn
        :disabled="invite_code.length != 9"
        class="ma-auto mt-6"
        color="deep-purple darken-3"
        @click="verifyInviteCode()"
        >Verify</v-btn
      >
    </div>

    <div style="max-width: 500px;" class="mx-auto" v-else>
      <v-color-picker
        mode="hexa"
        hide-mode-switch
        class="mt-3 mb-3"
        flat
        style="margin: auto;"
        v-model="new_user.color"
      ></v-color-picker>
      <span class="grey--text"
        >Your color should represent yourself. Anywhere your username is
        displayed, so is your color.</span
      >
      <v-text-field
        hide-details="auto"
        class="mb-4"
        :count="50"
        autocomplete="off"
        type="text"
        name="bio"
        v-model="new_user.bio"
        label="Biography"
      ></v-text-field>
      <span class="grey--text">A short and sweet summary of yourself.</span>
      <v-file-input
        prepend-icon=""
        id="file"
        ref="file"
        v-model="new_user.pic"
        label="Profile Picture"
        :disabled="use_default"
      ></v-file-input>
      <span class="grey--text">A visual representation of yourself.</span>
      <v-checkbox
        v-model="use_default"
        label="Use default profile picture"
      ></v-checkbox>
      <v-checkbox
        hide-details="auto"
        label="I have read and accept the Terms and Conditions."
        v-model="new_user.terms"
        class="mb-4"
      ></v-checkbox>
      <span class="grey--text"
        >Please read and accept the
        <a @click="$root.view.terms = true">Terms and Conditions</a>. Confirm
        that you are over the age of 13. If you are under 18, parental
        permission is required.
        <a
          target="_blank"
          href="https://en.wikipedia.org/wiki/Children%27s_Online_Privacy_Protection_Act"
          >Learn more</a
        >.
      </span>
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
  name: "SignUp",
  data() {
    return {
      invite_code: "",
      invite_code_verified: true,
      new_user: {
        color: "",
        username: this.$root.user.username,
        password: this.$root.user.password,
      },
      use_default: false,
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
