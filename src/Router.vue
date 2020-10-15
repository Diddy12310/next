<template>
  <div>
    <v-slide-x-reverse-transition group hide-on-leave>
      <Landing v-if="$root.router == 'Landing'" key="Landing" />
      <Authentication
        v-if="$root.router == 'Authentication'"
        key="Authentication"
      />
      <Home v-if="$root.router == 'Home'" key="Home" />
      <Flamechat
        v-if="$root.router == 'Flamechat'"
        key="Flamechat"
        style="background-color: #131313; height: 100vh;"
      />
      <Media v-if="$root.router == 'Media'" key="Media" />
      <Satellite v-if="$root.router == 'Satellite'" key="Satellite" />
      <Paradox v-if="$root.router == 'The Paradox'" key="Paradox" />
      <Drawer v-if="$root.router == 'Drawer'" key="Drawer" />
      <People v-if="$root.router == 'People'" key="People" />
      <Broadcast v-if="$root.router == 'Broadcast'" key="Broadcast" />
      <Downloads v-if="$root.router == 'Downloads'" key="Downloads" />
      <Transmission v-if="$root.router == 'Transmission'" key="Transmission" />
      <Account v-if="$root.router == 'Account'" key="Account" />
      <Privacy v-if="$root.router == 'Privacy'" key="Privacy" />
      <Developer v-if="$root.router == 'Developer'" key="Developer" />
      <Terms v-if="$root.router == 'Terms'" key="Terms" />
      <Terminal v-if="$root.router == 'Terminal'" key="Terminal" />
      <Support v-if="$root.router == 'Support'" key="Support" />
      <SignUp v-if="$root.router == 'SignUp'" key="SignUp" />
      <Recovery v-if="$root.router == 'Recovery'" key="Recovery" />
    </v-slide-x-reverse-transition>
  </div>
</template>

<script>
import Landing from "./pages/Landing.vue";
import Authentication from "./pages/Authentication.vue";
import Home from "./pages/Home.vue";
import Flamechat from "./pages/Flamechat.vue";
import Media from "./pages/Media.vue";
import Satellite from "./pages/Satellite.vue";
import Paradox from "./pages/Paradox.vue";
import Drawer from "./pages/Drawer.vue";
import People from "./pages/People.vue";
import Broadcast from "./pages/Broadcast.vue";
import Downloads from "./pages/Downloads.vue";
import Transmission from "./pages/Transmission.vue";
import Account from "./pages/Account.vue";
import Privacy from "./pages/Privacy.vue";
import Developer from "./pages/Developer.vue";
import Terms from "./pages/Terms.vue";
import Terminal from "./pages/Terminal.vue";
import Support from "./pages/Support.vue";
import SignUp from "./pages/SignUp.vue";
import Recovery from "./pages/Recovery.vue";

export default {
  name: "Router",
  components: {
    Landing,
    Authentication,
    Home,
    Flamechat,
    Media,
    Satellite,
    Paradox,
    Drawer,
    People,
    Broadcast,
    Downloads,
    Transmission,
    Account,
    Privacy,
    Developer,
    Terms,
    Terminal,
    Support,
    SignUp,
    Recovery,
  },
};
</script>

<style></style>
