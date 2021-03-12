<template>
  <div>
    <v-overlay width="500">
      <div style="max-width: 500px !important; margin-bottom: 200px">
        <v-text-field
          style="width: 500px"
          class="text-h5"
          solo
          label="Search..."
          v-model="query"
          @keyup.enter="search()"
        ></v-text-field>

        <button class="talk">Talk</button>
        <h3 class="content"></h3>

        <v-card
          style="width: 500px"
          v-for="(result, index) in results"
          :key="index"
          @click="$router.push(result.path)"
        >
          <v-list-item>
            <v-list-item-icon class="mr-4"
              ><v-icon>{{ result.icon }}</v-icon></v-list-item-icon
            >
            <v-list-item-content>
              <v-list-item-title>{{ result.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ result.path }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item>
        </v-card>
      </div>
    </v-overlay>
  </div>
</template>

<script>
import { evaluate } from "mathjs";

export default {
  name: "Launchpad",
  data() {
    return {
      query: "",
      results: [],
    };
  },
  methods: {
    search() {
      this.results = [];
      for (const [key, value] of Object.entries(this.$root.config.apps)) {
        if (value.title.toLowerCase() == this.query.toLowerCase()) {
          let app = value;
          app.type = "app";
          this.results.push(app);
        }
      }
      this.results.push(evaluate(this.query).toString());
    },
  },
  created() {
    const btn = document.querySelector(".talk");
    const content = document.querySelector(".content");

    const YouTube = ["opening youtube sir"];
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    console.log(SpeechRecognition);
    const recognition = new SpeechRecognition();

    recognition.onstart = function () {
      console.log("How Can I Help You ?");
    };
    recognition.onresult = function (event) {
      const current = event.resultIndex;

      const transcript = event.results[current][0].transcript;
      content.textContent = transcript;
      readOutLoud(transcript);
    };

    btn.addEventListener("click", () => {
      recognition.start();
    });

    function readOutLoud(message) {
      const speech = new SpeechSynthesisUtterance();

      speech.text = "I am not able to understand ,sir";

      if (message.includes("YouTube")) {
        const finalText = YouTube[Math.floor(Math.random() * YouTube.length)];
        speech.text = finalText;
        window.open("https://www.youtube.com/");
      }
      speech.volume = 1;
      speech.rate = 1.1;
      speech.pitch = 1;

      window.speechSynthesis.speak(speech);
    }
  },
};
</script>

<style scoped>
</style>