<template>
  <div>
    <v-toolbar dense color="red">
      <v-toolbar-title>Support</v-toolbar-title>
    </v-toolbar>

    <v-container
      class="text-center grey--text text--lighten-2"
      :style="{
        height: `calc(100vh - ${$root.music.open ? '192px' : '112px'})`,
        overflowY: 'auto',
      }"
    >
      <v-row>
        <v-col sm="6">
          <p>
            If you need assistance with Paradigm or have any questions, email
            <a href="mailto:paradigmdevelop@gmail.com"
              >paradigmdevelop@gmail.com</a
            >
            or call or text (412) 427-0411.
          </p>
          <p>
            If there is a bug or any other sort of glitch,
            <a
              @click="
                $root.view.bug_report = true;
                $root.view.support = false;
              "
              >file a bug report</a
            >.
          </p>
          <p class="mb-0">
            Many issues can be temporarily solved by refreshing the page.
          </p>
        </v-col>

        <v-col sm="6">
          <v-card max-width="500" class="mx-auto">
            <v-card-title class="text-h5 font-weight-medium"
              >REPORT A BUG</v-card-title
            >

            <v-card-text>
              <v-text-field
                hide-details="auto"
                class="mb-4"
                label="Title"
                v-model="new_bug.title"
              ></v-text-field>
              <v-select
                hide-details
                class="mb-4"
                :items="bug_categories"
                label="Category"
                v-model="new_bug.category"
              ></v-select>
              <v-autocomplete
                hide-details
                class="mb-4"
                :items="bug_locations"
                label="Location"
                v-model="new_bug.location"
              ></v-autocomplete>
              <v-slider
                hide-details
                class="mb-4"
                label="Priority"
                v-model="new_bug.priority"
                thumb-label
                max="5"
              ></v-slider>
              <v-textarea
                hide-details
                class="mb-4 pt-0 mt-0"
                label="Description"
                v-model="new_bug.description"
              ></v-textarea>

              <div>
                <img
                  src="@/assets/moonrocks.png"
                  alt="Moonrocks"
                  class="moonrock-img"
                /><span class="moonrock-count font-weight-medium green--text"
                  >+ 15</span
                >
                <p>If this bug exists, you will be awarded 15 Moonrocks.</p>
                <p>
                  New Balance:
                  <span class="font-weight-light"
                    >{{ $root.user.moonrocks + 15 }} Moonrocks</span
                  >
                </p>
              </div>
            </v-card-text>

            <v-card-actions>
              <v-btn
                text
                color="grey"
                @click="
                  $root.view.bug_report = false;
                  new_bug = {};
                "
                >Cancel</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn text color="blue accent-1" @click="submit()">Submit</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Support",
  data() {
    return {
      new_bug: {},
      bug_categories: ["Feature", "UI", "Unexpected response"],
      bug_locations: [
        "Toolbar",
        "Navigation drawer",
        "Footer",
        "Home",
        "Flamechat",
        "The Paradox",
        "Satellite",
        "Drawer",
        "Media",
        "Terms and Conditions",
        "Relay",
        "Account",
        "People",
        "Broadcast",
        "Terminal",
        "Support",
        "Report a Bug",
      ],
    };
  },
  methods: {
    submit() {
      this.new_bug.username = this.$root.user.username;
      this.new_bug.uid = this.$root.user._id;
      this.$http
        .post(
          `https://www.theparadigmdev.com/api/bugs/${this.$root.user._id}`,
          this.new_bug
        )
        .then((response) => {
          this.$root.view.bug_report = false;
          this.new_bug = {};
        });
    },
  },
};
</script>

<style scoped></style>
