export const pages = [
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

export const dynamicRoutes = [
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