import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/Home'
import Flamechat from './pages/Flamechat'
import Roadmap from './pages/Company/Roadmap'
import Terms from './pages/Company/Terms'
import Notice from './pages/Company/Notice'
import Drawer from './pages/Drawer'
import Scorecard from './pages/Scorecard'
import Support from './pages/Company/Support'
import News from './pages/News'
import Satellite from './pages/Satellite'
import Asteroid from './pages/Asteroid'
import NetworkStatus from './pages/Company/NetworkStatus'
import LatestMemes from './pages/Latest/Memes'
import LatestVines from './pages/Latest/Vines'
import Contracts from './pages/Devs/Contracts'
import Databank from './pages/Devs/Databank'
import Relay from './pages/Devs/Relay'
import About from './pages/Company/About'
import Media from './pages/Media'
import PageNotFound from './pages/404'
import Weather from './pages/Weather'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
			// name: 'Home',
			// component: Home
		},
		{
			path: '*',
			redirect: '/'
		}
		// {
		// 	path: '/home',
		// 	name: 'Home',
		// 	component: Home
		// },
    // {
    //   path: '/flame',
    //   name: 'Flamechat',
    //   component: Flamechat
		// },
    // {
    //   path: '/company/roadmap',
    //   name: 'Roadmap',
    //   component: Roadmap
    // },
    // {
    //   path: '/company/terms',
    //   name: 'Terms',
    //   component: Terms
    // },
    // {
    //   path: '/company/notice',
    //   name: 'Notice',
    //   component: Notice
		// },
		// {
		// 	path: '/drawer',
		// 	name: 'Drawer',
		// 	component: Drawer
		// },
		// {
		// 	path: '/scorecard',
		// 	name: 'Scorecard',
		// 	component: Scorecard
		// },
		// {
		// 	path: '/company/support',
		// 	name: 'Support',
		// 	component: Support
		// },
		// {
		// 	path: '/paradox',
		// 	name: 'News',
		// 	component: News
		// },
		// {
		// 	path: '/satellite',
		// 	name: 'Satellite',
		// 	component: Satellite
		// },
		// {
		// 	path: '/asteroid',
		// 	name: 'Asteroid',
		// 	component: Asteroid
		// },
		// {
		// 	path: '/company/status',
		// 	name: 'NetworkStatus',
		// 	component: NetworkStatus
		// },
		// {
		// 	path:'*',
		// 	name: 'PageNotFound',
		// 	component: PageNotFound
		// },
		// {
		// 	path: '/latest/memes',
		// 	name: 'LatestMemes',
		// 	component: LatestMemes
		// },
		// {
		// 	path: '/latest/vines',
		// 	name: 'LatestVines',
		// 	component: LatestVines
		// },
		// {
		// 	path: '/dev/contracts',
		// 	name: 'Contracts',
		// 	component: Contracts
		// },
		// {
		// 	path: '/dev/relay',
		// 	name: 'Relay',
		// 	component: Relay
		// },
		// {
		// 	path: '/dev/databank',
		// 	name: 'Databank',
		// 	component: Databank
		// },
		// {
		// 	path: '/company/about',
		// 	name: 'About',
		// 	component: About
		// },
		// {
		// 	path: '/media',
		// 	name: 'Media',
		// 	component: Media
		// },
		// {
		// 	path: '/weather',
		// 	name: 'Weather',
		// 	component: Weather
		// }
  ]
})
