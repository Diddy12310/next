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
        style="width: 100%; font-family: 'Roboto-Mono'"
      />
      <span class="grey--text text-left"
        >Enter the invite code you received.<br />
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

    <div style="max-width: 500px" class="mx-auto" v-else>
      <v-text-field
        hide-details
        v-model="$root.user.username"
        label="Username"
        class="my-4"
      ></v-text-field>
      <span class="grey--text"
        >Contrary to most other platforms, your username does not need to be
        unique, but it should represent who you are.</span
      >
      <v-text-field
        hide-details
        v-model="$root.user.password"
        label="Password"
        type="password"
        class="my-4"
      ></v-text-field>
      <span class="grey--text"
        >Your password should be as secure as possible. It is recommended to use
        different passwords for different accounts.</span
      >
      <v-color-picker
        mode="hexa"
        hide-mode-switch
        class="my-3"
        flat
        style="margin: auto"
        v-model="new_user.color"
      ></v-color-picker>
      <span class="grey--text"
        >Your color should represent yourself. Anywhere your username is
        displayed, so is your color.</span
      >
      <v-text-field
        hide-details="auto"
        class="my-4"
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
        class="mt-4"
      ></v-file-input>
      <span class="grey--text">A visual representation of yourself.</span>
      <!-- <v-checkbox
        v-model="use_default"
        label="Use default profile picture"
      ></v-checkbox> -->
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
        class="mt-6 mb-8 mx-auto"
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
      invite_code_verified: false,
      new_user: {
        color: "",
        username: this.$root.user.username.toLowerCase(),
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
              pinned_apps: ["Wire", "Drawer", "Broadcast"],
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
                  .then(async (response) => {
                    this.$root.nav = [
                      {
                        icon: "mdi-home",
                        content: "Home",
                        disabled: false,
                        rights: true,
                      },
                      {
                        icon: "mdi-message",
                        content: "Wire",
                        disabled: false,
                        rights: true,
                      },
                      {
                        icon: "mdi-web",
                        content: "Satellite",
                        disabled: false,
                        rights: true,
                      },
                      {
                        icon: "mdi-newspaper",
                        content: "The Paradox",
                        disabled: false,
                        rights: true,
                      },
                      {
                        icon: "mdi-folder-multiple",
                        content: "Drawer",
                        disabled: false,
                        rights: true,
                      },
                      {
                        icon: "mdi-play",
                        content: "Media",
                        disabled: false,
                        rights: true,
                      },
                      {
                        icon: "mdi-account-group",
                        content: "People",
                        disabled: false,
                        rights: true,
                      },
                      {
                        icon: "mdi-satellite-uplink",
                        content: "Broadcast",
                        disabled: false,
                        rights: true,
                      },
                      {
                        icon: "mdi-download",
                        content: "Downloads",
                        disabled: false,
                        rights: true,
                      },
                      {
                        icon: "mdi-shield-lock",
                        content: "Privacy",
                        disabled: false,
                        rights: true,
                      },
                      {
                        icon: "mdi-feather",
                        content: "Terms",
                        disabled: false,
                        rights: true,
                      },
                      {
                        icon: "mdi-lifebuoy",
                        content: "Support",
                        disabled: false,
                        rights: true,
                      },

                      {
                        icon: "mdi-code-tags",
                        content: "Developer",
                        disabled: false,
                        rights: response.data.rights.developer,
                      },
                      {
                        icon: "mdi-console-line",
                        content: "Terminal",
                        disabled: false,
                        rights: response.data.rights.admin,
                      },
                    ];

                    this.$root.user = response.data;
                    this.$root.router = "Home";
                    response.data.preflight
                      ? (this.$root.router = "Preflight")
                      : (this.$root.router = "Home");
                    this.$root.socket.emit("login", response.data.username);

                    const existsing_subscription = this.$root.user.notifications.find(
                      (subscription) =>
                        subscription._id == this.$getCookie("notification_id")
                    );
                    console.log(existsing_subscription);
                    if (
                      ((await this.$root.worker.pushManager.permissionState()) !=
                        "granted" &&
                        !existsing_subscription) ||
                      ((await this.$root.worker.pushManager.permissionState()) ==
                        "granted" &&
                        !existsing_subscription)
                    ) {
                      console.log("Registering Push...");
                      const subscription = await this.$root.worker.pushManager.subscribe(
                        {
                          userVisibleOnly: true,
                          applicationServerKey: this.$urlBase64ToUint8Array(
                            this.$root.public_vapid_key
                          ),
                        }
                      );
                      console.log("Push Registered...");
                      console.log("Sending Push...");
                      this.$http
                        .post(
                          `https://www.theparadigmdev.com/api/notifications/${response.data._id}/subscribe`,
                          {
                            data: subscription,
                          }
                        )
                        .then((response) => {
                          console.log("Push Sent...");
                          console.log(response.data._id);
                          document.cookie = `notification_id=${response.data._id}; Secure`;
                        })
                        .catch((error) => console.error(error));
                    }
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
    verifyInviteCode() {
      this.$http
        .put(`https://www.theparadigmdev.com/api/apollo`, {
          code: this.invite_code,
        })
        .then((response) => {
          if (response.data.used === true || response.data.used === null)
            this.$notify(
              "Invite code is invalid",
              "error",
              "mdi-exclamation",
              false,
              3000
            );
          else this.invite_code_verified = true;
        });
    },
  },
};
</script>

<style scoped></style>
