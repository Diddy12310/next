import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Flamechat from './views/Flamechat'
import FlamechatChatroom from './views/FlamechatChatroom'
import Changelog from './views/Changelog'
import Terms from './views/Terms'
import Notice from './views/Notice'
import Bookshelf from './views/Bookshelf'
import Drawer from './views/Drawer'
import Hex from './views/Hex'
import Launchpad from './views/Launchpad'
import Scorecard from './views/Scorecard'
import Support from './views/Support'
import PageNotFound from './views/404'
import News from './views/News'
import Satellite from './views/Satellite'

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
      path: '/company/changelog',
      name: 'Changelog',
      component: Changelog
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
			path:'*',
			component: PageNotFound
		}
  ]
})
