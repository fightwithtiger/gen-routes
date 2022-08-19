# [name]

[![NPM version](https://img.shields.io/npm/v/[name]?color=a1b858&label=)](https://www.npmjs.com/package/[name])

## Install

`pnpm install gen-routes`

## Usage

```typescript
import { createRouter, createWebHashHistory } from 'vue-router'
import type { Page } from 'gen-routes
import { createRoutesGenerator } from 'gen-routes'
import { getPages } from '../mock/index'

let pages: Page[] | null = null

// Routes that can be accessed without configuring permissions
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

// Routes that require permission to be accessed
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

// initialize only baseRoutes
const routes = [
  ...baseRoutes
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// initialize generate method by dynamicRoutes
const generate = createRoutesGenerator()(dynamicRoutes)


router.beforeEach(async (to, from , next) => {
  if(!pages) {
      
     // Get the pages that role can read
    pages = await getPages()
    
    // Compare the routing page that the user can see with dynamicRoutes and add it to the routes
    generate(router, pages)
    next({ ...to })
  }else {
    next()
  }
})


export default router

```

Through `router.getRoutes()`method, you can find the mathing dynamicRoutes in the router.

The format of Pages should be:

```typescript
const pages = [
  {
    id: 1,
    name: 'menu1',
    zhName: '菜单一',
    isMenu: true,
    children: [
      {
        id: 11,
        name: 'page1',
        zhName: '页面1',
        isMenu: true,
        children: []
      }
    ]
  },
  {
    id: 2,
    name: 'menu2',
    zhName: '菜单二',
    isMenu: true,
    children: [
      {
        id: 22,
        name: 'page3',
        zhName: 'page3',
        isMenu: false,
        children: []
      }
    ]
  }
]

export const getPages = () => {
  return Promise.resolve([...pages])
}

```

### Result

dynamicRoutes: `['page1', 'page2', 'page3']`

pages: `['page1', 'page3']`

So, the final new routes are `['page1', 'page2']`. Also, gen-routes supports children route.

## implementation

If read the source code, you'll find this codes:

```typescript
function defaultAction(router: Router, matching: RouteRecordRaw[]) {
  for (let route of matching) {
    router.addRoute(route)
  }
}
```

The code is to call router.addRoute method, and matching routes will be added to the router.

And you can customize the action method, write codes like this:

```typescript
// customize action method
const action = (router: Router, matching: RouteRecordRaw[]) => {
   // you can customize how to add matching routes to the router
  for (let route of matching) {
     console.log('customize Action')
    router.addRoute(route)
  }
}

const generate = createRoutesGenerator(action)(dynamicRoutes)
```



## License

[MIT](./LICENSE) License © 2021 [fightwithtiger](https://github.com/fightwithtiger)
