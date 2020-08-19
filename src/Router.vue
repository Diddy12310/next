<template>
  <div class="router" :style="{ marginBottom: $root.music ? '80px' : '0px' }">
    <v-fade-transition hide-on-leave group v-if="$root.user ? !$root.user.banned : true">
      <home key="home" v-if="$root.router === 'home'" />
      <auth key="auth" v-else-if="$root.router === 'auth'" />
      <account key="account" v-else-if="$root.router === 'account'" />
      <flamechat key="flamechat" v-else-if="$root.router === 'flamechat'" />
      <satellite key="satellite" v-else-if="$root.router === 'satellite'" />
      <paradox key="paradox" v-else-if="$root.router === 'paradox'" />
      <drawer key="drawer" v-else-if="$root.router === 'drawer'" />
      <media key="media" v-else-if="$root.router === 'media'" />
      <terminal key="terminal" v-else-if="$root.router === 'terminal'" />
      <patriot key="patriot" v-else-if="$root.router === 'patriot'" />
      <people key="people" v-else-if="$root.router === 'people'" />
      <broadcast key="broadcast" v-else-if="$root.router === 'broadcast'" />
      <downloads key="downloads" v-else-if="$root.router === 'downloads'" />
      <transmission key="transmission" v-else-if="$root.router === 'transmission'" />
      <developer key="developer" v-else-if="$root.router === 'developer'" />
      <privacy key="privacy" v-else-if="$root.router === 'privacy'" />
      <error key="error" v-else-if="$root.router === 'error'" />
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
import Terminal from '@/views/Terminal.vue'
import Patriot from '@/views/Patriot.vue'
import People from '@/views/People.vue'
import Broadcast from '@/views/Broadcast.vue'
import Downloads from '@/views/Downloads.vue'
import Transmission from '@/views/Transmission.vue'
import Developer from '@/views/Developer.vue'
import Privacy from '@/views/Privacy.vue'
import ErrorPg from '@/views/Error.vue'

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
    'terminal': Terminal,
    'patriot': Patriot,
    'people': People,
    'broadcast': Broadcast,
    'downloads': Downloads,
    'transmission': Transmission,
    'developer': Developer,
    'privacy': Privacy,
    'error': ErrorPg
  }
}
</script>