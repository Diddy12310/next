import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Flamechat from './views/Flamechat'
import Changelog from './views/Changelog'
import Terms from './views/Terms'
import Notice from './views/Notice'
import Bookshelf from './views/Bookshelf'
import DevNet from './views/DevNet'
import Drawer from './views/Drawer'
import Hex from './views/Hex'
import Launchpad from './views/Launchpad'
import Scorecard from './views/Scorecard'
import Support from './views/Support'

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
      path: '/changelog',
      name: 'Changelog',
      component: Changelog
    },
    {
      path: '/terms',
      name: 'Terms',
      component: Terms
    },
    {
      path: '/notice',
      name: 'Notice',
      component: Notice
		},
		{
			path: '/bookshelf',
			name: 'Bookshelf',
			component: Bookshelf
		},
		{
			path: '/devnet',
			name: 'DevNet',
			component: DevNet
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
			path: '/support',
			name: 'Support',
			component: Support
		}
  ]
})
