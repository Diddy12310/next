<template>
  <div class="router">
    <v-fade-transition hide-on-leave group>
      <home key="home" v-if="$root.router === 'home'" />
      <auth key="auth" v-else-if="$root.router === 'auth'" />
      <account key="account" v-else-if="$root.router === 'account'" />
      <flamechat key="flamechat" v-else-if="$root.router === 'flamechat'" />
      <satellite key="satellite" v-else-if="$root.router === 'satellite'" />
      <paradox key="paradox" v-else-if="$root.router === 'paradox'" />
      <drawer key="drawer" v-else-if="$root.router === 'drawer'" />
      <media key="media" v-else-if="$root.router === 'media'" />
    </v-fade-transition>
  </div>
</template>

<script>
import Home from '@/views/Home.vue'
import Auth from '@/views/Auth.vue'
import Account from '@/views/Account.vue'
import Flamechat from '@/views/Flamechat.vue'
import Satellite from '@/views/Satellite.vue'
import Paradox from '@/views/Paradox.vue'
import Drawer from '@/views/Drawer.vue'
import Media from '@/views/Media.vue'

export default {
  name: 'Router',
  components: {
    'home': Home,
    'auth': Auth,
    'account': Account,
    'flamechat': Flamechat,
    'satellite': Satellite,
    'paradox': Paradox,
    'drawer': Drawer,
    'media': Media,
  }
}
</script>

<style scoped>

</style>