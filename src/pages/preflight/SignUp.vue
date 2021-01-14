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
        hide-details="auto"
        :persistent-hint="true"
        v-model="$root.user.username"
        label="Username"
        class="my-4"
        @keyup="checkIfUserExists()"
        :hint="
          username_exists && $root.user.username.length > 0
            ? 'This username is taken already!'
            : ''
        "
      ></v-text-field>
      <span class="grey--text"
        >This should represent who you are. This must be unique and is not
        changeable.</span
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
        <a @click="terms = true">Terms and Conditions</a>. Confirm that you are
        over the age of 13. If you are under 18, parental permission is
        required.
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

    <v-dialog
      v-model="terms"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      @keyup.esc="terms = false"
    >
      <v-card>
        <Terms />
        <v-btn
          style="z-index: 6"
          small
          text
          fab
          fixed
          top
          right
          @click="terms = false"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </v-card>
    </v-dialog>

    <v-btn
      @click="($root.user = false), $router.replace('/')"
      absolute
      bottom
      left
      text
      color="grey"
      >Cancel</v-btn
    >
  </div>
</template>

<script>
import Terms from "../Terms";

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
      terms: false,
      username_exists: false,
    };
  },
  components: {
    Terms,
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
    this.checkIfUserExists();
  },
  methods: {
    checkIfUserExists() {
      if (this.$root.user.username.length < 1) this.username_exists = true;
      else {
        this.$http
          .get(
            `https://www.theparadigmdev.com/api/users/check/${this.$root.user.username.toLowerCase()}`
          )
          .then((response) => {
            this.username_exists = response.data.exists;
          });
      }
    },

    signUp() {
      if (this.new_user.terms === true) {
        var regex = /([0-9A-Za-z_~.-])/gi;
        if (regex.test(this.new_user.username) && !this.username_exists) {
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
                    this.$initAppMenu();
                    this.$root.user = response.data;
                    this.$root.user._id
                      ? ""
                      : response.data.preflight
                      ? this.$router.push("/preflight")
                      : this.$router.push("/home");

                    this.$root.socket.emit("login", response.data.username);

                    const existsing_subscription = this.$root.user.notifications.find(
                      (subscription) =>
                        subscription._id == this.$getCookie("notification_id")
                    );
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
                this.$router.push("/home");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else
          this.$notify(
            "Enter a valid username",
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
