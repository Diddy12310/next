import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Flamechat from './views/Flamechat'
import Changelog from './views/Changelog'
import Terms from './views/Terms'
import Notice from './views/Notice'
import Bookshelf from './views/Bookshelf'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
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
		}
  ]
})
