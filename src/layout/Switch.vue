<template>
  <div class="switch">
    <Home v-if="$root.switch == 'Home'"/>
    <Flamechat v-if="$root.switch == 'Flamechat'"/>
    <Roadmap v-if="$root.switch == 'Roadmap'"/>
    <Terms v-if="$root.switch == 'Terms'"/>
    <Drawer v-if="$root.switch == 'Drawer'"/>
    <Scorecard v-if="$root.switch == 'Scorecard'"/>
    <Support v-if="$root.switch == 'Support'"/>
    <News v-if="$root.switch == 'News'"/>
    <Satellite v-if="$root.switch == 'Satellite'"/>
    <Asteroid v-if="$root.switch == 'Asteroid'"/>
    <NetworkStatus v-if="$root.switch == 'NetworkStatus'"/>
    <LatestMemes v-if="$root.switch == 'LatestMemes'"/>
    <LatestVines v-if="$root.switch == 'LatestVines'"/>
    <Contracts v-if="$root.switch == 'Contracts'"/>
    <Databank v-if="$root.switch == 'Databank'"/>
    <Relay v-if="$root.switch == 'Relay'"/>
    <Media v-if="$root.switch == 'Media'"/>
    <Weather v-if="$root.switch == 'Weather'"/>
    <Notice v-if="$root.switch == 'Notice'"/>
    <PageNotFound v-if="$root.switch == 'PageNotFound'"/>
    <Arcade v-if="$root.switch == 'Games'"/>
    <Write v-if="$root.switch == 'Write'"/>
    <Show v-if="$root.switch == 'Show'"/>
    <Spread v-if="$root.switch == 'Spread'"/>
  </div>
</template>

<script>
import Home from '@/pages/Home'
import Flamechat from '@/pages/Flamechat'
import Roadmap from '@/pages/Company/Roadmap'
import Terms from '@/pages/Company/Terms'
import Drawer from '@/pages/Drawer'
import Scorecard from '@/pages/Scorecard'
import Support from '@/pages/Company/Support'
import News from '@/pages/News'
import Satellite from '@/pages/Satellite'
import Asteroid from '@/pages/Asteroid'
import NetworkStatus from '@/pages/Company/NetworkStatus'
import LatestMemes from '@/pages/Latest/Memes'
import LatestVines from '@/pages/Latest/Vines'
import Contracts from '@/pages/Devs/Contracts'
import Databank from '@/pages/Devs/Databank'
import Relay from '@/pages/Devs/Relay'
import About from '@/pages/Company/About'
import Media from '@/pages/Media'
import PageNotFound from '@/pages/404'
import Arcade from '@/pages/Arcade'
import Terminal from '@/components/Terminal'
import Weather from '@/pages/Weather'
import Notice from '@/pages/Company/Notice'
import Write from '@/pages/Office/Write'
import Show from '@/pages/Office/Show'
import Spread from '@/pages/Office/Spread'

export default {
  name: 'Switch',
  components: {
		Home, Flamechat, Roadmap, Terms, Drawer, Scorecard, Support, News, Satellite, Asteroid, NetworkStatus, LatestMemes,
		LatestVines, Contracts, Databank, Relay, Media, PageNotFound, Terminal, Weather, Notice, Arcade, Write, Show, Spread
	},
  data() {
    return {

    }
  }
}
</script>

<style scoped>

</style>
