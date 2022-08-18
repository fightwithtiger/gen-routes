import type { RouteRecordRaw, Router } from 'vue-router'

export interface Page {
  id: number
  name: string
  zhName: string
  isMenu: boolean
  children: Page[]
}

export type PageName = Pick<Page, 'name' | 'zhName'>

export type ActionType = (router: Router, mathing: RouteRecordRaw[]) => void

let _action: ActionType | null = null

export function createRoutesGenerator(action?: ActionType) {
  _action = action ? action : defaultAction

  const generator = (dynamicRoutes: RouteRecordRaw[]) => {
    return function (router: Router, pages: Page[]) {
      const matching = getMatchingRoutes(pages, dynamicRoutes)
      _action!(router, matching)
    }
  }

  return generator
}

function defaultAction(router: Router, matching: RouteRecordRaw[]) {
  for (let route of matching) {
    router.addRoute(route)
  }
}

function getMatchingRoutes(pages: Page[], dynamicRoutes: RouteRecordRaw[]) {
  const pageNames = resolvePages(pages)
  const matching = match(dynamicRoutes, pageNames)

  return matching
}

function match(origin: RouteRecordRaw[], pageNames: PageName[], matching: RouteRecordRaw[] = []) {
  const routeNames = pageNames.map(i => i.name)

  for (let item of origin) {
    if (!item.name) {
      throw new Error('route.name empty')
    }
    if (routeNames.includes(item.name as string)) {
      const idx = matching.length
      matching[idx] = { ...item }
      if (!matching[idx].meta) {
        matching[idx].meta = {}
      }
      matching[idx].meta!.needLogin = true
      matching[idx].meta!.title = pageNames.find(i => i.name === item.name)?.zhName || matching[idx].meta!.title || ''
      matching[idx].children = []

      if (item.children && item.children.length > 0) {
        match(item.children, pageNames, matching[idx].children)
      }
    }
  }

  return matching
}

function resolvePages(pages: Page[]) {
  const routeNames: PageName[] = []

  for (let page of pages) {
    resolvePage(page)
  }

  return routeNames

  function resolvePage(page: Page) {
    if (!page.children || page.children.length === 0) {
      routeNames.push({
        name: page.name,
        zhName: page.zhName
      })
      return
    }

    for (let p of page.children) {
      resolvePage(p)
    }
  }
}