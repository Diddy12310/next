import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Flamechat from './views/Flamechat'
import FlamechatChatroom from './views/FlamechatChatroom'
import Roadmap from './views/Company/Roadmap'
import Terms from './views/Company/Terms'
import Notice from './views/Company/Notice'
import Bookshelf from './views/Bookshelf'
import Drawer from './views/Drawer'
import Hex from './views/Hex'
import Launchpad from './views/Launchpad'
import Scorecard from './views/Scorecard'
import Support from './views/Company/Support'
import PageNotFound from './views/404'
import News from './views/News'
import Satellite from './views/Satellite'
import Movies from './views/Movies'
import Music from './views/Music'
import Pluto from './views/Pluto'
import NetworkStatus from './views/Company/NetworkStatus'
import LatestMemes from './views/Latest/Memes'
import LatestVines from './views/Latest/Vines'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
			redirect: '/home'
		},
		{
			path: '/home',
			name: 'Home',
			component: Home
		},
    {
      path: '/flamechat',
      name: 'Flamechat',
      component: Flamechat
		},
		{
			path: '/flamechat/chatroom',
			name: 'FlamechatChatroom',
			component: FlamechatChatroom,
			props: true,
			beforeEnter: (to, from, next) => {
				if(to.params.name) {
					next()
				} else {
					next({ name: 'Flamechat' })
				}
			}
		},
    {
      path: '/company/roadmap',
      name: 'Roadmap',
      component: Roadmap
    },
    {
      path: '/company/terms',
      name: 'Terms',
      component: Terms
    },
    {
      path: '/company/notice',
      name: 'Notice',
      component: Notice
		},
		{
			path: '/bookshelf',
			name: 'Bookshelf',
			component: Bookshelf
		},
		{
			path: '/drawer',
			name: 'Drawer',
			component: Drawer
		},
		{
			path: '/hex',
			name: 'Hex',
			component: Hex
		},
		{
			path: '/launchpad',
			name: 'Launchpad',
			component: Launchpad
		},
		{
			path: '/scorecard',
			name: 'Scorecard',
			component: Scorecard
		},
		{
			path: '/company/support',
			name: 'Support',
			component: Support
		},
		{
			path: '/paradox',
			name: 'News',
			component: News
		},
		{
			path: '/satellite',
			name: 'Satellite',
			component: Satellite
		},
		{
			path: '/movies',
			name: 'Movies',
			component: Movies
		},
		{
			path: '/music',
			name: 'Music',
			component: Music
		},
		{
			path: '/pluto',
			name: 'Pluto',
			component: Pluto
		},
		{
			path: '/company/status',
			name: 'Network Status',
			component: NetworkStatus
		},
		{
			path:'*',
			component: PageNotFound
		},
		{
			path: '/latest/memes',
			name: 'Latest Memes',
			component: LatestMemes
		},
		{
			path: '/latest/vines',
			name: 'Latest Vines',
			component: LatestVines
		}
  ]
})
