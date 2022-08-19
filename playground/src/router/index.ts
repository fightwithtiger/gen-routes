import { createRouter, createWebHashHistory, Router, RouteRecordRaw } from 'vue-router'
import type { Page } from '../../../src'
import { createRoutesGenerator } from '../../../src'
// import { createRoutesGenerator } from '../../../dist'
import { getPages } from '../mock/index'

let pages: Page[] | null = null

const baseRoutes = [
  {
    name: 'home',
    path: '/',
    component: () => import('@/views/home.vue'),
    meta: {
      title: 'home'
    }
  }
]

const dynamicRoutes = [
  {
    name: 'page1',
    path: '/page1',
    component: () => import('@/views/page1.vue'),
    meta: {
      title: 'page1'
    }
  },
  {
    name: 'page2',
    path: '/page2',
    component: () => import('@/views/page2.vue'),
    meta: {
      title: 'page2'
    }
  },
  {
    name: 'page3',
    path: '/page3',
    component: () => import('@/views/page3.vue'),
    meta: {
      title: 'page3'
    }
  }
]

const routes = [
  ...baseRoutes
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// custom action
const action = (router: Router, matching: RouteRecordRaw[]) => {
  for (let route of matching) {
    console.log('customize Action')
    router.addRoute(route)
  }
}

const generate = createRoutesGenerator(action)(dynamicRoutes)

router.beforeEach(async (to, from , next) => {
  if(!pages) {
    pages = await getPages()
    generate(router, pages)
    next({ ...to })
  }else {
    next()
  }
})


export default router
