# gen-routes

[![NPM version](https://img.shields.io/npm/v/gen-routes?color=a1b858&label=)](https://www.npmjs.com/package/gen-routes)

Dynamically generate routes based on the pages that can be viewed by the role. Used it in vue、vue-router program.

## Install

`pnpm install gen-routes`

## Usage

```typescript
import { createRouter, createWebHashHistory } from 'vue-router'
import type { MaybePage } from 'gen-routes'
import { createRoutesGenerator } from 'gen-routes'
import { getPages } from '../mock/index'

let pages: MaybePage[] | null = null

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
    name: 'menu1',
    title: '菜单一',
    children: [
      {
        name: 'page1',
        title: '页面1',
        children: []
      }
    ]
  },
  {
    name: 'menu2',
    title: '菜单二',
    children: [
      {
        name: 'page3',
        title: '页面3',
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

### Alias

The format of Pages is:

```typescript
{
	name: '',
	title: '',
	children: ''
}
```

But sometimes the database stores a field with a different name, so the alias parameter is provided. For example, I change the title to 'zhName':

```typescript
// provide pages
const pages = [
  {
    name: 'menu1',
    zhName: '菜单一',
    children: [
      {
        name: 'page1',
        zhName: '页面1',
        children: []
      }
    ]
  },
  {
    name: 'menu2',
    zhName: '菜单二',
    children: [
      {
        name: 'page3',
        zhName: '页面3',
        children: []
      }
    ]
  }
]

// router/index.ts
router.beforeEach(async (to, from , next) => {
  if(!pages) {
    pages = await getPages()
    
    // customize alias for page
    const alias = {
      title: 'zhName',
    }
    generate(router, pages, alias)
    next({ ...to })
  }else {
    document.title = to.meta.title as string
    next()
  }
})


```

### Notice

> **<font color='red'>gen-routes relies on only three attributes: name(router-name), title(router-meta-title), children(router-children), so, please do not overwrite these three property names!</font>**

## Implementation

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

## Other

All leaf nodes in the incoming data should correspond to a page route, which represents a menu-level should not appear in the route name, for example

```javascript
const pages = [
  {
    name: 'menu1',
    title: 'menu1',
    children: [
      {
        name: 'page1',
        title: 'menu1',
        children: []
      }
    ]
  },
]
```

Menu1 here is only used to configure page permissions to represent a page hierarchy, not a route, the real route should be page1. If your route involves child routes, such as: page: parent, whose child route is child, then you can set the returned Pages data as follows

```javascript
const pages = [
  {
    name: 'menu1',
    title: 'menu1',
    children: [
      {
        name: 'parent',
        title: 'parent',
        children: []
      },
       {
        name: 'child',
        title: 'child',
        children: []
      }
    ]
  },
]

// your dynamic routes should like
const dynamicRoutes = [
  {
    name: 'parent',
    path: '/parent',
    component: () => import('@/views/parent.vue'),
    meta: {
      title: 'parent'
    },
    children: [
        name: 'child',
        path: 'child',
        component: () => import('@/views/child.vue'),
        meta: {
          title: 'child'
        },
    ]
  },
 ]
```


## License

[MIT](./LICENSE) License © 2022 [fightwithtiger](https://github.com/fightwithtiger)
