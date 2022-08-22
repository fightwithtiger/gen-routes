import type { RouteRecordRaw, Router } from 'vue-router'

export interface Page {
  name: string
  title: string
  children: Page[]
}

export type PageName = Pick<Page, 'name' | 'title'>

export type ActionType = (router: Router, mathing: RouteRecordRaw[]) => void

type TransferAny<T extends Record<string, any>> = {
  [K in keyof T]: any
}

export type PropsAlias = Partial<TransferAny<Page>>

export type MaybePage = Page | Record<string, any>

let _action: ActionType | null = null

let _alias: PropsAlias | null = null

export function createRoutesGenerator(action?: ActionType) {
  _action = action ? action : defaultAction

  const generator = (dynamicRoutes: RouteRecordRaw[]) => {
    return function (router: Router, pages: MaybePage[], alias?: PropsAlias) {
      if(alias) {
        _alias = alias
      }
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

function getMatchingRoutes(pages: MaybePage[], dynamicRoutes: RouteRecordRaw[]) {
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
      matching[idx].meta!.title = pageNames.find(i => i.name === item.name)?.title || matching[idx].meta!.title || ''
      matching[idx].children = []

      if (item.children && item.children.length > 0) {
        match(item.children, pageNames, matching[idx].children)
      }
    }
  }

  return matching
}

function resolvePages(pages: MaybePage[]) {
  const routeNames: PageName[] = []

  for (let page of pages) {
    resolvePage(page)
  }

  return routeNames

  function resolvePage(page: MaybePage) {
    updateAlias(page)
    if (!page.children || page.children.length === 0) {
      routeNames.push({
        name: page.name,
        title: page.title
      })
      return
    }

    for (let p of page.children) {
      resolvePage(p)
    }
  }
}

function updateAlias(page: Record<string , any>) {
  if(_alias) {
    for(let key in _alias) {
      const realKey = _alias[key as keyof PropsAlias]
      page[key] = page[realKey]
    }
  }
}